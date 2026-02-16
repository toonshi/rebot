import React from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';
import NodeMentionsInput from '../components/NodeMentionsInput';

const InputNode = ({ id, data }) => {
  const { setNodes } = useReactFlow();

  const updateField = (field, value) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          return { ...node, data: { ...node.data, [field]: value } };
        }
        return node;
      })
    );
  };

  return (
    <div style={{
      background: '#fff',
      border: '2px solid #64748b', // Slate Gray to match the "Vision"
      borderRadius: '8px',
      padding: '12px',
      minWidth: '180px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    }}>
      {/* NEW: Variable Name Field */}
      <div style={{ backgroundColor: '#f1f5f9', padding: '4px', marginBottom: '8px', borderRadius: '4px' }}>
        <label style={{ fontSize: '8px', fontWeight: 'bold', color: '#64748b' }}>VAR NAME</label>
        <input 
          placeholder="e.g. UserQuery"
          onChange={(e) => updateField('varName', e.target.value)}
          defaultValue={data.varName}
          style={{ width: '100%', border: 'none', background: 'transparent', fontSize: '10px', outline: 'none' }}
        />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
        <strong style={{ fontSize: '12px', color: '#64748b' }}>Input / Query</strong>
      </div>
      
      <div style={{ fontSize: '10px', color: '#666' }}>
        <label>Field Name: <strong>Query</strong></label>
        <NodeMentionsInput 
          placeholder="Enter data here..." 
          value={data.label}
          onChange={(event, newValue) => updateField('label', newValue)}
        />
      </div>

      {/* Output only: Data flows OUT of this node into others */}
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

export default InputNode;