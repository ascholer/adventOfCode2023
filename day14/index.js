import { getData } from "utils";

function tilt(direction) {}

function score(grid) {
  let sum = 0;
  for (let c = 0; c < grid[0].length; c++) {
    for (let r = 0; r < grid.length; r++) {
      if (grid[r][c] == "O") sum += grid.length - r;
    }
  }
  return sum;
}

function slideUp(grid) {
  let newGrid = grid.map((row) => new Array(row.length).fill("."));
  for (let c = 0; c < grid[0].length; c++) {
    let curSpot = 0;
    for (let r = 0; r < grid.length; r++) {
      switch (grid[r][c]) {
        case "O":
          newGrid[curSpot++][c] = "O";
          break;
        case "#":
          curSpot = r;
          newGrid[curSpot++][c] = "#";
          break;
      }
    }
  }
  return newGrid;
}

function part1() {
  let grid = getData("testdata.txt")
    .split("\n")
    .map((line) => line.split(""));
  grid = slideUp(grid);
  let sum = score(grid);
  console.log(sum);
}

function rotate(grid) {
  let newGrid = grid[0].map((col, i) => grid.map((row) => row[i]).reverse());
  return newGrid;
}

function doCycle(grid) {
  for (let i = 0; i < 4; i++) {
    grid = slideUp(grid);
    grid = rotate(grid);
  }
  return grid;
}

function print(grid) {
  for (let r = 0; r < grid.length; r++) {
    console.log(grid[r].join(""));
  }
  console.log("-------------------------------------");
}

function part2() {
  let cache = new Map();
  let grid = getData("data.txt")
    .split("\n")
    .map((line) => line.split(""));
  let cycles = 1000000000;
  let cycleLength = -1;
  let curCycle = 0;
  for (; curCycle < cycles; curCycle++) {
    grid = doCycle(grid);
    let key = grid.map((row) => row.join("")).join("");
    if (cache.has(key)) {
      cycleLength = curCycle - cache.get(key);
      break;
    }
    cache.set(key, curCycle);
  }
  let remaining = (cycles - curCycle - 1) % cycleLength;
  for (let i = 0; i < remaining; i++) {
    grid = doCycle(grid);
  }

  let sum = score(grid);
  console.log(sum);
}

part1();
part2();
