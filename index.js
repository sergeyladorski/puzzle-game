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
const popupContainer = document.querySelector('.popup-container');
const popupInfo = document.querySelector('.popup__info');
const popupCloseButton = document.querySelector('.popup-close-button');

// playField size
let playfieldSize = parseFloat(getComputedStyle(playfield).width);
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
let context;
let results = [];

function loadGame() {
  puzzleSize = localStorage.getItem('puzzleSize') || 4;
  puzzleSize = Number(puzzleSize);
  playArray = JSON.parse(localStorage.getItem('playArray')) || [];
  winArray = JSON.parse(localStorage.getItem('winArray')) || [];
  secondsCounter = localStorage.getItem('secondsCounter') || 0;
  moves = localStorage.getItem('moves') || 0;

  clearTimeout(timeOut);
  enablePlayField();
  drawPlayField();
  startTimer();
  showMovesCounter();
  gameOver();
};

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

  while (!checkGameArray()) {
    initPlayField();
  }
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

function handleWindowResize() {
  playfieldSize = parseFloat(getComputedStyle(playfield).width);
  drawPlayField();
};

function gameOver() {
  if (playArray.every(item => item.position === item.value) && (moves === 0)) {
    startNewGame();
  }
  if (playArray.every(item => item.position === item.value)) {
    winAudio.play();
    context = 'win';
    openPopup();

    results.push({
      moves: moves,
      puzzleSize: puzzleSize,
    });
    results = results.sort((a, b) => a.moves - b.moves).slice(0, 10);
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
  second = secondsCounter;
  minute = 0;

  calculateTime(minute, second);

  secondsCounter++;

  timeOut = setTimeout(startTimer, 1000);
};

function disablePlayField() {
  playfield.style.zIndex = '-1';
  stopButton.value = 'Start';
  stopButton.textContent = stopButton.value;
  stopButton.classList.add('stop-game');
};

function enablePlayField() {
  playfield.style.zIndex = '1';
  stopButton.value = 'Stop';
  stopButton.textContent = stopButton.value;
  stopButton.classList.remove('stop-game');
};

function manageStopButton() {
  if (stopButton.value === 'Stop') {
    stopGame();
  } else {
    continueGame();
  }
};

function stopGame() {
  clearTimeout(timeOut);
  disablePlayField();
};

function continueGame() {
  startTimer();
  enablePlayField();
}

function showMovesCounter() {
  movesCounter.textContent = moves;
};

function checkGameArray() {
  let sum = 0;
  const emptyCellValue = puzzleSize ** 2;
  let emptyCellRowNumber;

  let noEmptyCell = playArray.filter(item => {
    return item.value !== emptyCellValue;
  });

  // console.table(noEmptyCell)

  noEmptyCell = noEmptyCell.map(item => item.value)

  // console.log('noEmptyCell', noEmptyCell)

  noEmptyCell.forEach((item, index) => {

    for (let j = index; j < noEmptyCell.length; j++) {
      if (item > noEmptyCell[j]) {

        sum += 1;
      }
    }
  })


  playArray.forEach((item) => {
    // console.table(item)
    if (item.value === (emptyCellValue)) {
      emptyCellRowNumber = item.row + 1;

      if (item.row % 2 === 1 && puzzleSize % 2 === 1) {
        emptyCellRowNumber += 1;
      }
    }
  })

  sum += emptyCellRowNumber;

  console.log('sum', sum, 'emptyCellRowNumber', emptyCellRowNumber)

  console.log(sum % 2 === playArray.length % 2)
  return sum % 2 === playArray.length % 2;
}

function startNewGame() {
  enablePlayField();
  clearTimeout(timeOut);
  resetInfo();
  showMovesCounter();

  // while (!checkGameArray()) {
  initPlayField();
  // }

  gameOver();
  drawPlayField();
  startTimer();
  checkGameArray();
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

  if (context === 'win') {
    popupInfo.textContent = `Hooray! You solved the puzzle in ${calculateTime(minute, second)} and ${moves} moves!`;
  }
  else if (context === 'results') {
    popupInfo.textContent = `Top 10 results`;


    if (results.length === 0) {
      const resultsList = document.createElement('div');
      resultsList.className = 'results__list';
      popupContainer.append(resultsList);

      resultsList.innerHTML = `
      <span class="results__list-empty">
        Sorry, the results list is empty.
        <br>
        You haven't won any game yet.
        <br>
        When you do win a game
        <br>
        the result will be shown here.
        <br>
        Good luck!
      </span>
      `
    } else {
      const resultsList = document.createElement('ol');
      resultsList.className = 'results__list';
      popupContainer.append(resultsList);

      results.sort((a, b) => a.moves - b.moves).forEach((item) => {
        const resultsItem = document.createElement('li');
        resultsItem.innerHTML = `
        <span class="results__item-moves"></span>
        <span class="results__item-puzzle-size"></span>
  `
        resultsItem.querySelector('.results__item-moves').textContent = `moves: ${item.moves} // `;
        resultsItem.querySelector('.results__item-puzzle-size').textContent = `puzzle size: ${item.puzzleSize}`;
        resultsList.append(resultsItem);
      })
    }

  }
};

function openPopup() {
  stopGame();
  popup.classList.add('popup_active');
  setPopupContent();

  document.addEventListener('mousedown', handleOverlay);
  document.addEventListener("keydown", closePopup);
};

function handleOverlay(evt) {
  if (evt.target.classList.contains('popup_active')) {
    closePopup();
  }
};

function closePopupByEsc(evt) {
  if (evt.key === "Escape") {
    closePopup();
  }
};

function closePopup() {
  continueGame();

  if (context === 'results') {
    popup.querySelector('.results__list').remove();
  } else {
    startNewGame();
  }

  popup.classList.remove('popup_active');
  document.removeEventListener('mousedown', handleOverlay);
  document.removeEventListener("keydown", closePopupByEsc);
};

function setResults() {
  if (results.length !== 0) {
    localStorage.setItem('results', JSON.stringify(results));
  }
};

function getResults() {
  if (localStorage.getItem('results') !== null) {
    results = JSON.parse(localStorage.getItem('results'));
  }
};

startButton.addEventListener('click', () => {
  clearTimeout(timeOut);
  startNewGame();
});
stopButton.addEventListener('click', manageStopButton);
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
resultsButton.addEventListener('click', () => {
  context = 'results';
  openPopup();
});

window.addEventListener('load', getResults);
window.addEventListener('beforeunload', setResults);
window.addEventListener('resize', handleWindowResize);

startNewGame();
