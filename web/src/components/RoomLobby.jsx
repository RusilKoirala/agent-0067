import { useState } from 'react';

export default function RoomLobby({
  connected,
  room,
  error,
  isModelReady,
  isCameraReady,
  gameMode,
  setGameMode,
  onStartCamera,
  onCreateRoom,
  onJoinRoom,
  onStartMatch,
  onStartSinglePlayer,
}) {
  const [step, setStep] = useState('mode');
  const [username, setUsername] = useState('');
  const [roomId, setRoomId] = useState('');
  const isOwner = room?.ownerSocketId && room.ownerSocketId === room.selfSocketId;

  // in a room (multiplayer lobby waiting room)
  if (room) {
    return (
      <div className="start-overlay">
        <h2>MISSION LOBBY</h2>
        <p className="room-code">ROOM CODE: {room.roomId}</p>
        <p>share this code with your squad</p>
        <div className="lobby-players">
          {room.players.map((player) => <div key={player.username}>{player.username}</div>)}
        </div>
        <button onClick={onStartCamera} disabled={!isModelReady || isCameraReady} className="start-game-btn">
          {!isModelReady ? 'LOADING MODEL...' : isCameraReady ? 'CAMERA READY' : 'START CAMERA'}
        </button>
        {room.status === 'countdown' && <p>mission launches in a moment...</p>}
        {isOwner && room.status === 'lobby' && (
          <button onClick={onStartMatch} className="start-game-btn">START MATCH</button>
        )}
        {!isOwner && room.status === 'lobby' && <p>waiting for the room creator to start...</p>}
        {error && <div className="error">{error}</div>}
      </div>
    );
  }

  // first: pick singleplayer or multiplayer
  if (step === 'mode') {
    return (
      <div className="start-overlay">
        <div className="hero-section">
          <img src="/67.gif" alt="Agent 67" className="hero-gif-tilted" onError={(e) => { e.target.style.display = 'none'; }} />
          <h1 className="hero-title">AGENT 67</h1>
          <div className="hero-subtitle">TOP SECRET MISSION</div>
        </div>

        <div className="game-mode-buttons">
          <button
            onClick={() => {
              setGameMode('single');
              setStep('username');
            }}
            className="start-game-btn mode-btn"
          >
            SINGLEPLAYER
          </button>
          <button
            onClick={() => {
              setGameMode('multi');
              setStep('username');
            }}
            className="start-game-btn mode-btn"
          >
            MULTIPLAYER
          </button>
        </div>
      </div>
    );
  }

  // single player then start camera then start the game :D
  if (step === 'username' && gameMode === 'single') {
    return (
      <div className="start-overlay">
        <img src="/67.gif" alt="Agent 67" className="game-logo" onError={(e) => { e.target.style.display = 'none'; }} />
        <h2>🕵️ AGENT 67</h2>
        <p className="instructions">
          <strong>SHOOT:</strong> jiggle your hands above your chest
          <br />
          <strong>MOVE:</strong> tilt your head left or right
        </p>
        <input
          className="lobby-input"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          placeholder="agent name"
          maxLength="20"
        />

        {!isCameraReady && (
          <button
            onClick={onStartCamera}
            disabled={!isModelReady}
            className="start-game-btn"
          >
            {!isModelReady ? 'LOADING MODEL...' : 'START CAMERA'}
          </button>
        )}

        {isCameraReady && (
          <button
            onClick={onStartSinglePlayer}
            disabled={!username.trim()}
            className="start-game-btn"
          >
            START MISSION
          </button>
        )}

        <button
          onClick={() => {
            setGameMode('');
            setStep('mode');
          }}
          className="start-game-btn"
          style={{ backgroundColor: '#555' }}
        >
          BACK
        </button>

        {error && <div className="error">{error}</div>}
      </div>
    );
  }

  // multiplayer then username then create/join room
  if (step === 'username') {
    return (
      <div className="start-overlay">
        <img src="/67.gif" alt="Agent 67" className="game-logo" onError={(e) => { e.target.style.display = 'none'; }} />
        <h2>🕵️ AGENT 67</h2>
        <input
          className="lobby-input"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          placeholder="username"
          maxLength="20"
        />
        <button
          onClick={() => setStep('room')}
          disabled={!username.trim()}
          className="start-game-btn"
        >
          CONTINUE
        </button>
        <button
          onClick={() => {
            setGameMode('');
            setStep('mode');
          }}
          className="start-game-btn"
          style={{ backgroundColor: '#555' }}
        >
          BACK
        </button>
      </div>
    );
  }

  // create or join room
  if (step === 'room') {
    return (
      <div className="start-overlay">
        <img src="/67.gif" alt="Agent 67" className="game-logo" onError={(e) => { e.target.style.display = 'none'; }} />
        <h2>🕵️ AGENT 67</h2>
        <div className="room-options">
          <div className="room-column">
            <button
              onClick={() => onCreateRoom(username)}
              disabled={!connected}
              className="start-game-btn"
            >
              CREATE ROOM
            </button>
          </div>
          <div className="room-column">
            <input
              className="lobby-input"
              value={roomId}
              onChange={(event) => setRoomId(event.target.value.toUpperCase())}
              placeholder="room code"
              maxLength="6"
            />
            <button
              onClick={() => onJoinRoom(roomId, username)}
              disabled={!connected || !roomId.trim()}
              className="start-game-btn"
            >
              JOIN ROOM
            </button>
          </div>
        </div>
        <button
          onClick={() => setStep('username')}
          className="start-game-btn"
          style={{ backgroundColor: '#555' }}
        >
          BACK
        </button>
        {!connected && <p>connecting to game server...</p>}
        {error && <div className="error">{error}</div>}
      </div>
    );
  }

  return null;
}
