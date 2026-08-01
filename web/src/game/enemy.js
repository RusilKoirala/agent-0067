import { GAME_CONFIG } from '../constants/gameConfig';

export function updateAndDrawEnemies(
  ctx,
  enemiesRef,
  bulletsRef,
  scoreRef,
  onScoreChange,
) {
  const now = Date.now();

  // Update & Draw
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
        return false;
      }
      return true;
    });

    if (hit) {
      // Explosion FX
      ctx.fillStyle = '#ffff00';
      ctx.fillRect(enemy.x - 5, enemy.y - 5, 40, 40);
      ctx.fillStyle = '#ff8800';
      ctx.fillRect(enemy.x, enemy.y, 30, 30);
      return false;
    }

    // Render Alien Sprite
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(enemy.x + 10, enemy.y, 10, 10); // Head
    ctx.fillRect(enemy.x + 5, enemy.y + 10, 20, 15); // Body
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(enemy.x + 12, enemy.y + 3, 2, 2); // Eyes
    ctx.fillRect(enemy.x + 16, enemy.y + 3, 2, 2);

    return enemy.y < GAME_CONFIG.CANVAS_HEIGHT;
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
