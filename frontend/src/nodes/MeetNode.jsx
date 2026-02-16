import React, { useState } from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';

const MeetNode = ({ id, data }) => {
  const { setNodes } = useReactFlow();
  const [showTools, setShowTools] = useState(false);

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
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/9/9b/Google_Meet_icon_%282020%29.svg" 
            alt="Meet" 
            style={{ width: '18px', marginRight: '8px' }} 
          />
          <strong style={{ fontSize: '13px', color: '#444' }}>Google Meet</strong>
        </div>
        <button onClick={() => setShowTools(!showTools)} style={toolButtonStyle}>
          {showTools ? '-' : '+'}
        </button>
      </div>

      {showTools && (
        <div className="tools-drawer" style={{ borderTop: '1px solid #eee', paddingTop: '8px', marginTop: '8px' }}>
          <p style={{ fontSize: '9px', fontWeight: 'bold', color: '#888', marginBottom: '6px' }}>AVAILABLE PILLS:</p>
          {/* Clicking this "Pill" copies the reference to the user's clipboard */}
          <button 
             onClick={() => navigator.clipboard.writeText(`{{${data.varName || id}.transcript}}`)}
             style={pillStyle}
          >
            Transcript
          </button>
        </div>
      )}

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

// Inline styles for the tools button and pills
const toolButtonStyle = {
  background: '#e0e0e0',
  border: 'none',
  borderRadius: '50%',
  width: '20px',
  height: '20px',
  fontSize: '14px',
  fontWeight: 'bold',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#555',
  marginLeft: '10px',
  flexShrink: 0,
};

const pillStyle = {
  background: '#3b82f6',
  color: 'white',
  border: 'none',
  borderRadius: '15px',
  padding: '5px 10px',
  fontSize: '10px',
  cursor: 'pointer',
  fontWeight: 'bold',
  marginRight: '5px',
  marginBottom: '5px',
  display: 'inline-block',
};

export default MeetNode;