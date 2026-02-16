import React from 'react';
import { MentionsInput, Mention } from 'react-mentions';
import useNodeLineage from '../hooks/useNodeLineage';
import './Mentions.css'; // Import the new CSS file

const NodeMentionsInput = ({ value, onChange, placeholder, nodeId }) => {
  const parents = useNodeLineage(nodeId);

  // Create the list of nodes and their outputs that can be @mentioned
  const mentionableNodes = parents.flatMap(parent => {
    return parent.outputs.map(output => ({
      id: `${parent.varName}.${output}`,
      display: `${parent.varName} (${output.charAt(0).toUpperCase() + output.slice(1)})` // e.g., "Meeting1 (Transcript)"
    }));
  });

  return (
    <MentionsInput
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="nodrag mentions-input" // Applying the className for styling
    >
      <Mention
        trigger="@"
        data={mentionableNodes}
        markup="{{__id__}}" // This will insert {{NodeName.output}}
        displayTransform={(id, display) => display} // Explicitly define displayTransform
      />
    </MentionsInput>
  );
};

export default NodeMentionsInput;
