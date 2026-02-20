import React, { useState, useEffect } from 'react';

const tabs = ['General', 'LLMs', 'Integrations', 'Projects'];

const Sidebar = ({ onLoadPipeline }) => {
  const [activeTab, setActiveTab] = useState('General');
  const [pipelines, setPipelines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (activeTab === 'Projects') {
      setLoading(true);
      fetch('http://localhost:8000/pipelines')
        .then(res => res.json())
        .then(data => { setPipelines(data); setLoading(false); })
        .catch(err => { console.error('Failed to load pipelines:', err); setLoading(false); });
    }
  }, [activeTab]);

  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="sidebar" aria-label="Node panel">
      {/* Tab navigation */}
      <nav className="sidebar__tabs" role="tablist" aria-label="Sidebar sections">
        {tabs.map((tab) => (
          <button
            key={tab}
            role="tab"
            aria-selected={activeTab === tab}
            className={`sidebar__tab${activeTab === tab ? ' sidebar__tab--active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </nav>

      {/* Content */}
      <div className="sidebar__content" role="tabpanel">

        {activeTab === 'General' && (
          <>
            <p className="sidebar__section-title">Inputs</p>
            <div
              className="node-item"
              draggable
              onDragStart={(e) => onDragStart(e, 'input')}
              title="Drag onto canvas"
            >
              <div className="node-item__icon" style={{ background: '#64748b' }}>→</div>
              Input / Query
            </div>
          </>
        )}

        {activeTab === 'LLMs' && (
          <>
            <p className="sidebar__section-title">Language Models</p>
            <div
              className="node-item"
              draggable
              onDragStart={(e) => onDragStart(e, 'gemini')}
              title="Drag onto canvas"
            >
              <img
                className="node-item__image"
                src="https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg"
                alt=""
                aria-hidden="true"
              />
              Gemini AI
            </div>
          </>
        )}

        {activeTab === 'Integrations' && (
          <>
            <p className="sidebar__section-title">Connectors</p>
            <div
              className="node-item"
              draggable
              onDragStart={(e) => onDragStart(e, 'google_meet')}
              title="Drag onto canvas"
            >
              <img
                className="node-item__image"
                src="https://upload.wikimedia.org/wikipedia/commons/9/9b/Google_Meet_icon_%282020%29.svg"
                alt=""
                aria-hidden="true"
              />
              Google Meet
            </div>
            <div
              className="node-item"
              draggable
              onDragStart={(e) => onDragStart(e, 'gmail')}
              title="Drag onto canvas"
            >
              <img
                className="node-item__image"
                src="https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg"
                alt=""
                aria-hidden="true"
              />
              Gmail
            </div>
          </>
        )}

        {activeTab === 'Projects' && (
          <>
            <p className="sidebar__section-title">Saved pipelines</p>
            {loading ? (
              <p className="loading-text">Loading…</p>
            ) : pipelines.length === 0 ? (
              <p className="empty-state">No projects saved yet.</p>
            ) : (
              pipelines.map((p) => (
                <div
                  key={p._id}
                  className="project-item"
                  onClick={() => onLoadPipeline(p)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && onLoadPipeline(p)}
                >
                  <strong>{p.name}</strong>
                  <span>{p.nodes.length} nodes</span>
                  {p.saved_at && (
                    <span className="project-item__date">
                      {new Date(p.saved_at).toLocaleDateString()}
                    </span>
                  )}
                </div>
              ))
            )}
          </>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
