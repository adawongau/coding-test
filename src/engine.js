import { create2DArray } from "./util.js";

const LEXICON_FILE_PATH = "/src/lexicon.json";

const mapping = {
  ".": false,
  O: true,
};

let _worldHeight = 0;
let _worldWidth = 0;

/**
 * Reads the data file and returns an array of objects.
 * @returns {[{name: string, description: string, pattern: string}]}
 */
export const getLexiconData = async () => {
  try {
    const response = await fetch(LEXICON_FILE_PATH);

    return await response.json();
  } catch (err) {
    console.error(err);
  }
};

/**
 * A list of predicates for evaluating cell neighbours.
 * The predicate returns `true` when a cell is alive at the position, `false` otherwise.
 */
const neighbours = {
  hasNorth:        (y, x, _world) => ((y - 1 > -1) && _world[y - 1][x]),
  hasNorthWest:    (y, x, _world) => ((y - 1 > -1) && (x - 1 > -1) && _world[y - 1][x - 1]),
  hasNorthEast:    (y, x, _world) => ((y - 1 > -1) && (x + 1 < _worldWidth) && _world[y - 1][x + 1]),
  hasWest:         (y, x, _world) => ((x - 1 > -1) && _world[y][x - 1]),
  hasEast:         (y, x, _world) => ((x + 1 < _worldWidth) && _world[y][x + 1]),
  hasSouth:        (y, x, _world) => ((y + 1 < _worldHeight) && _world[y + 1][x]),
  hasSouthWest:    (y, x, _world) => ((y + 1 < _worldHeight) && (x - 1 > -1) && _world[y + 1][x - 1]),
  hasSouthEast:    (y, x, _world) => ((y + 1 < _worldHeight) && (x + 1 < _worldWidth) && _world[y + 1][x + 1])
};

const _neighbourPredicates = Object.values(neighbours);

/**
 * Evaluates the predicates for the world position.
 * The `true` evaluation results will be added to total neighbour count.
 * @param {number} y index of Y-axies
 * @param {number} x index of X-axies
 * @param {boolean[][]} _world current generation world for lookup
 * @returns total number of neighbours
 */
const identifyNeighbours = (y, x, _world) => _neighbourPredicates
                                              .filter(fn => fn(y, x, _world))
                                              .length;

/**
 * Evaluates the rules for the cell at the world position.
 * @param {number} y index of Y-axies
 * @param {number} x index of X-axies
 * @param {boolean[][]} _world current generation world for lookup
 * @returns {boolean} evaluation result to be set on the next generation world.
 */
const evaluateRules = (y, x, _world) => {
  const totalNeighbours = identifyNeighbours(y, x, _world);

  if (_world[y][x]) { // for a live cell
    if (totalNeighbours < 2 || totalNeighbours > 3) { // cell with one or no neighbour or more than 3 neighbours dies
      return false;
    } else if (totalNeighbours === 2 || totalNeighbours === 3) { // cell with two or three neighbour servives
      return true;
    }
  } else if (!_world[y][x] && totalNeighbours === 3) { // for an empty space a cell with 3 neighbours
    return true;
  } else { // otherwise return existing value
    return _world[y][x];
  }
};


// (world: boolean[][]) => boolean[][]
// implement your state transition logic here
export const next = (world) => {

  if (world.length === 0) {
    return [];
  }

  _worldHeight = world.length;
  _worldWidth = world[0].length;

  // a new next generation world with all dead spaces
  let _nextGenWorld = create2DArray(_worldHeight, _worldWidth, false);

  // apply the evaluation results to next generation world.
  // using map operator to avoid nested loop.
  for (let y = 0; y < _worldHeight; y++) {
    _nextGenWorld[y] = _nextGenWorld[y].map((colValue, x) => evaluateRules(y, x, world));
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
