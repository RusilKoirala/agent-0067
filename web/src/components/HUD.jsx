import React from 'react';

export default function HUD({ score, timeLeft, gameStarted, playerX, depth }) {
  return (
    <>
      <div className="score-hud">
        <div className="timer">Time: {timeLeft}s</div>
        <div className="score">SCORE: {score}</div>
      </div>

      {gameStarted && (
        <div className="debug-info">
          X: {Math.round(playerX)} | Depth: {depth.toFixed(2)}
        </div>
      )}
    </>
  );
}