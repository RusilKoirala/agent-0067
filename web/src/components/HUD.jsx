import React from 'react';

export default function HUD({ score, timeLeft, gameStarted }) {
  if (!gameStarted) return null;

  return (
    <div className="score-hud">
      <div>Time: {timeLeft}s</div>
      <div>SCORE: {score}</div>
    </div>
  );
}
