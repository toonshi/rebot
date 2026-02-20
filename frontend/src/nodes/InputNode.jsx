import React from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';
import NodeMentionsInput from '../components/NodeMentionsInput';

const InputNode = ({ id, data }) => {
  const { setNodes } = useReactFlow();

  const updateField = (field, value) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, [field]: value } } : node
      )
    );
  };

  return (
    <div className="node-card node-card--input">
      {/* Var name */}
      <div className="node-card__varname">
        <label className="node-card__varname-label" htmlFor={`${id}-varname`}>Var name</label>
        <input
          id={`${id}-varname`}
          className="node-card__varname-input"
          placeholder="e.g. UserQuery"
          defaultValue={data.varName}
          onChange={(e) => updateField('varName', e.target.value)}
        />
      </div>

      <div className="node-card__title-row">
        <div className="node-card__icon-box" aria-hidden="true">→</div>
        <span className="node-card__title">Input / Query</span>
      </div>

      {/* Value field */}
      <div className="node-card__field">
        <label className="node-card__label">Query</label>
        <NodeMentionsInput
          placeholder="Enter data here…"
          value={data.label}
          onChange={(event, newValue) => updateField('label', newValue)}
        />
      </div>

      <Handle type="source" position={Position.Right} />
    </div>
  );
};

export default InputNode;
