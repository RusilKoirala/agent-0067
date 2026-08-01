import React, { useState, useRef } from 'react';
import { useMediaPipe } from './hooke/useMediaPipe';
import GameCanvas from './components/GameCanvas';
import VideoOverlay from './components/VideoOverlay';

import HUD from './components/HUD';
import StartMenu from './components/Menus/StartMenu';
import GameOverMenu from './components/Menue/GameOverMenu';
import './App.css'


export default function App() { 

  const { videoRef, landmarkerRef, isModelReady, isRunning, errorMsg, startCamera } = useMediaPipe;

  const [ gameStarted, setGameStarted ] = useState(false);
  const [ gameOver, setGameOver ] = useState(false);
  const [ score, setScore ] = useState(0);
  const [ timeLeft, setTimeLeft ] = useState(60);


  // game state refs
  const playerXRef = useRef(400);
  const playerDepthRef = useRef(0.5);


  const handleStartGame=() => {

    setScore(0);
    setGameOver(false);
    setGameStarted(true);
  };

  
}