const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 320;
canvas.height = 480;

// Load images
const birdImages = [
    new Image(),
    new Image(),
    new Image(),
    new Image()
];

birdImages[0].src = "../assets/bird0.png";
birdImages[1].src = "../assets/bird1.png";
birdImages[2].src = "../assets/bird2.png";
birdImages[3].src = "../assets/birddead.png";

const topPipe = new Image();
topPipe.src = "../assets/top.png";

const bottomPipe = new Image();
bottomPipe.src = "../assets/bottom.png";

// Bird properties
let bird = {
    x: 50,
    y: 150,
    width: 34,
    height: 24,
    gravity: 0.6,
    lift: -15,
    velocity: 0,
    frame: 0
};

// Pipe properties
let pipes = [];
const pipeWidth = 52;
const pipeHeight = canvas.height / 2;
const gap = 90;
let pipeSpeed = 2;

// Bird animation
function animateBird() {
    bird.frame += 1;
    if (bird.frame > 2) bird.frame = 0;
}

// Draw bird
function drawBird() {
    ctx.drawImage(birdImages[bird.frame], bird.x, bird.y, bird.width, bird.height);
}

// Draw pipes
function drawPipes() {
    pipes.forEach(pipe => {
        ctx.drawImage(topPipe, pipe.x, pipe.y, pipeWidth, pipeHeight);
        ctx.drawImage(bottomPipe, pipe.x, pipe.y + pipeHeight + gap, pipeWidth, pipeHeight);
    });
}

// Generate pipes
function generatePipes() {
    if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width / 2) {
        let pipeY = Math.floor(Math.random() * pipeHeight) - pipeHeight;
        pipes.push({ x: canvas.width, y: pipeY });
    }
}

// Update game state
function update() {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if (bird.y + bird.height >= canvas.height || bird.y <= 0) {
        resetGame();
    }

    pipes.forEach(pipe => {
        pipe.x -= pipeSpeed;
        if (pipe.x + pipeWidth < 0) {
            pipes.shift();
        }
    });

    // Check for collisions
    pipes.forEach(pipe => {
        if (bird.x + bird.width > pipe.x && bird.x < pipe.x + pipeWidth) {
            if (bird.y < pipe.y + pipeHeight || bird.y + bird.height > pipe.y + pipeHeight + gap) {
                resetGame();
            }
        }
    });

    generatePipes();
}

// Reset game
function resetGame() {
    bird.y = 150;
    bird.velocity = 0;
    pipes = [];
}

// Game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    update();
    drawPipes();
    drawBird();
    animateBird();
    requestAnimationFrame(gameLoop);
}

// Handle user input
document.addEventListener("keydown", () => {
    bird.velocity = bird.lift;
});

// Start the game
gameLoop();
