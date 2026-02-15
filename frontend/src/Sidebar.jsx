import React, { useState } from 'react';

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState('General');

  const tabs = ['General', 'LLMs', 'Integrations'];

  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside style={sidebarContainerStyle}>
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

      <div style={contentAreaStyle}>
        {activeTab === 'General' && (
          <div style={nodeListStyle}>
            <div onDragStart={(e) => onDragStart(e, 'default')} draggable style={nodeItemStyle}>
              Standard Node
            </div>
          </div>
        )}

        {activeTab === 'LLMs' && (
          <div style={nodeListStyle}>
            <div 
              onDragStart={(e) => onDragStart(e, 'gemini')} 
              draggable 
              style={{ ...nodeItemStyle, borderColor: '#fbbf24' }}
            >
              <img src="https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg" style={iconStyle} alt="" />
              Gemini AI
            </div>
          </div>
        )}

        {activeTab === 'Integrations' && (
          <div style={nodeListStyle}>
            <div 
              onDragStart={(e) => onDragStart(e, 'google_meet')} 
              draggable 
              style={{ ...nodeItemStyle, borderColor: '#24a0ed' }}
            >
              <img src="https://upload.wikimedia.org/wikipedia/commons/9/9b/Google_Meet_icon_%282020%29.svg" style={iconStyle} alt="" />
              Google Meet
            </div>
            <div 
              onDragStart={(e) => onDragStart(e, 'gmail')} 
              draggable 
              style={{ ...nodeItemStyle, borderColor: '#ea4335' }}
            >
              <img src="https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg" style={iconStyle} alt="" />
              Gmail
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

// Styles to match the sleek "Vision" UI
const sidebarContainerStyle = { width: '260px', borderRight: '1px solid #e2e8f0', background: '#f8fafc', padding: '15px' };
const tabHeaderStyle = { display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #e2e8f0' };
const tabButtonStyle = { background: 'none', border: 'none', padding: '8px 4px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' };
const nodeListStyle = { display: 'flex', flexDirection: 'column', gap: '10px' };
const nodeItemStyle = { padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', background: '#fff', cursor: 'grab', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' };
const iconStyle = { width: '16px', height: '16px' };
const contentAreaStyle = { flexGrow: 1, padding: '15px', overflowY: 'auto' };

export default Sidebar;
