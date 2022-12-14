const page = document.querySelector('.page');

const sectionMenu = document.createElement('section');
const sectionGame = document.createElement('section');
const sectionSize = document.createElement('section');
const popup = document.createElement('div');

sectionMenu.className = 'section section_menu';
sectionGame.className = 'section section_game';
sectionSize.className = 'section section_size';
popup.className = 'popup';

const menu = `
      <ul class="menu">
        <li class="menu__item">
          <button class="menu__button" id="start">Shuffle and start</button>
        </li>

        <li class="menu__item">
          <button class="menu__button" id="stop" value="Stop">Stop</button>
        </li>

        <li class="menu__item">
          <button class="menu__button" id="save">Save</button>
        </li>

        <li class="menu__item">
          <button class="menu__button" id="load">Load</button>
        </li>

        <li class="menu__item">
          <button class="menu__button" id="results">Results</button>
        </li>

        <li class="menu__item">
          <button class="menu__button menu__button_sound" id="sound"></button>
        </li>
      </ul>
    `

const game = `
      <div class="game-info">
        <p class="game-info__moves">
          Moves:
          <span class="game-info__moves-span">0</span>
        </p>
        <p class="game-info__time">
          Time:
          <span class="game-info__time-span">00:00</span>
        </p>
      </div>

      <div class="playfield"></div>

      <span class="frame-size">Frame size: 4x4</span>
`

const size = `
      <span class="other">Other sizes:</span>

      <ul class="sizes">
        <li class="sizes__item">
          <button class="sizes__button" value="3">3x3</button>
        </li>

        <li class="sizes__item">
          <button class="sizes__button" value="4">4x4</button>
        </li>

        <li class="sizes__item">
          <button class="sizes__button" value="5">5x5</button>
        </li>

        <li class="sizes__item">
          <button class="sizes__button" value="6">6x6</button>
        </li>

        <li class="sizes__item">
          <button class="sizes__button" value="7">7x7</button>
        </li>

        <li class="sizes__item">
          <button class="sizes__button" value="8">8x8</button>
        </li>
      </ul>
`
const popupDefault = `
      <div class="popup-container">
        <div class="popup__info"></div>
        <button class="popup-close-button"></button>
      </div>
`


sectionMenu.innerHTML = menu;
sectionGame.innerHTML = game;
sectionSize.innerHTML = size;
popup.innerHTML = popupDefault;

page.append(sectionMenu);
page.append(sectionGame);
page.append(sectionSize);
page.append(popup);
