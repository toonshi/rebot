import os
import google.genai as genai

from celery_app import celery_app




client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
model_name = 'models/gemini-flash-latest'



@celery_app.task(name="execute_pipeline_task")
def execute_pipeline_task(pipeline_data):
    # This is a placeholder for your orchestrator logic
    nodes = pipeline_data.get("nodes", [])
    results = {}
    
    
    for node in nodes:
        node_id = node['id']
        node_type = node['type']
        print(f"Executing Node {node_id} ({node_type})...")
        
        if node_type == 'gemini':
            user_prompt = node.get('data', {}).get('label', 'Default prompt')
            try:
                response = client.models.generate_content(model=model_name, contents=user_prompt)
                results[node_id] = {"output": response.text}
            except Exception as e:
                results[node_id] = {"error": str(e)}
        else:
            results[node_id] = {"output": "Processed non-AI node"}
            
    return {"status": "completed", "final_results": results}