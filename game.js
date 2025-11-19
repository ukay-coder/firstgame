class InputHandler {
    constructor() {
        this.keys = {
            ArrowLeft: false, ArrowRight: false,
            ArrowUp: false, ArrowDown: false,
            a: false, d: false,
            w: false, s: false,
            " ": false
        };

        window.addEventListener('keydown', (e) => {
            const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
            if (this.keys.hasOwnProperty(key)) {
                this.keys[key] = true;
            }
            // Prevent default for game keys
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'w', 'a', 's', 'd', 'W', 'A', 'S', 'D'].includes(e.key)) {
                e.preventDefault();
            }
        });

        window.addEventListener('keyup', (e) => {
            const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
            if (this.keys.hasOwnProperty(key)) this.keys[key] = false;
        });
    }

    get left() { return this.keys.ArrowLeft || this.keys.a; }
    get right() { return this.keys.ArrowRight || this.keys.d; }
    get up() { return this.keys.ArrowUp || this.keys.w; }
    get down() { return this.keys.ArrowDown || this.keys.s; }
    get action() { return this.keys[" "]; }
}

class Star {
    constructor(gameWidth, gameHeight) {
        this.x = Math.random() * gameWidth;
        this.y = Math.random() * gameHeight;
        this.size = Math.random() * 2;
        this.speed = 1 + Math.random() * 3;
        this.brightness = Math.random();
    }

    update(gameHeight) {
        this.y += this.speed;
        if (this.y > gameHeight) {
            this.y = 0;
            this.x = Math.random() * window.innerWidth;
        }
    }

    draw(ctx) {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.brightness})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

class Player {
    constructor(gameWidth, gameHeight) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.width = 40;
        this.height = 60;
        this.x = gameWidth / 2 - this.width / 2;
        this.y = gameHeight - 120;
        this.speed = 8;
        this.color = '#0490da';
    }

    update(input) {
        if (input.left) this.x -= this.speed;
        if (input.right) this.x += this.speed;
        if (input.up) this.y -= this.speed;
        if (input.down) this.y += this.speed;

        if (this.x < 0) this.x = 0;
        if (this.x + this.width > this.gameWidth) this.x = this.gameWidth - this.width;
        if (this.y < 0) this.y = 0;
        if (this.y + this.height > this.gameHeight) this.y = this.gameHeight - this.height;
    }

    draw(ctx) {
        const cx = this.x + this.width / 2;
        const cy = this.y + this.height / 2;

        ctx.save();
        ctx.translate(cx, cy);

        // Rocket Body
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.moveTo(0, -this.height / 2);
        ctx.lineTo(this.width / 2, this.height / 2);
        ctx.lineTo(0, this.height / 2 - 10);
        ctx.lineTo(-this.width / 2, this.height / 2);
        ctx.closePath();
        ctx.fill();

        // Cockpit
        ctx.fillStyle = '#fff';
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.arc(0, -10, 6, 0, Math.PI * 2);
        ctx.fill();

        // Fins
        ctx.fillStyle = '#004fa3';
        ctx.beginPath();
        ctx.moveTo(-this.width / 2, this.height / 4);
        ctx.lineTo(-this.width / 2 - 10, this.height / 2 + 5);
        ctx.lineTo(-this.width / 2, this.height / 2);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(this.width / 2, this.height / 4);
        ctx.lineTo(this.width / 2 + 10, this.height / 2 + 5);
        ctx.lineTo(this.width / 2, this.height / 2);
        ctx.fill();

        // Engine Flame
        ctx.fillStyle = '#ff9900';
        ctx.shadowColor = '#ff3300';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.moveTo(-5, this.height / 2 - 5);
        ctx.lineTo(5, this.height / 2 - 5);
        ctx.lineTo(0, this.height / 2 + 20 + Math.random() * 10);
        ctx.fill();

        ctx.restore();
    }
}

class Asteroid {
    constructor(gameWidth) {
        this.radius = 20 + Math.random() * 15;
        this.x = Math.random() * (gameWidth - this.radius * 2) + this.radius;
        this.y = -this.radius * 2;
        this.speed = 4 + Math.random() * 4;
        this.color = '#cc3333';
        this.markedForDeletion = false;

        this.points = [];
        const numPoints = 8;
        for (let i = 0; i < numPoints; i++) {
            const angle = (Math.PI * 2 / numPoints) * i;
            const r = this.radius * (0.8 + Math.random() * 0.4);
            this.points.push({
                x: Math.cos(angle) * r,
                y: Math.sin(angle) * r
            });
        }
        this.rotation = 0;
        this.rotationSpeed = (Math.random() - 0.5) * 0.1;
    }

    update() {
        this.y += this.speed;
        this.rotation += this.rotationSpeed;
        if (this.y > window.innerHeight + 50) this.markedForDeletion = true;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        ctx.fillStyle = this.color;
        ctx.shadowColor = '#ff0000';
        ctx.shadowBlur = 10;

        ctx.beginPath();
        ctx.moveTo(this.points[0].x, this.points[0].y);
        for (let i = 1; i < this.points.length; i++) {
            ctx.lineTo(this.points[i].x, this.points[i].y);
        }
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.arc(this.radius * 0.3, -this.radius * 0.2, this.radius * 0.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}

class Collectible {
    constructor(gameWidth, imageCanvas) {
        this.radius = 20;
        this.x = Math.random() * (gameWidth - this.radius * 2) + this.radius;
        this.y = -this.radius * 2;
        this.speed = 5;
        this.markedForDeletion = false;
        this.imageCanvas = imageCanvas;
    }

    update() {
        this.y += this.speed;
        if (this.y > window.innerHeight + 50) this.markedForDeletion = true;
    }

    draw(ctx) {
        if (this.imageCanvas) {
            ctx.drawImage(this.imageCanvas, this.x - this.radius, this.y - this.radius);
        } else {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.fill();
        }
    }
}

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        window.addEventListener('resize', () => this.resize());

        this.input = new InputHandler();
        this.player = new Player(this.canvas.width, this.canvas.height);

        // Assets & Optimization
        this.logoImage = new Image();
        this.logoImage.src = 'onsafx_logo.png';
        this.logoCanvas = null;

        this.logoImage.onload = () => {
            // Pre-render logo to offscreen canvas
            this.logoCanvas = document.createElement('canvas');
            this.logoCanvas.width = 40;
            this.logoCanvas.height = 40;
            const lCtx = this.logoCanvas.getContext('2d');

            lCtx.save();
            lCtx.beginPath();
            lCtx.arc(20, 20, 20, 0, Math.PI * 2);
            lCtx.clip();
            lCtx.drawImage(this.logoImage, 0, 0, 40, 40);
            lCtx.restore();

            // Glow ring
            lCtx.strokeStyle = '#0490da';
            lCtx.lineWidth = 2;
            lCtx.beginPath();
            lCtx.arc(20, 20, 19, 0, Math.PI * 2);
            lCtx.stroke();
        };

        this.stars = [];
        for (let i = 0; i < 100; i++) {
            this.stars.push(new Star(this.canvas.width, this.canvas.height));
        }

        this.enemies = [];
        this.collectibles = [];
        this.enemyTimer = 0;
        this.enemyInterval = 1000;
        this.collectibleTimer = 0;
        this.collectibleInterval = 1500;

        this.score = 0;
        this.lives = 3;
        this.gameOver = false;
        this.gameStarted = false;

        this.ui = {
            startScreen: document.getElementById('start-screen'),
            gameOverScreen: document.getElementById('game-over-screen'),
            scoreDisplay: document.getElementById('score-display'),
            livesDisplay: document.getElementById('lives-display'),
            finalScore: document.getElementById('final-score')
        };

        this.loop = this.loop.bind(this);
        requestAnimationFrame(this.loop);
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        if (this.player) {
            this.player.gameWidth = this.canvas.width;
            this.player.gameHeight = this.canvas.height;
            this.player.y = this.canvas.height - 120;
        }
    }

    start() {
        this.gameStarted = true;
        this.gameOver = false;
        this.score = 0;
        this.lives = 3;
        this.enemies = [];
        this.collectibles = [];
        this.player.x = this.canvas.width / 2 - this.player.width / 2;

        this.ui.startScreen.classList.add('hidden');
        this.ui.gameOverScreen.classList.add('hidden');
        this.updateUI();
    }

    updateUI() {
        this.ui.scoreDisplay.textContent = this.score.toFixed(2);
        this.ui.livesDisplay.innerHTML = '❤'.repeat(this.lives);
    }

    checkCollision(rect1, rect2) {
        const pBox = {
            x: rect1.x + 10,
            y: rect1.y + 10,
            width: rect1.width - 20,
            height: rect1.height - 20
        };
        return this.checkCircleCollision(pBox, { x: rect2.x, y: rect2.y, radius: rect2.radius });
    }

    checkCircleCollision(rect, circle) {
        const distX = Math.abs(circle.x - rect.x - rect.width / 2);
        const distY = Math.abs(circle.y - rect.y - rect.height / 2);

        if (distX > (rect.width / 2 + circle.radius)) return false;
        if (distY > (rect.height / 2 + circle.radius)) return false;

        if (distX <= (rect.width / 2)) return true;
        if (distY <= (rect.height / 2)) return true;

        const dx = distX - rect.width / 2;
        const dy = distY - rect.height / 2;
        return (dx * dx + dy * dy <= (circle.radius * circle.radius));
    }

    update(dt) {
        if (!this.gameStarted) {
            if (this.input.action) this.start();
            this.stars.forEach(star => star.update(this.canvas.height));
            return;
        }
        if (this.gameOver) {
            if (this.input.action) this.start();
            return;
        }

        this.player.update(this.input);
        this.stars.forEach(star => star.update(this.canvas.height));

        if (this.enemyTimer > this.enemyInterval) {
            this.enemies.push(new Asteroid(this.canvas.width));
            this.enemyTimer = 0;
            if (this.enemyInterval > 300) this.enemyInterval -= 5;
        } else {
            this.enemyTimer += dt;
        }

        if (this.collectibleTimer > this.collectibleInterval) {
            this.collectibles.push(new Collectible(this.canvas.width, this.logoCanvas));
            this.collectibleTimer = 0;
        } else {
            this.collectibleTimer += dt;
        }

        this.enemies.forEach(enemy => {
            enemy.update();
            if (this.checkCollision(this.player, enemy)) {
                enemy.markedForDeletion = true;
                this.lives--;
                this.updateUI();
                if (this.lives <= 0) {
                    this.gameOver = true;
                    this.ui.finalScore.textContent = this.score.toFixed(2);
                    this.ui.gameOverScreen.classList.remove('hidden');
                }
            }
        });

        this.collectibles.forEach(collectible => {
            collectible.update();
            const pBox = {
                x: this.player.x,
                y: this.player.y,
                width: this.player.width,
                height: this.player.height
            };
            if (this.checkCircleCollision(pBox, collectible)) {
                collectible.markedForDeletion = true;
                this.score += 0.01;
                this.updateUI();
            }
        });

        this.enemies = this.enemies.filter(e => !e.markedForDeletion);
        this.collectibles = this.collectibles.filter(c => !c.markedForDeletion);
    }

    draw() {
        this.ctx.fillStyle = '#050510';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.stars.forEach(star => star.draw(this.ctx));

        this.player.draw(this.ctx);
        this.enemies.forEach(e => e.draw(this.ctx));
        this.collectibles.forEach(c => c.draw(this.ctx));
    }

    loop(timestamp) {
        try {
            const dt = Math.min(timestamp - (this.lastTime || timestamp), 100);
            this.lastTime = timestamp;

            this.update(dt);
            this.draw();

            requestAnimationFrame(this.loop);
        } catch (e) {
            console.error("Game Loop Error:", e);
        }
    }
}

window.onload = () => {
    const game = new Game();
};
