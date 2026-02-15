import React from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';

const GmailNode = ({ id, data }) => {
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
      border: '2px solid #ea4335', // Gmail Red
      borderRadius: '8px',
      padding: '12px',
      minWidth: '200px',
      boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
    }}>
      {/* NEW: Variable Name Field */}
      <div style={{ backgroundColor: '#f1f5f9', padding: '4px', marginBottom: '8px', borderRadius: '4px' }}>
        <label style={{ fontSize: '8px', fontWeight: 'bold', color: '#64748b' }}>VAR NAME</label>
        <input 
          placeholder="e.g. EmailSender"
          onChange={(e) => updateField('varName', e.target.value)}
          defaultValue={data.varName}
          style={{ width: '100%', border: 'none', background: 'transparent', fontSize: '10px', outline: 'none' }}
        />
      </div>
      <Handle type="target" position={Position.Left} />
      
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
        <img src="https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg" alt="M" style={{ width: '18px', marginRight: '8px' }} />
        <strong style={{ fontSize: '13px' }}>Gmail</strong>
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

      <div style={{ marginBottom: '8px' }}>
        <label style={{ fontSize: '9px', fontWeight: 'bold', color: '#888' }}>RECIPIENT</label>
        <input 
          placeholder="email@example.com" 
          onChange={(e) => updateField('to', e.target.value)}
          style={{ width: '100%', fontSize: '10px', padding: '4px' }}
        />
      </div>

      <div>
        <label style={{ fontSize: '9px', fontWeight: 'bold', color: '#888' }}>BODY</label>
        <textarea 
          placeholder="Use {{node-id.output}} to reference AI" 
          onChange={(e) => updateField('label', e.target.value)}
          style={{ width: '100%', fontSize: '10px', height: '60px', padding: '4px' }}
        />
      </div>
      
      {/* No source handle usually needed for Gmail as it's an end-point */}
    </div>
  );
};

export default GmailNode;