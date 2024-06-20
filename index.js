const cards = document.querySelectorAll('.game-cards');
const restartButton = document.querySelector('button');
const audio = document.getElementById('myAudio');

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;

let startTime;
let timerInterval;
let gameInProgress = false;

playButton.addEventListener('click', function () {
  audio.volume = 0.1;
  if (audio.paused) {
      audio.play();
      playButton.textContent = 'Pause Sound';
  } else {
      audio.pause();
      playButton.textContent = 'Play Sound';
  }
});

// Timer code here
function startGame() {
  if (!gameInProgress) {
    startTime = Date.now();
    timerInterval = setInterval(updateTimer, 1000);
    gameInProgress = true;
  }
}

function updateTimer() {
  const currentTime = Date.now();
  const elapsedTime = currentTime - startTime;
  const minutes = Math.floor(elapsedTime / 60000);
  const seconds = Math.floor((elapsedTime % 60000) / 1000);
  const timerElement = document.getElementById('timer');
  timerElement.innerText = `${formatTime(minutes)}:${formatTime(seconds)}`;
}

function formatTime(time) {
  return time < 10 ? `0${time}` : time;
}

function winGame() {
  clearInterval(timerInterval);
  gameInProgress = false;
  const userConfirmed = confirm('Congratulations! You won!\nDo you want to play again?');

  if (userConfirmed) {
    restart();
  }
  
}

// Card flipping
function flipCard() {
  console.log('Card clicked');
  if (lockBoard) return;
  if (this === firstCard) return;


  this.classList.add('flip');

  if (!hasFlippedCard) {
    hasFlippedCard = true;
    firstCard = this;
    startGame();
    return;
  }

  secondCard = this;
  checkForMatch();
  firstCard.classList.add('flip');
  secondCard.classList.add('flip');
}
// Card Management
function checkForMatch() {
  if (firstCard === secondCard) return;

  let isMatch = firstCard.querySelector('.front').src === secondCard.querySelector('.front').src;
  isMatch ? disableCards() : unflipCards();
}

cards.forEach(card => card.addEventListener('click', flipCard));
restartButton.addEventListener('click', restart);


function disableCards() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);

  resetBoard();
}

function unflipCards() {
  lockBoard = true;

  setTimeout(() => {
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');

    resetBoard();
  }, 1000);
}

function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];

  checkWinCondition(); // C
  setGameInProgress(false);
}

function checkWinCondition() {
  const flippedCards = document.querySelectorAll('.flip');
  const totalCards = cards.length;

  if (flippedCards.length === totalCards) {
    winGame();
  }
}
// Game restart
function restart() {
  cards.forEach(card => {
    card.classList.remove('flip');
    card.addEventListener('click', flipCard);
  });

  // Shuffles the cards
  (function shuffle() {
    let orderValues = Array.from({ length: cards.length }, (_, index) => index);
    orderValues = shuffleArray(orderValues);
    
    cards.forEach((card, index) => {
      card.style.order = orderValues[index];
    });
  })();

  resetBoard();
}

function shuffleArray(array) {
  
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  for (let i = 0; i < array.length - 1; i++) {
    if (array[i] === array[i + 1]) {
      // If the current element and the next element are matching pairs, swap the next element with a random element in the array
      const randomIndex = Math.floor(Math.random() * array.length);
      [array[i + 1], array[randomIndex]] = [array[randomIndex], array[i + 1]];
    }
  }

  return array;
}
