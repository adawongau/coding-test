import { next } from "./src/engine.js";

const scale = 4;
const worldWidth = 480;
const worldHeight = 240;

const canvas = document.querySelector("canvas");
canvas.width = worldWidth * scale;
canvas.height = worldHeight * scale;
const ctx = canvas.getContext("2d");

const render = (world) => {
  ctx.fillStyle = "#202020";
  ctx.fillRect(0, 0, worldWidth * scale, worldHeight * scale);
  ctx.fillStyle = "green";
  world.forEach((row, y) =>
    row.forEach(
      (alive, x) =>
        alive && ctx.fillRect(x * scale, y * scale, scale - 1, scale - 1)
    )
  );
};

// code below demonstrates how to advance the world to the next state and render it
// correct logic that reads initial state from lexicon and calculates the next state given current state needs to be implemented
const exampleWorld = Array(240).fill(Array(480).fill(true));
render(next(exampleWorld));
