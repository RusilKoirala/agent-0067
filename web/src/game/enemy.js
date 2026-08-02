import { GAME_CONFIG } from '../constants/gameConfig';
import { soundManager } from '../utils/sound';

export function updateAndDrawEnemies(
  ctx,
  enemiesRef,
  bulletsRef,
  scoreRef,
  onScoreChange,
  onEnemyHit,
  explosionsRef,
  playerXRef,
) {


  // update and draw enemies
  enemiesRef.current = enemiesRef.current.filter((enemy) => {
    enemy.y += enemy.speed;

    let hit = false;
    bulletsRef.current = bulletsRef.current.filter((bullet) => {
      const xDistance = Math.abs(bullet.x - (enemy.x + 15));
      const yDistance = Math.abs(bullet.y - (enemy.y + 12.5));

      if (
        xDistance < GAME_CONFIG.COLLISION_X_DIST &&
        yDistance < GAME_CONFIG.COLLISION_Y_DIST
      ) {
        hit = true;
        scoreRef.current += 10;
        onScoreChange(scoreRef.current);
        onEnemyHit?.();
        
        // play phew phew sound when enemy gets hit
        soundManager.playFire();
        
        return false;
      }
      return true;
    });

    if (hit) {
    
      explosionsRef.current.push({
        x: enemy.x,
        y: enemy.y,
        frame: 0,
        type: 'hit', 
      });
      return false;
    }

    
    const playerY = GAME_CONFIG.CANVAS_HEIGHT - 80;
    const playerX = playerXRef.current;
    
  
    const xDistance = Math.abs((enemy.x + 15) - playerX);
    const yDistance = Math.abs((enemy.y + 12.5) - playerY);
    
    if (xDistance < 30 && yDistance < 40 && enemy.y >= playerY - 40) {
 
      explosionsRef.current.push({
        x: enemy.x,
        y: enemy.y,
        frame: 0,
        type: 'damage', 
      });
      
 
      soundManager.playPlayerHit();
      

      scoreRef.current = Math.max(0, scoreRef.current - 5);
      onScoreChange(scoreRef.current);
      
      return false; 
    }


    if (enemy.y >= GAME_CONFIG.CANVAS_HEIGHT) {
      return false; 
    }

    // render the ENEMYY
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(enemy.x + 10, enemy.y, 10, 10); 
    ctx.fillRect(enemy.x + 5, enemy.y + 10, 20, 15); 
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(enemy.x + 12, enemy.y + 3, 2, 2);
    ctx.fillRect(enemy.x + 16, enemy.y + 3, 2, 2);

    return true; 
  });
}

export function updateAndDrawExplosions(ctx, explosionsRef) {
  explosionsRef.current = explosionsRef.current.filter((explosion) => {
    const frame = explosion.frame;
    const maxFrames = 10;

    if (frame >= maxFrames) {
      return false; // remove explosion
    }

    const size = 30 + (frame * 2);
    const alpha = 1 - (frame / maxFrames);

    if (explosion.type === 'hit') {
     
      ctx.globalAlpha = alpha;
      ctx.fillStyle = '#ffff00';
      ctx.fillRect(explosion.x - 5, explosion.y - 5, size + 10, size + 10);
      ctx.fillStyle = '#ff8800';
      ctx.fillRect(explosion.x, explosion.y, size, size);
      ctx.fillStyle = '#ff0000';
      ctx.fillRect(explosion.x + 5, explosion.y + 5, size - 10, size - 10);
      ctx.globalAlpha = 1;
    } else if (explosion.type === 'damage') {

      ctx.globalAlpha = alpha;
      ctx.fillStyle = '#ff0000';
      ctx.fillRect(explosion.x - 5, explosion.y - 5, size + 10, size + 10);
      ctx.fillStyle = '#ff4444';
      ctx.fillRect(explosion.x, explosion.y, size, size);
      ctx.fillStyle = '#ff8888';
      ctx.fillRect(explosion.x + 5, explosion.y + 5, size - 10, size - 10);
      ctx.globalAlpha = 1;
    }

    explosion.frame++;
    return true;
  });
}

export function spawnEnemyIfNeeded(enemiesRef, lastEnemySpawnRef) {
  const now = Date.now();
  if (now - lastEnemySpawnRef.current > GAME_CONFIG.ENEMY_SPAWN_INTERVAL_MS) {
    enemiesRef.current.push({
      x: Math.random() * (GAME_CONFIG.CANVAS_WIDTH - 40),
      y: 0,
      speed: 2 + Math.random() * 2,
    });
    lastEnemySpawnRef.current = now;
  }
}
