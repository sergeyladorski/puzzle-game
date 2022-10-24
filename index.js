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
let puzzleSize = 2;
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
  playfield.innerHTML = '';

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
    playFieldItem.setAttribute('position', playArray[i].position);
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

function gameOver() {
  playArray.every(item => item.position === item.value) && alert(`Game over in: ${moves} moves and ${startTimer()}`)
}

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

  return currentTime;
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
};

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



playfield.addEventListener('click', handleCellClick);


async function handleCellClick(evt) {
  // console.log(evt.target.getAttribute('position'))
  // console.log(getRightCell())
  // console.log(getLeftCell())
  // console.log(getAboveCell())
  // console.log(getBelowCell())

  if (getRightCell() && evt.target.getAttribute('position') === getRightCell().position.toString()) {
    moveLeft();
    updateMovesCounter();
  }
  else if (getLeftCell() && evt.target.getAttribute('position') === getLeftCell().position.toString()) {
    moveRight();
    updateMovesCounter();
  }
  else if (getAboveCell() && evt.target.getAttribute('position') === getAboveCell().position.toString()) {
    moveDown();
    updateMovesCounter();
  }
  else if (getBelowCell() && evt.target.getAttribute('position') === getBelowCell().position.toString()) {
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

function swapCells(source, target, isX) {
  const temp = source.value;

  playArray[source.position - 1].value = target.value;
  playArray[target.position - 1].value = temp;

  if (isX) {
    const temp = source.row;

    source.row = target.row;
    target.row = temp;
  } else {
    const temp = source.column;

    source.column = target.column;
    target.column = temp;
  }
};

// the method find returns object with the empty cell
function getEmptyCell() {
  return playArray.find(item => item.value === playArray.length);
};

function getRightCell() {
  const emptyCell = getEmptyCell();
  const isEdge = getColumn(emptyCell.position) === puzzleSize

  if (isEdge) {
    return null;
  }
  const cell = getCellByPosition(emptyCell.position + 1);
  return cell;
}
function getLeftCell() {
  const emptyCell = getEmptyCell();
  const isEdge = getColumn(emptyCell.position) === 1

  if (isEdge) {
    return null;
  }
  const cell = getCellByPosition(emptyCell.position - 1);
  return cell;
}
function getAboveCell() {
  const emptyCell = getEmptyCell();
  const isEdge = getRow(emptyCell.position) === 1

  if (isEdge) {
    return null;
  }
  const cell = getCellByPosition(emptyCell.position - puzzleSize);
  return cell;
}
function getBelowCell() {
  const emptyCell = getEmptyCell();
  const isEdge = getRow(emptyCell.position) === puzzleSize

  if (isEdge) {
    return null;
  }
  const cell = getCellByPosition(emptyCell.position + puzzleSize);
  return cell;
}

function getCellByPosition(pos) {
  return playArray.find(item => item.position === pos);
};

startGame();