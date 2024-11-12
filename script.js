// Variáveis do jogo
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 320;
canvas.height = 480;

// Variáveis do pássaro
const birdWidth = 20;
const birdHeight = 20;
let birdX = 50;
let birdY = canvas.height / 2;
let birdSpeedY = 0;
const gravity = 0.6;
const lift = -12;

// Tubos
const tubeWidth = 50;
const tubeGap = 150;
let tubes = [];
let tubeSpeed = 2;

// Variáveis do jogo
let score = 0;
let isGameOver = false;

// Função para desenhar o pássaro
function drawBird() {
    birdSpeedY += gravity;
    birdY += birdSpeedY;

    if (birdY + birdHeight > canvas.height) {
        birdY = canvas.height - birdHeight;
        birdSpeedY = 0;
    } else if (birdY < 0) {
        birdY = 0;
        birdSpeedY = 0;
    }

    ctx.fillStyle = "yellow";
    ctx.fillRect(birdX, birdY, birdWidth, birdHeight);
}

// Função para desenhar os tubos
function drawTubes() {
    if (tubes.length === 0 || tubes[tubes.length - 1].x < canvas.width - 200) {
        const tubeHeight = Math.floor(Math.random() * (canvas.height - tubeGap));
        tubes.push({
            x: canvas.width,
            topHeight: tubeHeight,
            bottomHeight: canvas.height - tubeHeight - tubeGap
        });
    }

    tubes.forEach((tube, index) => {
        tube.x -= tubeSpeed;

        ctx.fillStyle = "green";
        ctx.fillRect(tube.x, 0, tubeWidth, tube.topHeight); // Tubo superior
        ctx.fillRect(tube.x, canvas.height - tube.bottomHeight, tubeWidth, tube.bottomHeight); // Tubo inferior

        // Verificar se o tubo saiu da tela
        if (tube.x + tubeWidth < 0) {
            tubes.splice(index, 1);
            score++;
        }

        // Verificação de colisão com o pássaro
        if (
            birdX + birdWidth > tube.x &&
            birdX < tube.x + tubeWidth &&
            (birdY < tube.topHeight || birdY + birdHeight > canvas.height - tube.bottomHeight)
        ) {
            isGameOver = true;
        }
    });
}

// Função para desenhar o score
function drawScore() {
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 30);
}

// Função para reiniciar o jogo
function restartGame() {
    birdY = canvas.height / 2;
    birdSpeedY = 0;
    tubes = [];
    score = 0;
    isGameOver = false;
}

// Função para atualizar o jogo
function update() {
    if (isGameOver) {
        ctx.fillStyle = "black";
        ctx.font = "30px Arial";
        ctx.fillText("Game Over", canvas.width / 2 - 80, canvas.height / 2);
        ctx.fillText("Pressione R para reiniciar", canvas.width / 2 - 120, canvas.height / 2 + 40);
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBird();
    drawTubes();
    drawScore();

    requestAnimationFrame(update);
}

// Função de controle do pássaro
function flap() {
    birdSpeedY = lift;
}

// Função para escutar as teclas
document.addEventListener("keydown", (event) => {
    if (event.key === " " && !isGameOver) {
        flap();
    } else if (event.key === "r" && isGameOver) {
        restartGame();
        update();
    }
});

// Inicializar o jogo
update();
