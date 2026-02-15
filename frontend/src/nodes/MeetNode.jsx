import React from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';

const MeetNode = ({ id, data }) => {
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
      border: '2px solid #24a0ed', // Google Meet Blue
      borderRadius: '8px',
      padding: '12px',
      minWidth: '200px',
      boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
      fontFamily: 'sans-serif'
    }}>
      {/* NEW: Variable Name Field */}
      <div style={{ backgroundColor: '#f1f5f9', padding: '4px', marginBottom: '8px', borderRadius: '4px' }}>
        <label style={{ fontSize: '8px', fontWeight: 'bold', color: '#64748b' }}>VAR NAME</label>
        <input 
          placeholder="e.g. MeetingDetails"
          onChange={(e) => updateField('varName', e.target.value)}
          defaultValue={data.varName}
          style={{ width: '100%', border: 'none', background: 'transparent', fontSize: '10px', outline: 'none' }}
        />
      </div>
      <Handle type="target" position={Position.Left} />
      
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/9/9b/Google_Meet_icon_%282020%29.svg" 
          alt="Meet" 
          style={{ width: '18px', marginRight: '8px' }} 
        />
        <strong style={{ fontSize: '13px', color: '#444' }}>Google Meet</strong>
      </div>

      <div style={{ marginBottom: '8px' }}>
        <label style={{ fontSize: '9px', fontWeight: 'bold', color: '#888', display: 'block' }}>MEETING ID / LINK</label>
        <input 
          placeholder="meet.google.com/abc-defg-hij" 
          onChange={(e) => updateField('label', e.target.value)} // Changed to use updateField
          defaultValue={data?.label || ''}
          style={{ 
            width: '100%', 
            fontSize: '10px', 
            padding: '4px', 
            borderRadius: '4px', 
            border: '1px solid #ddd',
            marginTop: '4px',
            boxSizing: 'border-box'
          }}
        />
      </div>

      <Handle type="source" position={Position.Right} />
    </div>
  );
};

export default MeetNode;