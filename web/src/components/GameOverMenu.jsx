export default function GameOverMenu({ finalScore, leaderboard, roomId, showLeaderboard, onPlayAgain }) {
  const currentUserScore = finalScore;
  const sortedPlayers = leaderboard?.sort((a, b) => b.score - a.score) || [];
  const topPlayers = sortedPlayers.slice(0, 20); // top 20 onlyy plss

  return (
    <div className="game-over-screen">
      <h2>MISSION COMPLETE!</h2>
      <div className="final-stats">
        <p>YOUR SCORE: {currentUserScore}</p>
        <p>ENEMIES DESTROYED: {Math.floor(currentUserScore / 10)}</p>
      </div>

      <button onClick={onPlayAgain} className="start-game-btn" style={{ marginTop: '20px', maxWidth: '300px' }}>
        PLAY AGAIN
      </button>

      {showLeaderboard && roomId && leaderboard && leaderboard.length > 0 && (
        <div className="game-over-leaderboard">
          <h3>FINAL STANDINGS</h3>
          <p className="leaderboard-info">Showing Top {Math.min(20, leaderboard.length)} of {leaderboard.length} Agents</p>
          <div className="leaderboard-scroll-small">
            <table className="leaderboard-table">
              <thead>
                <tr>
                  <th>RANK</th>
                  <th>AGENT</th>
                  <th>SCORE</th>
                </tr>
              </thead>
              <tbody>
                {topPlayers.map((player, index) => (
                  <tr key={player.username} className={index < 3 ? `rank-${index + 1}` : ''}>
                    <td className="rank-cell">
                      {index + 1}
                      {index === 0 && ' 🥇'}
                      {index === 1 && ' 🥈'}
                      {index === 2 && ' 🥉'}
                    </td>
                    <td className="username-cell">{player.username}</td>
                    <td className="score-cell">{player.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {roomId && (
            <a
              href={`/leaderboard/${roomId}`}
              className="view-full-leaderboard"
              target="_blank"
              rel="noopener noreferrer"
            >
              VIEW FULL LIVE LEADERBOARD
            </a>
          )}
        </div>
      )}
    </div>
  );
}
