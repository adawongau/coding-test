import { worldWidth, worldHeight } from "./config.js";
import { 
  next, parse,
  getLexiconData 
} from "./src/engine.js";


const scale = 4;
let gameRunning = false;
let timer;
const defaultComputeInterval = 100;
let computeInterval = defaultComputeInterval;
let _currentWorld;

// html elements
const canvas = document.querySelector("canvas");
const patternSelect = document.querySelector("#patternSelect");
const btnStart = document.querySelector("#btnStart");
const descriptionText = document.querySelector("#descriptionText");
const btnText = document.querySelector("#btnText");
const spinner = document.querySelector("#spinner");
const runningInfo = document.querySelector("#runningInfo");
const timeInterval = document.querySelector("#timeInterval");
const timeIntervalOutput = document.querySelector("#timeIntervalOutput");


const updateDescription = (description) => {
  descriptionText.innerHTML = description;
};

const resetGame = () => {
  gameRunning = false;
  clearTimeout(timer);

  btnStart.disabled = false;
  btnText.innerHTML = "Start";
  spinner.classList.remove("visible");
  runningInfo.innerHTML = "";

  getLexiconData().then(
    data => {
      let identifiedPattern;
      if (!patternSelect.value) {
        updateDescription(data[0].description);
        identifiedPattern = data[0].pattern;
      } else {
        const found = data.find((obj) => obj.name === patternSelect.value);
        updateDescription(found.description);
        identifiedPattern = found.pattern;
      }
      applyPatternAtCenter(identifiedPattern);
    }
  );

};

const applyPatternAtCenter = (pattern) => {
  const parsedPattern = parse(pattern);
  
  const _world = Array(worldHeight).fill(Array(worldWidth).fill(false));

  if (parsedPattern.length > 0) {
    const patternRows = parsedPattern.length;
    const patternCols = parsedPattern[0].length;
    const worldRowStart = Math.floor((worldHeight - patternRows) / 2);
    const worldColStart = Math.floor((worldWidth - patternCols) / 2);
    const worldRowEnd = (worldRowStart + patternRows);
  
    for (let y = worldRowStart; y < worldRowEnd; y++) {
      _world[y] = [
      ..._world[y].slice(0, worldColStart),
      ...parsedPattern[y - worldRowStart],
      ..._world[y].slice(worldColStart + patternCols)
      ];
    }  
  }

  _currentWorld = _world;
  render(_currentWorld);

};

timeInterval.addEventListener("input", (e) => {
  timeIntervalOutput.innerHTML = e.target.value;
  const min = e.target.min
  const max = e.target.max
  const val = e.target.value
  
  e.target.style.backgroundSize = (val - min) * 100 / (max - min) + '% 100%'

  computeInterval = e.target.value;
});

patternSelect.addEventListener("change", (event) => {
  resetGame();
});

btnStart.addEventListener('click', (event) => {
  btnText.innerHTML = "Running";
  spinner.classList.add("visible");
  runningInfo.innerHTML = "Please change pattern to reset game.";

  btnStart.disabled = true;
  gameRunning = true;
  startCellProduction();
});

const initGameControls = () => {
  
  getLexiconData().then(data => {
      data.forEach(pattern => {
        const option = document.createElement("option");
        option.value = pattern.name;
        option.innerHTML = pattern.name;
        patternSelect.appendChild(option);
      });

      resetGame();
    }
  );
};

canvas.width = worldWidth * scale;
canvas.height = worldHeight * scale;
const ctx = canvas.getContext("2d");

const render = (world) => {
  ctx.fillStyle = "#21252b";
  ctx.fillRect(0, 0, worldWidth * scale, worldHeight * scale);
  ctx.fillStyle = "#5acda3";
  world.forEach((row, y) =>
    row.forEach(
      (alive, x) =>
        alive && ctx.fillRect(x * scale, y * scale, scale - 1, scale - 1)
    )
  );
};

const startCellProduction = () => {
  _currentWorld = next(_currentWorld);
  render(_currentWorld);
  if (gameRunning) {
    timer = setTimeout(startCellProduction, computeInterval);
  }
  
};

initGameControls();
