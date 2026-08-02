export default function HUD({ score, timeLeft, gameStarted, leaderboard, showLeaderboard }) {
  if (!gameStarted) return null;

  return (
    <>
      <div className="score-hud">
        <div className="hud-pill">TIME: {timeLeft}s</div>
        <div className="hud-pill score-pill">SCORE: {score}</div>
      </div>
      {showLeaderboard && (
        <div className="leaderboard-panel">
          <div className="leaderboard-panel-title">LIVE LEADERBOARD</div>
          {leaderboard.length === 0 && <div className="leaderboard-empty">no agents yet</div>}
          {leaderboard.map((player, index) => (
            <div key={player.username} className="leaderboard-row">
              <span className="leaderboard-rank">{index + 1}.</span>
              <span className="leaderboard-name">{player.username}</span>
              <span className="leaderboard-score">{player.score}</span>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
