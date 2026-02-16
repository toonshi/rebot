import React, { useState, useEffect } from 'react';

const Sidebar = ({ onLoadPipeline }) => {
  const [activeTab, setActiveTab] = useState('General');

  const tabs = ['General', 'LLMs', 'Integrations', 'Your Projects'];

  const [pipelines, setPipelines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (activeTab === 'Your Projects') {
      setLoading(true);
      fetch('http://localhost:8000/pipelines')
        .then(res => res.json())
        .then(data => {
          setPipelines(data);
          setLoading(false);
        })
        .catch(error => {
          console.error("Failed to load pipelines:", error);
          setLoading(false);
        });
    }
  }, [activeTab]);

  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside style={sidebarContainerStyle}>
      {/* Tab Navigation */}
      <div style={tabHeaderStyle}>
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              ...tabButtonStyle,
              borderBottom: activeTab === tab ? '2px solid #3b82f6' : 'none',
              color: activeTab === tab ? '#3b82f6' : '#64748b',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Node List Area */}
      <div style={contentAreaStyle}>
        
        {/* Tab 1: General */}
        {activeTab === 'General' && (
          <div style={nodeListStyle}>
            <div 
              onDragStart={(e) => onDragStart(e, 'input')} 
              draggable 
              style={{ ...nodeItemStyle, borderColor: '#64748b' }}
            >
              <div style={iconBoxStyle('#64748b')}>→</div>
              Input / Query
            </div>
          </div>
        )}

        {/* Tab 2: LLMs */}
        {activeTab === 'LLMs' && (
          <div style={nodeListStyle}>
            <div 
              onDragStart={(e) => onDragStart(e, 'gemini')} 
              draggable 
              style={{ ...nodeItemStyle, borderColor: '#fbbf24' }}
            >
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg" 
                style={iconStyle} 
                alt="Gemini" 
              />
              Gemini AI
            </div>
          </div>
        )}

        {/* Tab 3: Integrations */}
        {activeTab === 'Integrations' && (
          <div style={nodeListStyle}>
            <div 
              onDragStart={(e) => onDragStart(e, 'google_meet')} 
              draggable 
              style={{ ...nodeItemStyle, borderColor: '#24a0ed' }}
            >
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/9/9b/Google_Meet_icon_%282020%29.svg" 
                style={iconStyle} 
                alt="Meet" 
              />
              Google Meet
            </div>
            <div 
              onDragStart={(e) => onDragStart(e, 'gmail')} 
              draggable 
              style={{ ...nodeItemStyle, borderColor: '#ea4335' }}
            >
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg" 
                style={iconStyle} 
                alt="Gmail" 
              />
              Gmail
            </div>
          </div>
        )}

        {/* Tab 4: Your Projects */}
        {activeTab === 'Your Projects' && (
          <div style={nodeListStyle}>
            <h3>Your Projects</h3>
            {loading ? (
              <p style={{ color: '#94a3b8', fontSize: '12px' }}>Loading projects...</p>
            ) : pipelines.length === 0 ? (
              <p style={{ color: '#94a3b8', fontSize: '12px' }}>No projects saved yet.</p>
            ) : (
              pipelines.map((p) => (
                <div key={p._id} className="project-item" onClick={() => onLoadPipeline(p)}>
                  <strong>{p.name}</strong>
                  <span>{p.nodes.length} nodes</span>
                  {p.saved_at && (
                    <span style={{ fontSize: '9px', color: '#cbd5e1', display: 'block', marginTop: '4px' }}>
                      {new Date(p.saved_at).toLocaleDateString()}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </aside>
  );
};

// --- Styles ---

const sidebarContainerStyle = { 
  width: '260px', 
  borderRight: '1px solid #e2e8f0', 
  background: '#f8fafc', 
  padding: '15px',
  height: '100%'
};

const tabHeaderStyle = { 
  display: 'flex', 
  gap: '10px', 
  marginBottom: '20px', 
  borderBottom: '1px solid #e2e8f0' 
};

const tabButtonStyle = { 
  background: 'none', 
  border: 'none', 
  padding: '8px 4px', 
  cursor: 'pointer', 
  fontSize: '12px', 
  fontWeight: '600',
  transition: 'all 0.2s ease'
};

const contentAreaStyle = {
  marginTop: '10px'
};

const nodeListStyle = { 
  display: 'flex', 
  flexDirection: 'column', 
  gap: '12px' 
};

const nodeItemStyle = { 
  padding: '12px', 
  border: '1px solid #cbd5e1', 
  borderRadius: '8px', 
  background: '#fff', 
  cursor: 'grab', 
  fontSize: '13px', 
  display: 'flex', 
  alignItems: 'center', 
  gap: '10px',
  boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
  transition: 'transform 0.1s ease'
};

const iconStyle = { 
  width: '18px', 
  height: '18px' 
};

const iconBoxStyle = (color) => ({
  width: '18px',
  height: '18px',
  backgroundColor: color,
  borderRadius: '4px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
  fontSize: '11px',
  fontWeight: 'bold'
});

// FIX: Ensure the default export is present
export default Sidebar;