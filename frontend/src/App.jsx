import React, { useState, useCallback } from 'react';
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
};

let id = 0;
const getId = () => `node-${id++}`;

const initialNodes = [
  {
    id: 'node-0',
    type: 'gemini',
    position: { x: 250, y: 100 },
    data: { label: 'Gemini Node' }
  },
];


const App = () => {
  const reactFlowWrapper = React.useRef(null);

  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState([]);

  const [reactFlowInstance, setReactFlowInstance] = useState(null);


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

    if (typeof type === 'undefined' || !type) return;

    const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
    const position = reactFlowInstance.project({
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    });

    const newNode = {
      id:getId(),
        type,
        position,
        data: { label: `${type} node` },
      };
      
    setNodes((nds) => nds.concat(newNode));
  }
, [reactFlowInstance]);   
    
  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh' }}>
      <ReactFlowProvider>
        <Sidebar />

        <div style={{ flexGrow: 1,height: '100%'}} ref={reactFlowWrapper}>
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
    </div>
    </ReactFlowProvider>
    </div>
  );
}

export default App;