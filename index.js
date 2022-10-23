const playfield = document.querySelector('.playfield');
const sizeButtons = document.querySelectorAll('.sizes__button');
// playField size
const playfieldSize = parseFloat(getComputedStyle(playfield).width);
let puzzleSize = 4;
let cellSize = playfieldSize / puzzleSize;
// game array
let playFieldArray = [];
let playFieldWinArray = [];

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
    playFieldArray.push({
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

    playFieldWinArray.push({
      value: i,
      position: i,
      row: (getRow(i) - 1),
      column: (getColumn(i) - 1),
    });
  }
}

function initPlayField() {
  const sourcedArr = [];
  playFieldArray = [];
  playFieldWinArray = [];

  getWinArray(sourcedArr);
  getPlayArray(sourcedArr);
};

function drawPlayField() {
  clearPlayField();

  for (let i = 0; i < playFieldArray.length; i++) {
    // create cell
    const playFieldItem = document.createElement('div');
    // cell styles
    playFieldItem.classList.add('playField__item');
    playFieldItem.style.width = `${cellSize}px`;
    playFieldItem.style.height = `${cellSize}px`;
    playFieldItem.style.top = `${playFieldArray[i].row * cellSize}px`;
    playFieldItem.style.left = `${playFieldArray[i].column * cellSize}px`;
    // cell text
    if (playFieldArray[i].value === playFieldArray.length) {
      playFieldItem.classList.add('playfield__item_empty');
    } else {
      playFieldItem.innerText = playFieldArray[i].value;
    }
    // add cell to playField
    playfield.append(playFieldItem);
  }
};

function clearPlayField() {
  playfield.innerHTML = '';
  cellSize = playfieldSize / puzzleSize;
}


initPlayField();
drawPlayField();

sizeButtons.forEach((button) => {
  const buttonValue = button.getAttribute('value');

  button.addEventListener('click', function () {
    puzzleSize = buttonValue;

    initPlayField();
    drawPlayField();
  });
})

// console.log('playFieldWinArray');
// console.table(playFieldWinArray);

// console.log('playFieldArray');
// console.table(playFieldArray);
