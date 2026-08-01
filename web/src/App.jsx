import React, { useState, useRef } from 'react';
import { useMediaPipe } from './hooks/useMediaPipe';
import GameCanvas from './components/GameCanvas';
import VideoOverlay from './components/VideoOverlay';
import HUD from './components/HUD';
import StartMenu from './components/StartMenu';
import GameOverMenu from './components/GameOverMenu';
import './App.css';

export default function App() {
  const { videoRef, landmarkerRef, isModelReady, isRunning, errorMsg, startCamera } = useMediaPipe();

  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);

  // putting the postion refss
  // hl
  const playerXRef = useRef(400);
  const bulletsRef = useRef([]);
  const triggerShootRef = useRef(() => {});

  const handleStartGame = () => {
    setScore(0);
    setTimeLeft(60);
    setGameOver(false);
    setGameStarted(true);
  };

  return (
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
      />

      <HUD
        score={score}
        timeLeft={timeLeft}
        gameStarted={gameStarted}
      />

      {!gameStarted && !gameOver && (
        <StartMenu
          isModelReady={isModelReady}
          isRunning={isRunning}
          errorMsg={errorMsg}
          onStartCamera={startCamera}
          onStartGame={handleStartGame}
        />
      )}

      {gameOver && <GameOverMenu finalScore={score} onPlayAgain={handleStartGame} />}

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