import React from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';
import NodeMentionsInput from '../components/NodeMentionsInput';
import useNodeLineage from '../hooks/useNodeLineage';
import useSmartSuggestions from '../hooks/useSmartSuggestions';

const GeminiNode = ({ id, data, type }) => {
  const { setNodes } = useReactFlow();
  const parents = useNodeLineage(id);
  const activeSuggestions = useSmartSuggestions(id, type, data, parents);

  const updateField = (field, value) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, [field]: value } } : node
      )
    );
  };

  const applySuggestion = (suggestion) => {
    if (suggestion?.template) updateField(suggestion.targetField, suggestion.template);
  };

  return (
    <div className="node-card node-card--gemini" style={{ position: 'relative' }}>
      {activeSuggestions.map((suggestion) => (
        <button
          key={`${id}-${suggestion.type}`}
          className="template-toast"
          onClick={() => applySuggestion(suggestion)}
        >
          {suggestion.text}
        </button>
      ))}

      {/* Var name */}
      <div className="node-card__varname">
        <label className="node-card__varname-label" htmlFor={`${id}-varname`}>Var name</label>
        <input
          id={`${id}-varname`}
          className="node-card__varname-input"
          placeholder="e.g. MySummary"
          defaultValue={data.varName}
          onChange={(e) => updateField('varName', e.target.value)}
        />
      </div>

      <Handle type="target" position={Position.Left} id="input" />

      {/* Title row */}
      <div className="node-card__title-row">
        <img
          className="node-card__icon"
          src="https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg"
          alt="Gemini"
        />
        <span className="node-card__title">Gemini AI</span>
      </div>

      {/* System field */}
      <div className="node-card__field">
        <label className="node-card__label">System</label>
        <NodeMentionsInput
          nodeId={id}
          placeholder="e.g. You are a helpful assistant…"
          value={data.system}
          onChange={(event, newValue) => updateField('system', newValue)}
        />
      </div>

      {/* Prompt field */}
      <div className="node-card__field">
        <label className="node-card__label">Prompt</label>
        <NodeMentionsInput
          nodeId={id}
          placeholder="What should I do? Type @ to reference connected nodes…"
          value={data.label}
          onChange={(event, newValue) => updateField('label', newValue)}
        />
      </div>

      <Handle type="source" position={Position.Right} id="response" />

      {parents.length > 0 && (
        <div className="node-card__footer">
          {parents.map((p) => (
            <span key={p.id} className="node-card__pill">
              ↳ {p.varName}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default GeminiNode;
