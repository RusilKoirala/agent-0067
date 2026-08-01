import { GAME_CONFIG } from '../constants/gameConfig';

export function createBullet(x, canvasHeight) {
  return { x, y: canvasHeight - 80 };
}

export function updateAndDrawBullets(ctx, bulletsRef) {
  bulletsRef.current = bulletsRef.current.filter((bullet) => {
    bullet.y -= GAME_CONFIG.BULLET_SPEED;

    // laser beam effect :> 
    ctx.fillStyle = '#ffff00';
    ctx.fillRect(bullet.x - 2, bullet.y, 4, 15);
    // just <3
    ctx.fillStyle = '#ff8800';
    ctx.fillRect(bullet.x - 1, bullet.y, 2, 15);

    return bullet.y > 0;
  });
}
