import react from 'react';

const Sidebar = () => {
    const onDragStart = (event, nodeType) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };



  return (
    <aside style={{
      width: '200px',
      borderRight: '1px solid #eee',
      padding: '15px 10px',
      fontSize: '12px',
      background: '#fcfcfc'
    }}>
      <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>Components</div>
      
      <div 
        className="dndnode input" 
        onDragStart={(event) => onDragStart(event, 'input')} 
        draggable
        style={nodeStyle}
      >
        Input Node
      </div>

      <div style={{ fontWeight: 'bold', margin: '20px 0 10px' }}>Integrations</div>

      <div
        className="dndnode"
        onDragStart={(event) => onDragStart(event, 'gmail')}
        draggable
        style={{...nodeStyle, borderColor: '#4285F4'}}
      >
        Gmail
      </div>

      <div 
        className="dndnode" 
        onDragStart={(event) => onDragStart(event, 'gemini')} 
        draggable
        style={{...nodeStyle, borderColor: '#ffcc00'}}
      >
        Gemini AI
      </div>

      <div 
        className="dndnode output" 
        onDragStart={(event) => onDragStart(event, 'output')} 
        draggable
        style={nodeStyle}
      >
        Output Node
      </div>
    </aside>
  );
};

const nodeStyle = {
  height: '20px',
  padding: '4px',
  border: '1px solid #1a192b',
  borderRadius: '2px',
  marginBottom: '10px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'grab'
};

export default Sidebar;
