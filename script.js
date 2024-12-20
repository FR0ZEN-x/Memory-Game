const gameBoard = document.getElementById('game-board');
const movesDisplay = document.getElementById('moves');
const timeDisplay = document.getElementById('time');
const restartButton = document.getElementById('restart-button');

let cards = [];
let flippedCards = [];
let moves = 0;
let timerInterval;
let seconds = 0;
let minutes = 0;

function generateCards() {
    const cardValues = ['A', 'A', 'B', 'B', 'C', 'C', 'D', 'D', 'E', 'E', 'F', 'F', 'G', 'G', 'H', 'H'];
    cards = cardValues.sort(() => Math.random() - 0.5).map(value => ({ value, flipped: false, matched: false }));
    cards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.index = index;
        cardElement.addEventListener('click', flipCard);
        gameBoard.appendChild(cardElement);
    });
}

function flipCard(event) {
    const cardElement = event.target;
    const index = cardElement.dataset.index;
    const card = cards[index];

    if (card.flipped || card.matched || flippedCards.length === 2) {
        return;
    }

    card.flipped = true;
    cardElement.classList.add('flipped');
    cardElement.textContent = card.value;
    flippedCards.push({ card, cardElement });

    if (flippedCards.length === 2) {
        moves++;
        movesDisplay.textContent = moves;
        setTimeout(checkMatch, 500);
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    if (card1.card.value === card2.card.value) {
        card1.card.matched = true;
        card2.card.matched = true;
        card1.cardElement.classList.add('matched');
        card2.cardElement.classList.add('matched');
    } else {
        card1.card.flipped = false;
        card2.card.flipped = false;
        card1.cardElement.classList.remove('flipped');
        card2.cardElement.classList.remove('flipped');
        card1.cardElement.textContent = '';
        card2.cardElement.textContent = '';
    }
    flippedCards = [];
    checkGameEnd();
}

function checkGameEnd() {
    if (cards.every(card => card.matched)) {
        clearInterval(timerInterval);
        alert(`Game Over! You finished in ${minutes}:${seconds < 10 ? '0' : ''}${seconds} with ${moves} moves.`);
    }
}

function startTimer() {
    timerInterval = setInterval(() => {
        seconds++;
        if (seconds === 60) {
            minutes++;
            seconds = 0;
        }
        timeDisplay.textContent = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }, 1000);
}

function resetGame() {
    clearInterval(timerInterval);
    seconds = 0;
    minutes = 0;
    moves = 0;
    timeDisplay.textContent = '00:00';
    movesDisplay.textContent = '0';
    gameBoard.innerHTML = '';
    cards = [];
    flippedCards = [];
    generateCards();
    startTimer();
}

restartButton.addEventListener('click', resetGame);
generateCards();
startTimer();
