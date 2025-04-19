document.addEventListener('DOMContentLoaded', () => {
    const gameArea = document.getElementById('game-area');
    const player = document.getElementById('player');
    const scoreDisplay = document.getElementById('score');
    const timeLeftDisplay = document.getElementById('time-left');
    const startButton = document.getElementById('start-button');
    const gameOverDisplay = document.getElementById('game-over');
    const finalScoreDisplay = document.getElementById('final-score');
    const restartButton = document.getElementById('restart-button');

    const gameAreaWidth = gameArea.offsetWidth;
    const gameAreaHeight = gameArea.offsetHeight;
    const playerWidth = player.offsetWidth;

    let score = 0;
    let timeLeft = 60;
    let gameInterval = null;
    let timerInterval = null;
    let playerPosition = gameAreaWidth / 2 - playerWidth / 2;
    let isGameOver = true; // Game starts in 'over' state until started

    // Función para actualizar la posición visual del jugador
    function updatePlayerPosition() {
        player.style.left = `${playerPosition}px`;
    }

    // --- Player Movement ---
    function movePlayer(event) {
        if (isGameOver) return; // Don't move if game is over

        const step = 20; // Pixels to move per key press
        if (event.key === 'ArrowLeft') {
            playerPosition = Math.max(0, playerPosition - step);
        } else if (event.key === 'ArrowRight') {
            playerPosition = Math.min(gameAreaWidth - playerWidth, playerPosition + step);
        }
        updatePlayerPosition();
    }

    document.addEventListener('keydown', movePlayer);

    // --- Falling Objects ---
    function createFallingObject() {
        if (isGameOver) return;

        const object = document.createElement('div');
        object.classList.add('falling-object');
        object.style.left = `${Math.random() * (gameAreaWidth - 30)}px`; // Random horizontal position
        gameArea.appendChild(object);

        let objectTop = -30;
        const fallSpeed = Math.random() * 3 + 2; // Random speed

        function fall() {
            if (isGameOver) {
                object.remove(); // Clean up objects if game ends
                return;
            }

            objectTop += fallSpeed;
            object.style.top = `${objectTop}px`;

            // Collision detection
            const playerRect = player.getBoundingClientRect();
            const objectRect = object.getBoundingClientRect();

            if (
                objectRect.bottom >= playerRect.top &&
                objectRect.top <= playerRect.bottom &&
                objectRect.right >= playerRect.left &&
                objectRect.left <= playerRect.right
            ) {
                // Collision!
                score++;
                scoreDisplay.textContent = score;
                object.remove(); // Remove caught object
            } else if (objectTop > gameAreaHeight) {
                // Object missed and went off screen
                object.remove();
            } else {
                requestAnimationFrame(fall); // Continue falling
            }
        }
        requestAnimationFrame(fall);
    }

    // --- Timer ---
    function updateTimer() {
        timeLeft--;
        timeLeftDisplay.textContent = timeLeft;
        if (timeLeft <= 0) {
            endGame();
        }
    }

    // --- Game State ---
    function startGame() {
        if (!isGameOver) return; // Prevent starting multiple times

        isGameOver = false;
        score = 0;
        timeLeft = 60;
        scoreDisplay.textContent = score;
        timeLeftDisplay.textContent = timeLeft;
        playerPosition = gameAreaWidth / 2 - playerWidth / 2; // Reset player position
        updatePlayerPosition(); // Actualiza la posición visual

        gameOverDisplay.style.display = 'none';
        startButton.style.display = 'none'; // Hide start button during game

        // Clear any existing objects
        document.querySelectorAll('.falling-object').forEach(obj => obj.remove());

        // Start game loops
        timerInterval = setInterval(updateTimer, 1000);
        gameInterval = setInterval(createFallingObject, 1000); // Create an object every second
    }

    function endGame() {
        isGameOver = true;
        clearInterval(timerInterval);
        clearInterval(gameInterval);

        // Ensure all falling animations stop
        // (The check inside fall() handles this, but good practice)

        finalScoreDisplay.textContent = score;
        gameOverDisplay.style.display = 'block';
        startButton.style.display = 'block'; // Show start button again (or restart)
        startButton.textContent = "Jugar de Nuevo"; // Change button text
    }

    // --- Event Listeners ---
    startButton.addEventListener('click', startGame);
    restartButton.addEventListener('click', startGame); // Restart button does the same as start

    // Posición inicial del jugador al cargar
    updatePlayerPosition();
});
