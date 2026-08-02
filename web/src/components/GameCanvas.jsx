import { useEffect, useRef } from 'react';
import { GAME_CONFIG } from '../constants/gameConfig';
import { drawPlayer } from '../game/player';
import { updateAndDrawEnemies, updateAndDrawExplosions, spawnEnemyIfNeeded } from '../game/enemy';
import { updateAndDrawBullets, createBullet } from '../game/bullet';
import { soundManager } from '../utils/sound';

export default function GameCanvas({
  gameStarted,
  setGameStarted,
  setGameOver,
  setScore,
  setTimeLeft,
  playerXRef,
  bulletsRef,
  triggerShootRef,
  onEnemyHit,
  onPlayerDamage,
}) {

  // declaring basic references
  const canvasRef = useRef(null);
  const gameLoopRef = useRef(null);
  const enemiesRef = useRef([]);
  const explosionsRef = useRef([]);
  const scoreRef = useRef(0);
  const lastEnemySpawnRef = useRef(0);
  const gameStartTimeRef = useRef(null);
  const lastFrameTimeRef = useRef(0);
  const damageCooldownRef = useRef(0);

 // sound managar gets  LOADDED
  useEffect(() => {
    soundManager.loadSounds();
  }, []);

  useEffect(() => {
    triggerShootRef.current = () => {
      if (!gameStarted) return;
      bulletsRef.current.push(createBullet(playerXRef.current, GAME_CONFIG.CANVAS_HEIGHT));
    };
  }, [bulletsRef, gameStarted, playerXRef, triggerShootRef]);

  // run the game loop
  useEffect(() => {
    if (!gameStarted) return;

    gameStartTimeRef.current = Date.now();
    scoreRef.current = 0;
    bulletsRef.current = [];
    enemiesRef.current = [];
    explosionsRef.current = [];
    lastEnemySpawnRef.current = Date.now();

   // background cool musicc
    soundManager.playBackgroundMusic();

    const loop = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');

      const now = performance.now();
      const deltaMs = lastFrameTimeRef.current ? Math.min(32, now - lastFrameTimeRef.current) : 16.67;
      lastFrameTimeRef.current = now;
      const dt = deltaMs / 16.67;

      // update the timer
      const elapsed = (Date.now() - gameStartTimeRef.current) / 1000;
      const remaining = Math.max(0, GAME_CONFIG.GAME_DURATION_SEC - Math.floor(elapsed));
      setTimeLeft(remaining);

      if (remaining <= 0) {
        setGameOver(true);
        setGameStarted(false);
        soundManager.stopBackgroundMusic(); 
        cancelAnimationFrame(gameLoopRef.current);
        return;
      }

      // clear the background
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, GAME_CONFIG.CANVAS_WIDTH, GAME_CONFIG.CANVAS_HEIGHT);

      // draw the starfield
      ctx.fillStyle = '#ffffff';
      for (let i = 0; i < 50; i++) {
        const x = (i * 37) % GAME_CONFIG.CANVAS_WIDTH;
        const y = (i * 53) % GAME_CONFIG.CANVAS_HEIGHT;
        ctx.fillRect(x, y, 2, 2);
      }

      // update the game entities with time-based movement so 60/120Hz screens behave the same
      updateAndDrawBullets(ctx, bulletsRef, dt);
      spawnEnemyIfNeeded(enemiesRef, lastEnemySpawnRef, dt);
      updateAndDrawEnemies(ctx, enemiesRef, bulletsRef, scoreRef, setScore, onEnemyHit, onPlayerDamage, explosionsRef, playerXRef, damageCooldownRef, dt);
      updateAndDrawExplosions(ctx, explosionsRef);
      drawPlayer(ctx, playerXRef.current, GAME_CONFIG.CANVAS_HEIGHT);

      gameLoopRef.current = requestAnimationFrame(loop);
    };

    gameLoopRef.current = requestAnimationFrame(loop);

    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
      soundManager.stopBackgroundMusic(); 
    };
  }, [gameStarted, onEnemyHit, setGameOver, setGameStarted, setScore, setTimeLeft, playerXRef, bulletsRef]);

  // return the game canvas
  return (
    <canvas
    ref={canvasRef}
    width={GAME_CONFIG.CANVAS_WIDTH}
    height={GAME_CONFIG.CANVAS_HEIGHT}
    className="game-canvas"
    />
  )
}
