import React, { useEffect, useState } from 'react';

const ProjectSidebar = ({ onLoadPipeline }) => {
  const [pipelines, setPipelines] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all saved NGO and student projects on mount
  useEffect(() => {
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
  }, []);

  return (
    <div className="project-sidebar">
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
  );
};

export default ProjectSidebar;
