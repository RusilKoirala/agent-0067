import { useCallback, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { useMediaPipe } from './hooks/useMediaPipe';
import GameCanvas from './components/GameCanvas';
import VideoOverlay from './components/VideoOverlay';
import HUD from './components/HUD';
import RoomLobby from './components/RoomLobby';
import GameOverMenu from './components/GameOverMenu';
import './App.css';

const serverUrl = 'https://agent.rusil.me';

export default function App() {
  const { videoRef, landmarkerRef, isModelReady, isRunning, errorMsg, startCamera } = useMediaPipe();
  const socketRef = useRef(null);
  const startTimerRef = useRef(null);
  const playerXRef = useRef(400);
  const bulletsRef = useRef([]);
  const triggerShootRef = useRef(() => {});
  const [connected, setConnected] = useState(false);
  const [room, setRoom] = useState(null);
  const [roomError, setRoomError] = useState('');
  const [gameMode, setGameMode] = useState(''); 
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const playerNameRef = useRef('');

  const setSnapshot = useCallback((snapshot) => {
    const nextRoom = { ...snapshot, selfSocketId: socketRef.current?.id };
    setRoom(nextRoom);

    const selfScore = nextRoom.players?.find((player) => player.username === playerNameRef.current)?.score;
    if (typeof selfScore === 'number') {
      setScore(selfScore);
    }
  }, []);

  const scheduleMatchStart = useCallback(({ startAt }) => {
    window.clearTimeout(startTimerRef.current);
    startTimerRef.current = window.setTimeout(() => {
      setScore(0);
      setTimeLeft(60);
      setGameOver(false);
      setGameStarted(true);
    }, Math.max(0, startAt - Date.now()));
  }, []);

  useEffect(() => {
    const socket = io(serverUrl, { transports: ['websocket'] });
    socketRef.current = socket;
    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));
    socket.on('connect_error', () => setRoomError('could not connect to the game server'));
    socket.on('room:updated', setSnapshot);
    socket.on('match:starting', scheduleMatchStart);
    socket.on('match:started', scheduleMatchStart);
    return () => {
      window.clearTimeout(startTimerRef.current);
      socket.disconnect();
    };
  }, [scheduleMatchStart, setSnapshot]);

  const emitWithResponse = useCallback((event, payload) => {
    setRoomError('');
    const onResponse = (response) => {
      if (!response?.ok) {
        setRoomError(response?.error || 'something went wrong');
        return;
      }
      if (response.room) setSnapshot(response.room);
    };
    if (payload === undefined) socketRef.current?.emit(event, onResponse);
    else socketRef.current?.emit(event, payload, onResponse);
  }, [setSnapshot]);

  const handleEnemyHit = useCallback(() => {
    socketRef.current?.emit('score:hit');
  }, []);

  const handlePlayerDamage = useCallback(() => {
    socketRef.current?.emit('score:damage');
  }, []);

  const updatePlayerName = useCallback((username) => {
    playerNameRef.current = username;
  }, []);

  // start a local single player game 
  const startSinglePlayerGame = useCallback(() => {
    playerNameRef.current = '';
    setScore(0);
    setTimeLeft(60);
    setGameOver(false);
    setGameStarted(true);
  }, []);

  // play again -> reset everything and go back to mode select
  const handlePlayAgain = useCallback(() => {
    playerNameRef.current = '';
    setGameStarted(false);
    setGameOver(false);
    setScore(0);
    setTimeLeft(60);
    setRoom(null);
    setGameMode('');
  }, []);

  const currentPlayerScore = room?.players?.find((player) => player.username === playerNameRef.current)?.score ?? score;

  return (
    <div className="app-container">
      <div className="fullscreen-game">
        <GameCanvas
          gameStarted={gameStarted}
          setGameStarted={setGameStarted}
          setGameOver={setGameOver}
          setScore={setScore}
          setTimeLeft={setTimeLeft}
          playerXRef={playerXRef}
          bulletsRef={bulletsRef}
          triggerShootRef={triggerShootRef}
          onEnemyHit={handleEnemyHit}
          onPlayerDamage={handlePlayerDamage}
        />

        <HUD
          score={currentPlayerScore}
          timeLeft={timeLeft}
          gameStarted={gameStarted}
          leaderboard={room?.players || []}
          showLeaderboard={gameMode === 'multi'}
        />

        {!gameStarted && !gameOver && (
          <RoomLobby
            connected={connected}
            room={room}
            error={roomError || errorMsg}
            isModelReady={isModelReady}
            isCameraReady={isRunning}
            gameMode={gameMode}
            setGameMode={setGameMode}
            onStartCamera={startCamera}
            onCreateRoom={(username) => {
              updatePlayerName(username);
              emitWithResponse('room:create', { username });
            }}
            onJoinRoom={(roomId, username) => {
              updatePlayerName(username);
              emitWithResponse('room:join', { roomId, username });
            }}
            onStartMatch={() => emitWithResponse('match:start')}
            onStartSinglePlayer={startSinglePlayerGame}
          />
        )}

        {gameOver && (
          <GameOverMenu
            finalScore={currentPlayerScore}
            leaderboard={room?.players || []}
            roomId={room?.roomId}
            showLeaderboard={gameMode === 'multi'}
            onPlayAgain={handlePlayAgain}
          />
        )}
      </div>

      {isRunning && (
        <VideoOverlay
          videoRef={videoRef}
          landmarkerRef={landmarkerRef}
          playerXRef={playerXRef}
          triggerShootRef={triggerShootRef}
        />
      )}
    </div>
  );
}
