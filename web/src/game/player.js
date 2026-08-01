export function drawPlayer(ctx, x, depth, canvasHeight) {
  const scale = 0.5 + depth * 1.0;
  const baseSize = 30;
  const playerSize = baseSize * scale;
  const playerY = canvasHeight - 40 - playerSize * 0.7;

  // Center alignment line
  ctx.strokeStyle = '#00ff00';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, 0);
  ctx.lineTo(x, canvasHeight);
  ctx.stroke();
  // Suit / Body
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(
    x - playerSize / 3,
    playerY + playerSize / 3,
    playerSize * 0.66,
    playerSize * 0.66,
  );

  // Head
  ctx.fillStyle = '#ffcc99';
  ctx.fillRect(x - playerSize / 5, playerY, playerSize * 0.4, playerSize / 3);

  // Weapon
  ctx.fillStyle = '#666666';
  ctx.fillRect(
    x - playerSize / 15,
    playerY + playerSize / 6,
    playerSize / 7.5,
    playerSize / 3,
  );

  // Glasses / Eyes
  ctx.fillStyle = '#000000';
  ctx.fillRect(
    x - playerSize / 7.5,
    playerY + playerSize / 10,
    playerSize / 15,
    playerSize / 15,
  );
  ctx.fillRect(
    x + playerSize / 15,
    playerY + playerSize / 10,
    playerSize / 15,
    playerSize / 15,
  );
}
