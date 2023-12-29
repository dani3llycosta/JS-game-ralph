const state = {
    view: {
        squares: document.querySelectorAll(".square"),
        enemy: document.querySelector(".enemy"),
        timeLeft: document.querySelector("#time-left"),
        score: document.querySelector("#score"),
        lives: document.querySelector("#lifeCounter"),
    },
    values: {
        gameVelocity: 1000,
        hitPosition: 0,
        result: 0,
        currentTime: 60,
        lifeCounter: 5,
    },
    actions: {
        timerId: null,
        countDownTimerId: setInterval(countDown, 1000),
    }
};

function countDown() {
    state.values.currentTime--;
    state.view.timeLeft.textContent = state.values.currentTime;

    if (state.values.currentTime <= 0) {
        clearInterval(state.actions.countDownTimerId);
        clearInterval(state.actions.timerId);

        // Reset the countdown
        state.values.currentTime = 60;

        // Reset the result
        state.values.result = 0;
        state.view.score.textContent = state.values.result;

        // Reload the timer
        state.actions.countDownTimerId = setInterval(countDown, 1000);

        // Reset the life counter
        state.values.lifeCounter = 5;
        state.view.lives.textContent = "x" + state.values.lifeCounter;
    }
}

function playSound(audioName) {
    let audio = new Audio(`./src/audios/${audioName}.m4a`);
    audio.volume = 0.1;
    audio.play();
}

function randomSquare() {
    state.view.squares.forEach((square) => {
        square.classList.remove("enemy");
    });

    let randomNumber = Math.floor(Math.random() * 9);
    let randomSquare = state.view.squares[randomNumber];
    randomSquare.classList.add("enemy");
    state.values.hitPosition = randomSquare.id;
}

function moveEnemy() {
    state.values.timerId = setInterval(randomSquare, state.values.gameVelocity);
}

function losingLives() {
    state.values.lifeCounter--;
    state.view.lives.textContent = "x" + state.values.lifeCounter;

    if (state.values.lifeCounter <= 0) {
        gameOver();
    }
}

function addListenerHitBox() {
    state.view.squares.forEach((square) => {
        square.addEventListener("mousedown", () => {
            if (square.id === state.values.hitPosition) {
                state.values.result++;
                state.view.score.textContent = state.values.result;
                state.values.hitPosition = null;
                playSound("src_audios_hit");
            } else {
                losingLives();
                playSound("error_sound");
            }
        });
    });
}

function gameOver() {
    clearInterval(state.actions.countDownTimerId);
    clearInterval(state.actions.timerId);
    alert("Game over! Your score was: " + state.values.result);

    // Reset game state values
    state.values.currentTime = 60;    
    state.view.timeLeft.textContent = state.values.currentTime;
    
    state.values.result = 0;
    state.view.score.textContent = state.values.result;

    state.values.lifeCounter = 5;
    state.view.lives.textContent = "x" + state.values.lifeCounter;

    // Restart timers
    state.actions.countDownTimerId = setInterval(countDown, 1000);
    state.actions.timerId = setInterval(randomSquare, state.values.gameVelocity);
}


function initialize() {
    moveEnemy();
    addListenerHitBox();
}

initialize();