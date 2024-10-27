const gameArea = document.getElementById("game");
const dog = document.getElementById("dog");
const scoreDisplay = document.getElementById("score");
const missedDisplay = document.getElementById("missed");
const confettiContainer = document.getElementById("confetti");

let score = 0;
let missed = 0;
let gameInterval;
let foodDropSpeed = 1000;
let dogPosition = 175;

const foods = ["hamburguesa.png", "pollo.png"];
const forbiddenFood = "chocolate.png";
const moncho = "moncho.png"; // Moncho con bonificación

function startGame() {
    gameInterval = setInterval(createFood, foodDropSpeed);
    setInterval(increaseDifficulty, 10000); // Aumenta la dificultad cada 10 segundos
    enableDrag();
}

function createFood() {
    const food = document.createElement("img");
    const isMoncho = Math.random() < 0.05; // Moncho aparece en 5% de los casos

    food.src = isMoncho ? moncho : (Math.random() < 0.8 ? getRandomFood() : forbiddenFood);
    food.classList.add("food");
    food.style.left = `${Math.random() * 90}%`;
    food.style.top = "0px";

    gameArea.appendChild(food);
    animateFood(food, isMoncho);
}

function getRandomFood() {
    return foods[Math.floor(Math.random() * foods.length)];
}

function animateFood(food, isMoncho) {
    const dropInterval = setInterval(() => {
        const foodTop = parseInt(food.style.top);

        food.style.top = `${foodTop + 5}px`;

        if (checkCollision(food)) {
            clearInterval(dropInterval);
            if (isMoncho) {
                catchMoncho(food);
            } else {
                catchFood(food);
            }
        }

        if (foodTop > gameArea.offsetHeight) {
            clearInterval(dropInterval);
            if (gameArea.contains(food)) {
                gameArea.removeChild(food);
                handleMiss(food.src);
            }
        }
    }, 50);
}

function enableDrag() {
    dog.addEventListener("mousedown", startDrag);
}

function startDrag(e) {
    e.preventDefault();
    document.addEventListener("mousemove", drag);
    document.addEventListener("mouseup", stopDrag);
}

function drag(e) {
    const gameRect = gameArea.getBoundingClientRect();
    dogPosition = Math.min(gameRect.width - dog.width, Math.max(0, e.clientX - gameRect.left - dog.width / 2));
    dog.style.left = `${dogPosition}px`;
}

function stopDrag() {
    document.removeEventListener("mousemove", drag);
    document.removeEventListener("mouseup", stopDrag);
}

function catchFood(food) {
    if (food.src.includes("chocolate")) {
        endGame("¡Perdiste por comer chocolate!");
    } else {
        score++;
        scoreDisplay.textContent = `Puntuación: ${score}`;
        dog.src = "dog-mouth-open.png";
        setTimeout(() => {
            dog.src = "dog-mouth-closed.png";
        }, 300);
    }
    food.remove();
}

function catchMoncho(food) {
    score += 5;
    scoreDisplay.textContent = `Puntuación: ${score}`;
    showConfetti();
    food.remove();
}

function showConfetti() {
    confettiContainer.innerHTML = ""; // Limpia los confetis anteriores
    for (let i = 0; i < 20; i++) {
        const confetti = document.createElement("div");
        confetti.classList.add("confetti-piece");
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.backgroundColor = getRandomColor();
        confettiContainer.appendChild(confetti);
    }
    confettiContainer.style.display = "block";
    setTimeout(() => confettiContainer.style.display = "none", 1000);
}

function getRandomColor() {
    const colors = ["#FF5733", "#33FF57", "#3357FF", "#F333FF", "#FF5733"];
    return colors[Math.floor(Math.random() * colors.length)];
}

function handleMiss(foodSrc) {
    if (!foodSrc.includes("chocolate")) {
        missed++;
        missedDisplay.textContent = `Perdidos: ${missed}`;
        
        if (missed >= 5) {
            endGame("¡Perdiste por dejar escapar demasiada comida!");
        }
    }
}

function endGame(message) {
    clearInterval(gameInterval);
    alert(message);
    location.reload();
}

function checkCollision(food) {
    const foodRect = food.getBoundingClientRect();
    const dogRect = dog.getBoundingClientRect();

    return !(
        foodRect.top > dogRect.bottom ||
        foodRect.bottom < dogRect.top ||
        foodRect.right < dogRect.left ||
        foodRect.left > dogRect.right
    );
}

function increaseDifficulty() {
    if (foodDropSpeed > 200) {
        foodDropSpeed -= 50;
        clearInterval(gameInterval);
        gameInterval = setInterval(createFood, foodDropSpeed);
    }
}

startGame();
