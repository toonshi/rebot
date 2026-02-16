import React from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';
import NodeMentionsInput from '../components/NodeMentionsInput';
import useNodeLineage from '../hooks/useNodeLineage';
import useSmartSuggestions from '../hooks/useSmartSuggestions'; // Import the new hook

const GeminiNode = ({ id, data, type }) => { // Added 'type' prop
  const { setNodes } = useReactFlow();
  const parents = useNodeLineage(id);

  // Use the new custom hook for smart suggestions
  const activeSuggestions = useSmartSuggestions(id, type, data, parents);

  // A generic updater for any field in this node
  const updateField = (field, value) => {
    console.log(`[GeminiNode-${id}] updateField: Attempting to set field '${field}' to:`, value);
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          const newNodeData = { ...node.data, [field]: value };
          console.log(`[GeminiNode-${id}] updateField: New node data will be:`, newNodeData);
          return { ...node, data: newNodeData };
        }
        return node;
      })
    );
  };

  // The applySuggestion now accepts the suggestion object
  const applySuggestion = (suggestion) => {
    if (suggestion && suggestion.template) {
      updateField(suggestion.targetField, suggestion.template);
    }
  };

  return (
    <div className="smart-node gemini-style" style={{
        background: '#fff',
        border: '2px solid #ffcc00',
        borderRadius: '8px',
        padding: '12px',
        minWidth: '200px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
    }}>
      {activeSuggestions.map(suggestion => (
        <div key={`${id}-${suggestion.type}`} className="template-toast" onClick={() => applySuggestion(suggestion)} style={{
          position: 'absolute',
          top: '-35px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'linear-gradient(45deg, #6a11cb 0%, #2575fc 100%)',
          color: 'white',
          padding: '8px 15px',
          borderRadius: '20px',
          cursor: 'pointer',
          fontSize: '13px',
          whiteSpace: 'nowrap',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          zIndex: 10
        }}>
          {suggestion.text}
        </div>
      ))}
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

      {/* System Instructions Field */}
      <div style={{ marginBottom: '8px' }}>
        <label style={{ fontSize: '9px', fontWeight: 'bold', color: '#888', display: 'block' }}>SYSTEM</label>
        <NodeMentionsInput 
          nodeId={id}
          placeholder="e.g. You are a helpful assistant..." 
          value={data.system}
          onChange={(event, newValue) => updateField('system', newValue)}
        />
      </div>

      {/* Main Prompt Field */}
      <div>
        <label style={{ fontSize: '9px', fontWeight: 'bold', color: '#888', display: 'block' }}>PROMPT</label>
        <NodeMentionsInput 
          nodeId={id}
          placeholder="What should I do? Type @ to reference connected tools..." 
          value={data.label}
          onChange={(event, newValue) => updateField('label', newValue)}
        />
      </div>

      <Handle type="source" position={Position.Right} id="response" />

      <div className="tools-footer" style={{
        marginTop: '10px',
        paddingTop: '5px',
        borderTop: '1px solid #f0f0f0',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '5px',
      }}>
        {parents.map(p => (
          <div key={p.id} className="parent-pill" style={{
            background: '#eef2f7',
            color: '#4a5568',
            padding: '2px 8px',
            borderRadius: '12px',
            fontSize: '10px',
            fontWeight: '500',
          }}>
            Connected to {p.varName}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GeminiNode;