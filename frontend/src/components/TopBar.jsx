import React from 'react';

const TopBar = ({ onSave, onRun, isLoading, lastSavedTime }) => (
  <header className="topbar" role="banner">
    <div className="topbar__brand">
      <div className="topbar__logo-icon" aria-hidden="true">⚡</div>
      <span className="topbar__title">rebot</span>
    </div>

    <div className="topbar__actions">
      {lastSavedTime && (
        <span className="topbar__saved-time" aria-live="polite">
          Saved {lastSavedTime}
        </span>
      )}
      <button className="btn btn--secondary" onClick={onSave}>
        Save
      </button>
      <button
        className="btn btn--primary"
        onClick={onRun}
        disabled={isLoading}
        aria-busy={isLoading}
      >
        {isLoading ? (
          <>
            <span className="btn__spinner" aria-hidden="true" />
            Running…
          </>
        ) : (
          'Run Pipeline'
        )}
      </button>
    </div>
  </header>
);

export default TopBar;
