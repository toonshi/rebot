import React, { useState, useCallback, useRef } from 'react';
import ReactFlow, { 
  addEdge, 
  Background, 
  Controls, 
  applyEdgeChanges, 
  applyNodeChanges, 
  ReactFlowProvider
} from 'reactflow';
import 'reactflow/dist/style.css';
import './App.css';
import GeminiNode from './nodes/GeminiNode';
import GmailNode from './nodes/GmailNode';
import InputNode from './nodes/InputNode';
import MeetNode from './nodes/MeetNode';
import Sidebar from './Sidebar';
import TopBar from './components/TopBar';

const nodeTypes = {
  gemini: GeminiNode,
  gmail: GmailNode,
  input: InputNode,
  google_meet: MeetNode,
};

const App = () => {
  const reactFlowWrapper = useRef(null);
  const nextId = useRef(1);
  const getId = useCallback(() => `node-${nextId.current++}`, []);

  const [nodes, setNodes] = useState([
    {
      id: 'node-0',
      type: 'gemini',
      position: { x: 250, y: 100 },
      data: { label: 'Gemini Node' },
    },
  ]);
  const [edges, setEdges] = useState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [executionResult, setExecutionResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);

  const onNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
  const onEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);
  const onConnect    = useCallback((params)  => setEdges((eds) => addEdge(params, eds)), []);

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

    const defaultNames = { gemini: 'Summary', gmail: 'Email', google_meet: 'Meeting', input: 'Query' };
    const newNode = {
      id: getId(),
      type,
      position,
      data: { label: '', varName: `${defaultNames[type] || 'Node'}_${nextId.current}` },
    };
    setNodes((nds) => nds.concat(newNode));
  }, [reactFlowInstance, nextId]);

  const onRun = async () => {
    setIsLoading(true);
    setExecutionResult(null);
    const pipelineData = { pipeline_name: 'Manual Execution', nodes, edges };
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
            alert('Pipeline execution failed!');
            clearInterval(pollInterval);
          }
        } catch (err) {
          console.error('Polling error:', err);
        }
      }, 2000);
    } catch (error) {
      console.error('Failed to run pipeline:', error);
      setIsLoading(false);
      alert('Check if your Backend/Docker is running!');
    }
  };

  const savePipeline = async () => {
    const pipelineData = { name: 'Sokoline Sync', nodes, edges };
    try {
      const response = await fetch('http://localhost:8000/pipelines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pipelineData),
      });
      const result = await response.json();
      setLastSavedTime(new Date(result.saved_at).toLocaleString());
      alert(`Project Saved! ID: ${result.id}`);
    } catch (error) {
      console.error('Save failed:', error);
      alert('Failed to save pipeline. Check your backend!');
    }
  };

  const loadPipeline = useCallback((pipeline) => {
    setNodes(pipeline.nodes || []);
    setEdges(pipeline.edges || []);
    setLastSavedTime(new Date(pipeline.saved_at).toLocaleString());
    setShowSidebar(false);
  }, [setNodes, setEdges]);

  return (
    <div className="app-shell">
      <TopBar
        onSave={savePipeline}
        onRun={onRun}
        isLoading={isLoading}
        lastSavedTime={lastSavedTime}
      />

      <ReactFlowProvider>
        <div className="app-body">
          {showSidebar && <Sidebar onLoadPipeline={loadPipeline} />}

          <div className="canvas-wrapper" ref={reactFlowWrapper}>
            <button
              className="sidebar-toggle"
              onClick={() => setShowSidebar(!showSidebar)}
              aria-label={showSidebar ? 'Hide sidebar' : 'Show node panel'}
            >
              {showSidebar ? '← Hide' : '☰ Nodes'}
            </button>

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
              <div className="execution-panel" role="region" aria-label="Execution output">
                <div className="execution-panel__header">
                  <h3 className="execution-panel__title">Execution Output</h3>
                  <button
                    className="execution-panel__close"
                    onClick={() => setExecutionResult(null)}
                    aria-label="Close output panel"
                  >
                    Close ✕
                  </button>
                </div>
                <pre className="execution-panel__output">
                  {JSON.stringify(executionResult, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </ReactFlowProvider>
    </div>
  );
};

export default App;
