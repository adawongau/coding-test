import { 
  next, parse,
  getLexiconData 
} from "./src/engine.js";


const scale = 4;
const worldWidth = 480;
const worldHeight = 240;

let _gameRunning = false;
let _timer;
const defaultComputeInterval = 100;
let _computeInterval = defaultComputeInterval;
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

/**
 * Updates the pattern description on change of selection
 * @param {string} description will be derived from the pattern object
 */
const updateDescription = (description) => {
  descriptionText.innerHTML = description;
};

/**
 * Resets the game world.
 * - Stops the cell production
 * - Enable user controls
 * - It fetches the pattern from file based on the selection in the pattern selector.
 * - Apply pattern at the center of the canvas
 */
const resetGame = () => {
  _gameRunning = false;
  clearTimeout(_timer);

  btnStart.disabled = false;
  btnText.innerHTML = "Start";
  spinner.classList.remove("visible");
  runningInfo.innerHTML = "";

  getLexiconData().then(
    data => {
      
      let identifiedPattern;
      // set the first pattern as default pattern if no pattern is selected yet.
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

/**
 * Sets the given patterns at the center of canvas.
 * @param {string} pattern 
 */
const applyPatternAtCenter = (pattern) => {
  const parsedPattern = parse(pattern);
  
  // clear the canvas before applying the pattern.
  const _world = Array(worldHeight).fill(Array(worldWidth).fill(false));

  if (parsedPattern.length > 0) {
    const patternRows = parsedPattern.length;
    const patternCols = parsedPattern[0].length;
    // calculate the row and column index of the pattern in the world (center position).
    const worldRowStart = Math.floor((worldHeight - patternRows) / 2);
    const worldColStart = Math.floor((worldWidth - patternCols) / 2);
    const worldRowEnd = (worldRowStart + patternRows);
  
    // apply the pattern to the world.
    // using spread operator to avoid nested loop.
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


 // Updates the time intervals based on the selected range.
 // Default 100 (milliseconds).
timeInterval.addEventListener("input", (e) => {
  timeIntervalOutput.innerHTML = e.target.value;
  const min = e.target.min
  const max = e.target.max
  const val = e.target.value
  
  e.target.style.backgroundSize = (val - min) * 100 / (max - min) + '% 100%'

  _computeInterval = e.target.value;
});

// Resets game canvas.
patternSelect.addEventListener("change", (event) => {
  resetGame();
});

// Initiate cell production
btnStart.addEventListener('click', (event) => {
  btnText.innerHTML = "Running";
  spinner.classList.add("visible");
  runningInfo.innerHTML = "Please change pattern to reset game.";

  btnStart.disabled = true;
  _gameRunning = true;
  startCellProduction();
});

// Initialise html elements
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
/**
 * Renders the world on the canvas.
 * @param {boolean[][]} world 
 */
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

/**
 * Starts cell production.
 * - Passes the current generation world to the engine, which returns the next generation world.
 * - Renders the next generation world.
 * - Executes the cell production on interval.
*/
const startCellProduction = () => {
  
  _currentWorld = next(_currentWorld);

  render(_currentWorld);
  
  if (_gameRunning) {
    _timer = setTimeout(startCellProduction, _computeInterval);
  }
  
};

initGameControls();
