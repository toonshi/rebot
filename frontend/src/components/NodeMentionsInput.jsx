import React, { useEffect, useState } from 'react';
import { MentionsInput, Mention } from 'react-mentions';
import useNodeLineage from '../hooks/useNodeLineage';
import './Mentions.css';

const NodeMentionsInput = ({ value, onChange, placeholder, nodeId }) => {
  const [inputValue, setInputValue] = useState(value);
  const parents = useNodeLineage(nodeId);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleInputChange = (event, newValue) => {
    setInputValue(newValue);
    if (onChange) {
      onChange(event, newValue);
    }
  };

  const mentionableNodes = parents.flatMap(parent => {
    return parent.outputs.map(output => ({
      id: `${parent.varName}.${output}`,
      display: `${parent.varName} (${output.charAt(0).toUpperCase() + output.slice(1)})`
    }));
  });

  return (
    <MentionsInput
      value={inputValue}
      onChange={handleInputChange}
      placeholder={placeholder}
      className="nodrag mentions-input"
    >
      <Mention
        trigger="@"
        data={mentionableNodes}
        markup="{{__id__}}"
        displayTransform={(id, display) => display}
      />
    </MentionsInput>
  );
};

export default NodeMentionsInput;
