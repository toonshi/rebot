import React, { useState, useCallback, useRef, useMemo } from 'react';
import ReactFlow, { 
  addEdge, 
  Background, 
  Controls, 
  applyEdgeChanges, 
  applyNodeChanges, 
  ReactFlowProvider
} from 'reactflow';
import 'reactflow/dist/style.css';
import GeminiNode from './nodes/GeminiNode';
import Sidebar from './Sidebar';

const nodeTypes = {
  gemini: GeminiNode,
  // Add other custom nodes here if needed
};

let id = 0;
const getId = () => `node-${id++}`;

const App = () => {
  const reactFlowWrapper = useRef(null);
  
  const [nodes, setNodes] = useState([
    {
      id: 'node-0',
      type: 'gemini',
      position: { x: 250, y: 100 },
      data: { label: 'Gemini Node' } 
    },
  ]);
  
  const [edges, setEdges] = useState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [executionResult, setExecutionResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const onNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
  const onEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);
  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);
  
  const onDrop = useCallback((event) => {
    event.preventDefault();
    const type = event.dataTransfer.getData('application/reactflow');
    if (!type) return;

    const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
    const position = reactFlowInstance.project({
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    });

    const newNode = {
      id: getId(),
      type,
      position,
      data: { 
        label: `${type} node`,
        system: '', // Initialize system field
      },
    };
    setNodes((nds) => nds.concat(newNode));
  }, [reactFlowInstance]);

  const onRun = async () => {
    setIsLoading(true);
    setExecutionResult(null);

    const pipelineData = {
      pipeline_name: 'Manual Execution',
      nodes: nodes,
      edges: edges
    };

    try {
      const response = await fetch('http://localhost:8000/run-pipeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pipelineData),
      });
      
      const data = await response.json();
      const taskId = data.task_id;

      const pollInterval = setInterval(async () => {
        try {
          const statusResponse = await fetch(`http://localhost:8000/status/${taskId}`);
          const statusData = await statusResponse.json();

          if (statusData.status === 'SUCCESS' || statusData.status === 'completed') {
            setExecutionResult(statusData.result.final_results);
            setIsLoading(false);
            clearInterval(pollInterval);
          } else if (statusData.status === 'FAILURE') {
            setIsLoading(false);
            alert("Pipeline execution failed!");
            clearInterval(pollInterval);
          }
        } catch (err) {
          console.error("Polling error:", err);
        }
      }, 2000);

    } catch (error) {
      console.error("Failed to run pipeline:", error);
      setIsLoading(false);
      alert("Check if your Backend/Docker is running!");
    }
  };

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', position: 'relative' }}>
      <ReactFlowProvider>
        <Sidebar />
        
        <button 
          onClick={onRun}
          disabled={isLoading}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            zIndex: 10,
            padding: '10px 20px',
            backgroundColor: isLoading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontWeight: 'bold'
          }}
        >
          {isLoading ? 'Running...' : 'Run Pipeline!'}
        </button>

        <div style={{ flexGrow: 1, height: '100%' }} ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
          >
            <Background variant="dots" gap={12} size={1} />
            <Controls />
          </ReactFlow>
          
          {executionResult && (
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '200px',
              background: '#1e1e1e',
              color: '#00ff00',
              padding: '20px',
              overflowY: 'auto',
              zIndex: 1000,
              fontFamily: 'monospace'
            }}>
              <button onClick={() => setExecutionResult(null)} style={{float: 'right'}}>Close</button>
              <h3>Execution Output:</h3>
              <pre>{JSON.stringify(executionResult, null, 2)}</pre>
            </div>
          )}
        </div>
      </ReactFlowProvider>
    </div>
  );
}

export default App;