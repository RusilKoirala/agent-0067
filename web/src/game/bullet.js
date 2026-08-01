import { GAME_CONFIG } from '../constants/gameConfig';

export function updateAndDrawBullets(ctx, bulletsRef) {
  bulletsRef.current = bulletsRef.current.filter((bullet) => {
    bullet.y -= GAME_CONFIG.BULLET_SPEED;

    // Laser Beam Core
    ctx.fillStyle = '#ffff00';
    ctx.fillRect(bullet.x - 3, bullet.y, 6, 12);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(bullet.x - 1, bullet.y, 2, 12);

    return bullet.y > 0;
  });
}

export function createBullet(playerX, canvasHeight) {
  return {
    x: playerX,
    y: canvasHeight - 70,
  };
}
