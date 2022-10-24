const moveAudio = new Audio('audio/move.mp3');
const winAudio = new Audio('audio/game-over.mp3');
const startButton = document.querySelector('#start');
const stopButton = document.querySelector('#stop');
const saveButton = document.querySelector('#save');
const loadButton = document.querySelector('#load');
const resultsButton = document.querySelector('#results');
const soundButton = document.querySelector('#sound');
const playfield = document.querySelector('.playfield');
const sizeButtons = document.querySelectorAll('.sizes__button');
const movesCounter = document.querySelector('.game-info__moves-span');
const timeCounter = document.querySelector('.game-info__time-span');
const winPopup = document.querySelector('.win__popup');
const popupInfo = winPopup.querySelector('.win__item-info');
const popupCloseButton = winPopup.querySelector('.win__popup-close-button');
// playField size
const playfieldSize = parseFloat(getComputedStyle(playfield).width);
let puzzleSize = 4;
let cellSize = playfieldSize / puzzleSize;
// game array
let playArray = [];
let winArray = [];
// time & move
let secondsCounter = 0;
let second = 0;
let minute = 0;
let moves = 0;
let isPlaying;
let timeOut;

function loadGame() {
  puzzleSize = localStorage.getItem('puzzleSize') || 4;
  puzzleSize = Number(puzzleSize);
  playArray = JSON.parse(localStorage.getItem('playArray')) || [];
  winArray = JSON.parse(localStorage.getItem('winArray')) || [];
  secondsCounter = localStorage.getItem('secondsCounter') || 0;
  moves = localStorage.getItem('moves') || 0;

  clearTimeout(timeOut);
  drawPlayField();
  startTimer();
  showMovesCounter();
  gameOver();
}

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
  clearPlayField();
  cellSize = playfieldSize / puzzleSize;

  for (let i = 0; i < playArray.length; i++) {
    // create cell
    const playFieldItem = document.createElement('div');
    // cell styles
    playFieldItem.classList.add('playField__item');
    playFieldItem.style.width = `${cellSize}px`;
    playFieldItem.style.height = `${cellSize}px`;
    playFieldItem.style.top = `${playArray[i].row * cellSize}px`;
    playFieldItem.style.left = `${playArray[i].column * cellSize}px`;
    // add position attribute
    playFieldItem.setAttribute('value', playArray[i].value);
    // cell text
    if (playArray[i].value === playArray.length) {
      playFieldItem.classList.add('playfield__item_empty');
    } else {
      playFieldItem.textContent = playArray[i].value;
    }
    // add cell to playField
    playfield.append(playFieldItem);
  }
};

function gameOver() {
  if (playArray.every(item => item.position === item.value) && (moves === 0)) {
    startNewGame();
  }
  if (playArray.every(item => item.position === item.value)) {
    winAudio.play();
    stopGame();
    openPopup();
  }
};

function clearPlayField() {
  playfield.innerHTML = '';
}

function resizePlayField(value) {
  puzzleSize = Number(value);

  startNewGame();
};

function resetInfo() {
  clearTimeout(timeOut)
  moves = 0;
  secondsCounter = 0;
};

function calculateTime(min, sec) {
  if (secondsCounter >= 60) {
    min = Math.floor(secondsCounter / 60);
    sec = (secondsCounter % 60);
  }

  min = min.toString().padStart(2, '0');
  sec = sec.toString().padStart(2, '0');

  const currentTime = `${min}:${sec}`;
  timeCounter.textContent = currentTime;
  timeCounter.setAttribute('datetime', timeCounter.textContent);

  return currentTime;
}

function startTimer() {
  isPlaying = true
  second = secondsCounter;
  minute = 0;

  calculateTime(minute, second);

  secondsCounter++;

  timeOut = setTimeout(startTimer, 1000);
};

function disablePlayField() {
  playfield.style.zIndex = '-1';
  stopButton.textContent = 'Start';
};

function enablePlayField() {
  playfield.style.zIndex = '1';
  stopButton.textContent = 'Stop';
};

function stopGame() {
  clearTimeout(timeOut);

  if (isPlaying === true) {
    isPlaying = false;
    disablePlayField();
  } else {
    startTimer();
    enablePlayField();
  }
};

function showMovesCounter() {
  movesCounter.textContent = moves;
};

function startNewGame() {
  clearTimeout(timeOut);
  resetInfo();
  showMovesCounter();
  initPlayField();
  gameOver();
  drawPlayField();
  startTimer();
};

function saveGame() {
  localStorage.setItem('puzzleSize', puzzleSize);
  localStorage.setItem('secondsCounter', secondsCounter);
  localStorage.setItem('moves', moves);
  localStorage.setItem('winArray', JSON.stringify(winArray));
  localStorage.setItem('playArray', JSON.stringify(playArray));
};

function handleCellClick(evt) {

  if (getRightCell() && evt.target.getAttribute('value') === getRightCell().value.toString()) {
    moveAudio.play();
    moveLeft();
    updateMovesCounter();
  }
  else if (getLeftCell() && evt.target.getAttribute('value') === getLeftCell().value.toString()) {
    moveAudio.play();
    moveRight();
    updateMovesCounter();
  }
  else if (getAboveCell() && evt.target.getAttribute('value') === getAboveCell().value.toString()) {
    moveAudio.play();
    moveDown();
    updateMovesCounter();
  }
  else if (getBelowCell() && evt.target.getAttribute('value') === getBelowCell().value.toString()) {
    moveAudio.play();
    moveUp();
    updateMovesCounter();
  }

  drawPlayField();
  showMovesCounter();
  gameOver();
};

function updateMovesCounter() {
  moves++;
  showMovesCounter();
};

function moveLeft() {
  const emptyCell = getEmptyCell();
  const rightCell = getRightCell();


  if (rightCell) {
    swapCells(emptyCell, rightCell, true);
  }
};

function moveRight() {
  const emptyCell = getEmptyCell();
  const leftCell = getLeftCell();

  if (leftCell) {
    swapCells(emptyCell, leftCell, true);
  }
};

function moveUp() {
  const emptyCell = getEmptyCell();
  const downCell = getBelowCell();

  if (downCell) {
    swapCells(emptyCell, downCell, false);
  }
};

function moveDown() {
  const emptyCell = getEmptyCell();
  const upCell = getAboveCell();

  if (upCell) {
    swapCells(emptyCell, upCell, false);
  }
};

function swapCells(source, target, isRowSwipe) {
  const temp = source.value;

  source.value = target.value;
  target.value = temp;

  if (isRowSwipe) {
    const temp = source.row;

    source.row = target.row;
    target.row = temp;
  }
  else {
    const temp = source.column;

    source.column = target.column;
    target.column = temp;
  }
};

// the method find returns object with the empty cell
function getEmptyCell() {
  return playArray.find(item => item.value === playArray.length);
};
// get cell nearby
function getRightCell() {
  const emptyCell = getEmptyCell();
  const isEdge = getColumn(emptyCell.position) === puzzleSize;

  if (isEdge) {
    return null;
  }
  const cell = getCellByPosition(emptyCell.position + 1);
  return cell;
};

function getLeftCell() {
  const emptyCell = getEmptyCell();
  const isEdge = getColumn(emptyCell.position) === 1;

  if (isEdge) {
    return null;
  }
  const cell = getCellByPosition(emptyCell.position - 1);
  return cell;
};

function getAboveCell() {
  const emptyCell = getEmptyCell();
  const isEdge = getRow(emptyCell.position) === 1;

  if (isEdge) {
    return null;
  }
  const cell = getCellByPosition(emptyCell.position - puzzleSize);
  return cell;
}
function getBelowCell() {
  const emptyCell = getEmptyCell();
  const isEdge = getRow(emptyCell.position) === puzzleSize;

  if (isEdge) {
    return null;
  }

  const cell = getCellByPosition(emptyCell.position + puzzleSize);
  return cell;
};

function getCellByPosition(pos) {
  return playArray.find(item => item.position === pos);
};

isSound = true;

function handleSoundButton() {
  moveAudio.muted = isSound;
  winAudio.muted = isSound;

  if (isSound) {
    soundButton.classList.add('menu__button_muted');
  } else {
    soundButton.classList.remove('menu__button_muted');
  }

  isSound = !isSound;
};

function setPopupContent() {
  popupInfo.textContent = '';
  popupInfo.textContent = `Hooray! You solved the puzzle in ${calculateTime(minute, second)} and ${moves} moves!`;
};

function openPopup() {
  winPopup.classList.add('win__popup_active');
  setPopupContent();

  document.addEventListener('mousedown', handleOverlay);
  document.addEventListener("keydown", closePopup);
};

function handleOverlay(evt) {
  if (evt.target.classList.contains('win__popup_active')) {
    closePopup();
  }
};

function closePopupByEsc(evt) {
  if (evt.key === "Escape") {
    closePopup();
  }
};

function closePopup() {
  winPopup.classList.remove('win__popup_active');
  document.removeEventListener('mousedown', handleOverlay);
  document.removeEventListener("keydown", closePopupByEsc);
  stopGame();
  startNewGame();
};


startButton.addEventListener('click', () => {
  clearTimeout(timeOut);
  startNewGame();
});
stopButton.addEventListener('click', stopGame);
saveButton.addEventListener('click', saveGame);
loadButton.addEventListener('click', loadGame);
soundButton.addEventListener('click', handleSoundButton);
playfield.addEventListener('click', handleCellClick);
sizeButtons.forEach((button) => {
  const buttonValue = button.getAttribute('value');

  button.addEventListener('click', () => {
    resizePlayField(buttonValue);
  });
});
popupCloseButton.addEventListener('click', closePopup);

startNewGame();