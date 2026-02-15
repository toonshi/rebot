import React from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';

const GeminiNode = ({ id, data }) => {
  const { setNodes } = useReactFlow();

  // A generic updater for any field in this node
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
        border: '2px solid #ffcc00',
        borderRadius: '8px',
        padding: '12px',
        minWidth: '200px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
    }}>
      {/* NEW: Variable Name Field */}
      <div style={{ backgroundColor: '#f1f5f9', padding: '4px', marginBottom: '8px', borderRadius: '4px' }}>
        <label style={{ fontSize: '8px', fontWeight: 'bold', color: '#64748b' }}>VAR NAME</label>
        <input 
          placeholder="e.g. MySummary"
          onChange={(e) => updateField('varName', e.target.value)}
          defaultValue={data.varName}
          style={{ width: '100%', border: 'none', background: 'transparent', fontSize: '10px', outline: 'none' }}
        />
      </div>
      <Handle type="target" position={Position.Left} id="input" />
      
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>
        <img src="https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg" alt="G" style={{ width: '18px', marginRight: '8px' }} />
        <strong style={{ fontSize: '13px', color: '#444' }}>Gemini AI</strong>
      </div>

      {/* Variable Name Display */}
      <div style={{ backgroundColor: '#f1f5f9', padding: '6px', marginBottom: '8px', borderRadius: '4px' }}>
        <label style={{ fontSize: '8px', fontWeight: 'bold', color: '#64748b', display: 'block' }}>
          REFERENCE AS:
        </label>
        <input 
          placeholder="Variable Name"
          onChange={(e) => updateField('varName', e.target.value)}
          defaultValue={data.varName}
          style={{ width: '100%', border: 'none', background: 'transparent', fontSize: '11px', fontWeight: 'bold', color: '#0f172a', outline: 'none' }}
        />
      </div>

      {/* System Instructions Field */}
      <div style={{ marginBottom: '8px' }}>
        <label style={{ fontSize: '9px', fontWeight: 'bold', color: '#888', display: 'block' }}>SYSTEM</label>
        <textarea 
          placeholder="e.g. You are a helpful assistant..." 
          onChange={(e) => updateField('system', e.target.value)}
          defaultValue={data.system}
          style={{ width: '100%', fontSize: '10px', borderRadius: '4px', border: '1px solid #ddd', padding: '4px' }}
        />
      </div>

      {/* Main Prompt Field */}
      <div>
        <label style={{ fontSize: '9px', fontWeight: 'bold', color: '#888', display: 'block' }}>PROMPT</label>
        <textarea 
          placeholder="What should I do?" 
          onChange={(e) => updateField('label', e.target.value)}
          defaultValue={data.label}
          style={{ width: '100%', fontSize: '10px', borderRadius: '4px', border: '1px solid #ddd', padding: '4px' }}
        />
      </div>

      <Handle type="source" position={Position.Right} id="response" />
    </div>
  );
};

export default GeminiNode;