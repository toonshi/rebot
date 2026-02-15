import os
import re
from collections import deque
import google.genai as genai

from celery_app import celery_app




client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
model_name = 'models/gemini-flash-latest'


def resolve_variables(text, results_map):
    """
    Replaces placeholders like {{node-0.output}} with actual values from results_map.
    """
    pattern = r"\{\{(node-\d+)\.(\w+)\}\}"
    
    def replace_match(match):
        node_id, field = match.groups()
        node_result = results_map.get(node_id, {})
        return str(node_result.get(field, f"[{node_id} DATA MISSING]"))

    return re.sub(pattern, replace_match, text)


def get_execution_order(nodes, edges):
    """
    Kahn's Algorithm for topological sorting.
    Ensures nodes execute in dependency order based on edges.
    Returns list of node IDs in correct execution order.
    """
    adj = {n['id']: [] for n in nodes}
    in_degree = {n['id']: 0 for n in nodes}
    
    for edge in edges:
        source = edge.get('source')
        target = edge.get('target')
        if source and target:
            adj[source].append(target)
            in_degree[target] += 1
    
    # Start with nodes that have no incoming edges
    queue = deque([n_id for n_id in in_degree if in_degree[n_id] == 0])
    order = []
    
    while queue:
        u = queue.popleft()
        order.append(u)
        for v in adj[u]:
            in_degree[v] -= 1
            if in_degree[v] == 0:
                queue.append(v)
    
    return order


@celery_app.task(name="execute_pipeline_task")
def execute_pipeline_task(pipeline_data):
    nodes = pipeline_data.get("nodes", [])
    edges = pipeline_data.get("edges", [])
    results = {}

    # 1. Get the mathematically correct order based on edges
    node_order = get_execution_order(nodes, edges)
    
    # 2. Map IDs back to node objects for easy lookup
    node_map = {n['id']: n for n in nodes}

    # 3. Execute in the calculated order
    for n_id in node_order:
        node = node_map.get(n_id)
        if not node:
            continue
        
        n_type = node['type']
        n_data = node.get('data', {})

        print(f"Executing Node {n_id} ({n_type})...")

        if n_type == 'gemini':
            # Resolve variables in label (prompt) and system fields
            resolved_prompt = resolve_variables(n_data.get('label', ''), results)
            resolved_system = resolve_variables(n_data.get('system', ''), results)

            try:
                contents = f"{resolved_system}\n\n{resolved_prompt}".strip()
                response = client.models.generate_content(model=model_name, contents=contents)
                results[n_id] = {"output": response.text}
            except Exception as e:
                results[n_id] = {"error": str(e)}

        elif n_type == 'gmail':
            # Resolve the recipient ('to') and the body ('label') using previous node results
            recipient = resolve_variables(n_data.get('to', ''), results)
            body = resolve_variables(n_data.get('label', ''), results)

            # Mock sending email (no OAuth) — useful for testing variable resolution
            print("--- MOCK GMAIL ACTION ---")
            print(f"To: {recipient}")
            print(f"Body: {body}")
            print("-------------------------")

            results[n_id] = {"status": "sent", "to": recipient}

        else:
            results[n_id] = {"output": "Processed non-AI node"}
            
    return {"status": "completed", "final_results": results}