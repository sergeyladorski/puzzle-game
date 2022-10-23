const startButton = document.querySelector('#start');
const stopButton = document.querySelector('#stop');
const saveButton = document.querySelector('#save');
const resultsButton = document.querySelector('#results');
const playfield = document.querySelector('.playfield');
const sizeButtons = document.querySelectorAll('.sizes__button');
const movesCounter = document.querySelector('.game-info__moves-span');
const timeCounter = document.querySelector('.game-info__time-span');
// playField size
const playfieldSize = parseFloat(getComputedStyle(playfield).width);
let puzzleSize = 4;
let cellSize = playfieldSize / puzzleSize;
// game array
let playArray = JSON.parse(localStorage.getItem('playArray')) || [];
let winArray = JSON.parse(localStorage.getItem('winArray')) || [];
// time & move
let secondsCounter = localStorage.getItem('secondsCounter') || 0;
let isPlaying;
let timeOut;
let moves = localStorage.getItem('moves') || 0;

function getRow(pos) {
  return Math.ceil(pos / puzzleSize);
};

function getColumn(pos) {
  const column = pos % puzzleSize;

  if (column === 0) {
    return puzzleSize;
  }

  return column;
};

function getPlayArray(arr) {
  const shuffledArr = [...arr].sort(() => Math.random() - 0.5);

  for (let i = 1; i <= shuffledArr.length; i++) {
    playArray.push({
      value: shuffledArr[i - 1],
      position: i,
      row: (getRow(i) - 1),
      column: (getColumn(i) - 1),
    })
  }
};

function getWinArray(arr) {
  for (let i = 1; i <= puzzleSize ** 2; i++) {
    arr.push(i);
  }

  for (let i = 1; i <= arr.length; i++) {

    winArray.push({
      value: i,
      position: i,
      row: (getRow(i) - 1),
      column: (getColumn(i) - 1),
    });
  }
};

function initPlayField() {
  const sourcedArr = [];
  playArray = [];
  winArray = [];

  getWinArray(sourcedArr);
  getPlayArray(sourcedArr);
};

function drawPlayField() {

  for (let i = 0; i < playArray.length; i++) {
    // create cell
    const playFieldItem = document.createElement('div');
    // cell styles
    playFieldItem.classList.add('playField__item');
    playFieldItem.style.width = `${cellSize}px`;
    playFieldItem.style.height = `${cellSize}px`;
    playFieldItem.style.top = `${playArray[i].row * cellSize}px`;
    playFieldItem.style.left = `${playArray[i].column * cellSize}px`;
    // cell text
    if (playArray[i].value === playArray.length) {
      playFieldItem.classList.add('playfield__item_empty');
    } else {
      playFieldItem.innerText = playArray[i].value;
    }
    // add cell to playField
    playfield.append(playFieldItem);
  }
};

function clearPlayField() {
  playfield.innerHTML = '';
  cellSize = playfieldSize / puzzleSize;
}

function resizePlayField(value) {
  puzzleSize = value;

  startNewGame();
};

function resetTimer() {
  secondsCounter = 0;
  clearTimeout(timeOut)
};

function startTimer() {
  isPlaying = true
  let second = secondsCounter;
  let minute = 0;

  if (secondsCounter >= 60) {
    minute = Math.floor(secondsCounter / 60);
    second = (secondsCounter % 60);
  }

  minute = minute.toString().padStart(2, '0');
  second = second.toString().padStart(2, '0');

  const currentTime = `${minute}:${second}`;
  timeCounter.textContent = currentTime;
  timeCounter.setAttribute('datetime', timeCounter.textContent);

  secondsCounter++;

  timeOut = setTimeout(startTimer, 1000);
};

function stopGame() {
  if (isPlaying === true) {
    isPlaying = false;
    clearTimeout(timeOut);
  } else {
    startTimer();
  }
};

function showMovesCounter() {
  movesCounter.textContent = moves;
}

function startNewGame() {
  clearPlayField();
  initPlayField();
  drawPlayField();
  resetTimer();
  startTimer();
  showMovesCounter();
};

function startGame() {
  if (movesCounter && timeCounter && winArray.length && playArray.length) {
    drawPlayField();
    startTimer();
    showMovesCounter();
  } else {
    startNewGame();
  }
};

function saveGame() {
  localStorage.setItem('secondsCounter', secondsCounter);
  localStorage.setItem('moves', moves);
  localStorage.setItem('winArray', JSON.stringify(winArray));
  localStorage.setItem('playArray', JSON.stringify(playArray));
};

// const resultsButton = document.querySelector('#results');

startButton.addEventListener('click', startNewGame);
stopButton.addEventListener('click', stopGame);
saveButton.addEventListener('click', saveGame);
sizeButtons.forEach((button) => {
  const buttonValue = button.getAttribute('value');

  button.addEventListener('click', () => {
    resizePlayField(buttonValue);
  });
})

// console.log('winArray');
// console.table(winArray);

// console.log('playArray');
// console.table(playArray);

startGame();
