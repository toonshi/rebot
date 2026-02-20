import React from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';
import NodeMentionsInput from '../components/NodeMentionsInput';

const GmailNode = ({ id, data }) => {
  const { setNodes } = useReactFlow();

  const updateField = (field, value) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, [field]: value } } : node
      )
    );
  };

  return (
    <div className="node-card node-card--gmail">
      {/* Var name */}
      <div className="node-card__varname">
        <label className="node-card__varname-label" htmlFor={`${id}-varname`}>Var name</label>
        <input
          id={`${id}-varname`}
          className="node-card__varname-input"
          placeholder="e.g. EmailSender"
          defaultValue={data.varName}
          onChange={(e) => updateField('varName', e.target.value)}
        />
      </div>

      <Handle type="target" position={Position.Left} />

      {/* Title row */}
      <div className="node-card__title-row">
        <img
          className="node-card__icon"
          src="https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg"
          alt="Gmail"
        />
        <span className="node-card__title">Gmail</span>
      </div>

      {/* Recipient */}
      <div className="node-card__field">
        <label className="node-card__label">Recipient</label>
        <NodeMentionsInput
          nodeId={id}
          placeholder="email@example.com"
          value={data.to}
          onChange={(event, newValue) => updateField('to', newValue)}
        />
      </div>

      {/* Body */}
      <div className="node-card__field">
        <label className="node-card__label">Body</label>
        <NodeMentionsInput
          nodeId={id}
          placeholder="Use @ to reference connected nodes"
          value={data.body}
          onChange={(event, newValue) => updateField('body', newValue)}
        />
      </div>
    </div>
  );
};

export default GmailNode;
