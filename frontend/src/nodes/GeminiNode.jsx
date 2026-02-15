import react from 'react';
import { Handle, Position } from 'reactflow';

const GeminiNode = ({ data }) => {
    return (
        <div style= {{
            background: '#fff',
            border: '2px solid #ffcc00',
            borderRadius: '5px',
            padding: '10px',
            minwidtg: '150px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>

            {/* Top Handle (Input) */}
      <Handle type="target" position={Position.Left} />
      
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg" 
          alt="Gemini" 
          style={{ width: '20px', marginRight: '10px' }} 
        />
        <strong style={{ fontSize: '12px' }}>Gemini AI</strong>
      </div>

      <div style={{ fontSize: '10px', color: '#666' }}>
        <label>Prompt:</label>
        <textarea 
          placeholder="Enter prompt..." 
          style={{ width: '100%', fontSize: '10px', marginTop: '4px' }}
        />
      </div>

      {/* Bottom Handle (Output) */}
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

export default GeminiNode;