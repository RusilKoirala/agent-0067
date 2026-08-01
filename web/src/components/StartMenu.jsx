import React from 'react';

export default function StartMenu({ isModelReady, isRunning, errorMsg, onStartCamera, onStartGame }) {
  return (
    <div className="start-overlay">
      <h2>🕵️ AGENT 67</h2>
      <div className="instructions">
        <p><strong>SHOOT:</strong> Six-Seven jiggle (alternate hands high above chest)</p>
        <p><strong>MOVE:</strong> Tilt head left or right</p>
        <p><strong>DEPTH:</strong> Lean forward or backward</p>
      </div>

      <button onClick={onStartCamera} disabled={!isModelReady || isRunning} className="start-game-btn">
        {!isModelReady ? 'Loading Model...' : isRunning ? 'Camera Ready' : 'Start Camera'}
      </button>

      {isRunning && (
        <button onClick={onStartGame} className="start-game-btn" style={{ marginTop: '10px' }}>
        START MISSION
        </button>
      )}

      {errorMsg && <div className="error">{errorMsg}</div>}
    </div>
  );
}