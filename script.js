const player = document.getElementById('player');
const gameArea = document.getElementById('gameArea');
const gameOverScreen = document.getElementById('gameOverScreen');
const restartButton = document.getElementById('restartButton');
const playerSpeed = 10;
const projectileSpeed = 5;
const enemySpeed = 2;
const enemyProjectileSpeed = 4;
let projectiles = [];
let enemies = [];
let enemyProjectiles = [];
let gameOver = false;

document.addEventListener('keydown', (event) => {
  if (gameOver) return;
  const rect = player.getBoundingClientRect();
  const currentLeft = parseInt(window.getComputedStyle(player).left, 10);
  switch (event.key) {
    case 'ArrowLeft':
      if (rect.left > 0) {
        player.style.left = `${currentLeft - playerSpeed}px`;
      }
      break;
    case 'ArrowRight':
      if (rect.right < window.innerWidth) {
        player.style.left = `${currentLeft + playerSpeed}px`;
      }
      break;
    case ' ':
      shootProjectile(rect);
      break;
  }
});

function shootProjectile(playerRect) {
  const projectile = document.createElement('div');
  projectile.className = 'projectile';
  projectile.style.left = `${playerRect.left + playerRect.width / 2 - 2.5}px`;
  projectile.style.bottom = `${window.innerHeight - playerRect.bottom + 10}px`;
  gameArea.appendChild(projectile);
  projectiles.push(projectile);
}

function spawnEnemy() {
  if (gameOver) return;
  const enemy = document.createElement('div');
  enemy.className = 'enemy';
  enemy.style.left = `${Math.random() * (window.innerWidth - 50)}px`;
  enemy.style.top = `0px`;
  gameArea.appendChild(enemy);
  enemies.push(enemy);
  setTimeout(() => shootEnemyProjectile(enemy), 2000);
}

function shootEnemyProjectile(enemy) {
  if (gameOver) return;
  const enemyRect = enemy.getBoundingClientRect();
  const enemyProjectile = document.createElement('div');
  enemyProjectile.className = 'enemyProjectile';
  enemyProjectile.style.left = `${enemyRect.left + enemyRect.width / 2 - 2.5}px`;
  enemyProjectile.style.top = `${enemyRect.bottom}px`;
  gameArea.appendChild(enemyProjectile);
  enemyProjectiles.push(enemyProjectile);
  setTimeout(() => shootEnemyProjectile(enemy), Math.random() * 3000 + 2000);
}

function updateProjectiles() {
  projectiles.forEach((projectile, index) => {
    const rect = projectile.getBoundingClientRect();
    if (rect.bottom < 0) {
      projectile.remove();
      projectiles.splice(index, 1);
    } else {
      projectile.style.bottom = `${parseInt(projectile.style.bottom) + projectileSpeed}px`;
    }
  });
}

function updateEnemies() {
  enemies.forEach((enemy, index) => {
    const rect = enemy.getBoundingClientRect();
    if (rect.top > window.innerHeight) {
      enemy.remove();
      enemies.splice(index, 1);
    } else {
      enemy.style.top = `${rect.top + enemySpeed}px`;
    }
  });
}

function updateEnemyProjectiles() {
  enemyProjectiles.forEach((enemyProjectile, index) => {
    const rect = enemyProjectile.getBoundingClientRect();
    if (rect.top > window.innerHeight) {
      enemyProjectile.remove();
      enemyProjectiles.splice(index, 1);
    } else {
      enemyProjectile.style.top = `${rect.top + enemyProjectileSpeed}px`;
    }
  });
}

function checkCollisions() {
  projectiles.forEach((projectile, pIndex) => {
    const pRect = projectile.getBoundingClientRect();
    enemies.forEach((enemy, eIndex) => {
      const eRect = enemy.getBoundingClientRect();
      if (pRect.left < eRect.right &&
        pRect.right > eRect.left &&
        pRect.top < eRect.bottom &&
        pRect.bottom > eRect.top) {
        projectile.remove();
        enemy.remove();
        projectiles.splice(pIndex, 1);
        enemies.splice(eIndex, 1);
      }
    });
  });

  enemies.forEach((enemy) => {
    const eRect = enemy.getBoundingClientRect();
    const pRect = player.getBoundingClientRect();
    if (eRect.left < pRect.right &&
      eRect.right > pRect.left &&
      eRect.top < pRect.bottom &&
      eRect.bottom > pRect.top) {
      endGame();
    }
  });

  enemyProjectiles.forEach((enemyProjectile, epIndex) => {
    const epRect = enemyProjectile.getBoundingClientRect();
    const pRect = player.getBoundingClientRect();
    if (epRect.left < pRect.right &&
      epRect.right > pRect.left &&
      epRect.top < pRect.bottom &&
      epRect.bottom > pRect.top) {
      endGame();
    }
  });
}

function endGame() {
  gameOver = true;
  gameOverScreen.style.display = 'block';
  enemies.forEach(enemy => enemy.remove());
  projectiles.forEach(projectile => projectile.remove());
  enemyProjectiles.forEach(enemyProjectile => enemyProjectile.remove());
  enemies = [];
  projectiles = [];
  enemyProjectiles = [];
}

function restartGame() {
  gameOver = false;
  gameOverScreen.style.display = 'none';
  player.style.left = '50%';
  gameLoop();
}

restartButton.addEventListener('click', restartGame);

function gameLoop() {
  if (!gameOver) {
    updateProjectiles();
    updateEnemies();
    updateEnemyProjectiles();
    checkCollisions();
    requestAnimationFrame(gameLoop);
  }
}

setInterval(spawnEnemy, 2000);
gameLoop();
