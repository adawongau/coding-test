import { worldHeight, worldWidth } from "../config.js";

const LEXICON_FILE_PATH = "/src/lexicon.json";

const mapping = {
  ".": false,
  O: true,
};

export const getLexiconData = async () => {
  try {
    const response = await fetch(LEXICON_FILE_PATH);
    
    return await response.json();
  } catch (err) {
    console.error(err);
  }
};

const neighbours = {
  hasNorth:        (y, x, _world) => ((y - 1 > -1) && _world[y - 1][x] === true),
  hasNorthWest:    (y, x, _world) => ((y - 1 > -1) && (x - 1 > -1) && _world[y - 1][x - 1] === true),
  hasNorthEast:    (y, x, _world) => ((y - 1 > -1) && (x + 1 < worldWidth) && _world[y - 1][x + 1] === true),
  hasWest:         (y, x, _world) => ((x - 1 > -1) && _world[y][x - 1] === true),
  hasEast:         (y, x, _world) => ((x + 1 < worldWidth) && _world[y][x + 1] === true),
  hasSouth:        (y, x, _world) => ((y + 1 < worldHeight) && _world[y + 1][x] === true),
  hasSouthWest:    (y, x, _world) => ((y + 1 < worldHeight) && (x - 1 > -1) && _world[y + 1][x - 1] === true),
  hasSouthEast:    (y, x, _world) => ((y + 1 < worldHeight) && (x + 1 < worldWidth) && _world[y + 1][x + 1] === true)
};

const identifyNeighbours = (y, x, _world) => Object.values(neighbours)
                                            .filter(fn => fn(y, x, _world) === true)
                                            .length;

const executeRules = (y, x, _world) => {
  const totalNeighbours = identifyNeighbours(y, x, _world);

  if (_world[y][x] === true) { // for a live cell
    if (totalNeighbours < 2 || totalNeighbours > 3) { // cell with one or no neighbour or more than 3 neighbours dies
      return false;
    } else if (totalNeighbours === 2 || totalNeighbours === 3) { // cell with two or three neighbour servives
      return true;
    }
  } else if (_world[y][x] === false && totalNeighbours === 3) { // for an empty space a cell with 3 neighbours
    return true;
  } else {
    return _world[y][x];
  }
};


// (world: boolean[][]) => boolean[][]
// implement your state transition logic here
export const next = (world) => {
  let _nextGenWorld = new Array(worldHeight).fill(Array(worldWidth).fill(false));

  for (let y = 0; y < worldHeight; y++) {
    _nextGenWorld[y] = _nextGenWorld[y].map((colValue, x) => executeRules(y, x, world));
  }

  return _nextGenWorld;
};

// (pattern: string) => boolean[][]
// implement your lexicon parsing logic here
export const parse = (pattern) => {

  if (!pattern || pattern.length === 0) {
    return [];
  }
  
  return pattern.split("\n")
              .filter((row) => row.length > 0)
              .map(
                (row) => row.split("")
                            .map((char) => mapping[char] || false)
              );
};
