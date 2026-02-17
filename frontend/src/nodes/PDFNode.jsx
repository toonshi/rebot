import React from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';
import NodeMentionsInput from '../components/NodeMentionsInput';
import useNodeLineage from '../hooks/useNodeLineage';

const PDFNode = ({ data, id }) => {
  const { setNodes } = useReactFlow();
  const parents = useNodeLineage(id);

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

  const onDownload = () => {
    if (data.file_url) {
      // Assuming the backend is running on localhost:8000
      window.open(`http://localhost:8000${data.file_url}`);
    }
  };

  return (
    <div className="pdf-node" style={{ border: '2px solid #ef4444', borderRadius: '8px', padding: '10px', background: '#fff' }}>
      <Handle type="target" position={Position.Left} />
      <div style={{ fontWeight: 'bold', color: '#b91c1c' }}>📄 PDF EXPORTER</div>
      <hr />

      <NodeMentionsInput 
        nodeId={id}
        value={data.content || ''}
        onChange={(event, newValue) => updateField('content', newValue)}
        placeholder="What should go in the PDF? (Use @)"
      />

      <div className="status-indicator" style={{marginTop: '10px'}}>
        {data.status === 'success' ? (
          <button onClick={onDownload} className="download-btn" style={{
            background: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            padding: '5px 10px',
            cursor: 'pointer'
          }}>Download PDF</button>
        ) : (
          <span style={{ fontSize: '10px' }}>Ready to generate...</span>
        )}
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

export default PDFNode;
