import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001';

export default function LiveLeaderboard() {
  const { roomCode } = useParams();
  const [leaderboard, setLeaderboard] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch(`${serverUrl}/leaderboard/${roomCode}`);
        const data = await response.json();
        
        if (data.ok) {
          setLeaderboard(data.room);
          setError('');
        } else {
          setError(data.error || 'Failed to load leaderboard');
        }
      } catch (err) {
        setError('Could not connect to server');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
    // refresh every 2 seconds for live updates
    const interval = setInterval(fetchLeaderboard, 2000);
    
    return () => clearInterval(interval);
  }, [roomCode]);

  if (loading) {
    return (
      <div className="leaderboard-page">
        <h1>🕵️ AGENT 67</h1>
        <p>Loading leaderboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="leaderboard-page">
        <h1>🕵️ AGENT 67</h1>
        <div className="error">{error}</div>
        <p>Room Code: {roomCode}</p>
      </div>
    );
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case 'lobby': return 'WAITING TO START';
      case 'countdown': return 'STARTING SOON';
      case 'playing': return 'MATCH IN PROGRESS';
      case 'finished': return 'MATCH FINISHED';
      default: return status?.toUpperCase();
    }
  };

  return (
    <div className="leaderboard-page">
      <img src="/logo.png" alt="Agent 67" className="game-logo" onError={(e) => { e.target.style.display = 'none'; }} />
      <h1>🕵️ AGENT 67 LEADERBOARD</h1>
      <div className="leaderboard-header">
        <p className="room-code-display">ROOM: {leaderboard.roomId}</p>
        <p className="status-badge">{getStatusLabel(leaderboard.status)}</p>
      </div>

      <div className="leaderboard-scroll">
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>RANK</th>
              <th>AGENT</th>
              <th>SCORE</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.players.map((player, index) => (
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

      <div className="leaderboard-footer">
        <p>Total Agents: {leaderboard.players.length}</p>
      </div>
    </div>
  );
}
