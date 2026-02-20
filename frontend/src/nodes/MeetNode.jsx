import React, { useState } from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';

const MeetNode = ({ id, data }) => {
  const { setNodes } = useReactFlow();
  const [showTools, setShowTools] = useState(false);

  const updateField = (field, value) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, [field]: value } } : node
      )
    );
  };

  return (
    <div className="node-card node-card--meet">
      {/* Var name */}
      <div className="node-card__varname">
        <label className="node-card__varname-label" htmlFor={`${id}-varname`}>Var name</label>
        <input
          id={`${id}-varname`}
          className="node-card__varname-input"
          placeholder="e.g. MeetingDetails"
          defaultValue={data.varName}
          onChange={(e) => updateField('varName', e.target.value)}
        />
      </div>

      <Handle type="target" position={Position.Left} />

      {/* Title row */}
      <div className="node-card__title-row">
        <img
          className="node-card__icon"
          src="https://upload.wikimedia.org/wikipedia/commons/9/9b/Google_Meet_icon_%282020%29.svg"
          alt="Google Meet"
        />
        <span className="node-card__title">Google Meet</span>
        <button
          className="node-card__expand-btn"
          onClick={() => setShowTools(!showTools)}
          aria-label={showTools ? 'Hide tools' : 'Show tools'}
          aria-expanded={showTools}
        >
          {showTools ? '−' : '+'}
        </button>
      </div>

      {showTools && (
        <div className="node-card__tools-drawer">
          <p className="node-card__tools-title">Available outputs</p>
          <button
            className="node-card__copy-pill"
            onClick={() => navigator.clipboard.writeText(`{{${data.varName || id}.transcript}}`)}
          >
            Copy Transcript ref
          </button>
        </div>
      )}

      {/* Meeting link */}
      <div className="node-card__field">
        <label className="node-card__label" htmlFor={`${id}-link`}>Meeting ID / Link</label>
        <input
          id={`${id}-link`}
          className="node-card__input"
          placeholder="meet.google.com/abc-defg-hij"
          defaultValue={data?.label || ''}
          onChange={(e) => updateField('label', e.target.value)}
        />
      </div>

      <Handle type="source" position={Position.Right} />
    </div>
  );
};

export default MeetNode;
