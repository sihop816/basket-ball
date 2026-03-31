// game.js

class Ball {
    constructor() {
        this.x = 50;
        this.y = 50;
        this.radius = 10;
        this.gravity = 0.5;
        this.velocityY = 0;
        this.isJumping = false;
    }

    update() {
        if (this.isJumping) {
            this.velocityY += this.gravity;
            this.y += this.velocityY;
        }
        // Floor collision
        if (this.y + this.radius >= canvas.height) {
            this.y = canvas.height - this.radius;
            this.isJumping = false;
            this.velocityY = 0;
        }
    }

    jump() {
        if (!this.isJumping) {
            this.velocityY = -10;
            this.isJumping = true;
        }
    }
}

class Hoop {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 25;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.stroke();
    }

    checkCollision(ball) {
        const distance = Math.sqrt(Math.pow(ball.x - this.x, 2) + Math.pow(ball.y - this.y, 2));
        return distance < (ball.radius + this.radius);
    }
}

class Game {
    constructor() {
        this.ball = new Ball();
        this.hoop = new Hoop(300, 100);
        this.leaderboard = [];
        this.score = 0;
        this.points = 0;
        this.gameMode = 'normal'; // normal or time attack
    }

    update() {
        this.ball.update();
        if (this.hoop.checkCollision(this.ball)) {
            this.score++;
            this.points += 5;
        }
    }

    draw(ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.ball.draw(ctx);
        this.hoop.draw(ctx);
        this.drawScore(ctx);
    }

    drawScore(ctx) {
        ctx.fillText('Score: ' + this.score, 10, 20);
    }

    addToLeaderboard(playerName) {
        this.leaderboard.push({name: playerName, score: this.score});
        this.leaderboard.sort((a, b) => b.score - a.score);
    }

    reset() {
        this.score = 0;
        this.ball = new Ball();
    }
}

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const game = new Game();

function gameLoop() {
    game.update();
    game.draw(ctx);
    requestAnimationFrame(gameLoop);
}

canvas.addEventListener('click', () => {
    game.ball.jump();
});

document.addEventListener('keydown', (event) => {
    if (event.key === ' ') {
        game.ball.jump();
    }
});

gameLoop();
