import { getData } from "utils";

const MOVE_MAP = new Map([
  [
    "|",
    [
      [1, 0],
      [-1, 0],
    ],
  ],
  [
    "-",
    [
      [0, 1],
      [0, -1],
    ],
  ],
  [
    "L",
    [
      [-1, 0],
      [0, 1],
    ],
  ],
  [
    "J",
    [
      [-1, 0],
      [0, -1],
    ],
  ],
  [
    "7",
    [
      [1, 0],
      [0, -1],
    ],
  ],
  [
    "F",
    [
      [1, 0],
      [0, 1],
    ],
  ],
  [
    "S",
    [
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0],
    ],
  ],
  [".", []],
  ["X", []],
  ["I", []],
  ["O", []],
]);

function inBounds(grid, loc) {
  return (
    loc[0] >= 0 &&
    loc[1] >= 0 &&
    loc[0] < grid.length &&
    loc[1] < grid[0].length
  );
}

function connects(grid, loc, from) {
  if (!inBounds(grid, loc)) return false;
  const [r1, c1] = from;
  const [r2, c2] = loc;
  const symbol = grid[r2][c2];
  const delta = [r2 - r1, c2 - c1];
  const waysBack = MOVE_MAP.get(symbol).filter(
    ([dr, dc]) => dr === -delta[0] && dc === -delta[1]
  );
  return waysBack.length > 0;
}

function print(g) {
  for (let row of g) {
    console.log(row.join(" "));
  }
  console.log("\n");
}

function same(l1, l2) {
  return l1[0] === l2[0] && l1[1] === l2[1];
}

function countPath(grid, start) {
  let parents = new Map();

  let stack = MOVE_MAP.get("S")
    .map(([dr, dc]) => [start[0] + dr, start[1] + dc])
    .filter((move) => connects(grid, move, start));
  stack.forEach((move) => parents.set(move.toString(), start));

  //Find path
  while (stack.length > 0) {
    let loc = stack.pop();
    if (!inBounds(grid, loc)) {
      continue;
    }

    const [r, c] = loc;
    const value = grid[r][c];
    if (value === "S") {
      break;
    }

    const parent = parents.get(loc.toString());
    //all possible moves minus the parent
    let moves = MOVE_MAP.get(value).map(([dr, dc]) => [r + dr, c + dc]);
    moves = moves.filter((move) => !same(parent, move));

    if (moves.length > 1) {
      throw new Error("Multiple MOVES");
    }
    if (moves.length === 1) {
      parents.set(moves[0].toString(), loc);
      stack.push(moves[0]);
    }
  }

  //Mark & count path
  let curLoc = parents.get(start.toString());
  let count = 0;
  while (!same(curLoc, start)) {
    const parent = parents.get(curLoc.toString());
    grid[curLoc[0]][curLoc[1]] = "X";
    count++;
    curLoc = parent;
  }
  grid[curLoc[0]][curLoc[1]] = "X";
  return count;
}

function flood(grid, loc) {
  let stack = [loc];
  while (stack.length > 0) {
    const curLoc = stack.pop();
    if (!inBounds(grid, curLoc)) {
      continue;
    }
    const [r, c] = curLoc;
    const val = grid[r][c];
    if (val === "O" || val === "X") {
      continue;
    }
    grid[r][c] = "O";
    let moves = MOVE_MAP.get("S");
    moves.forEach(([dr, dc]) => stack.push([r + dr, c + dc]));
  }
}

function markOutside(grid) {
  const rows = grid.length;
  const cols = grid[0].length;
  for (let i = 0; i < rows; i++) {
    flood(grid, [i, 0]);
    flood(grid, [i, cols - 1]);
  }
  for (let i = 0; i < grid[0].length; i++) {
    flood(grid, [0, i]);
    flood(grid, [rows - 1, i]);
  }
}

function doubleCols(rowMarked, rowNum, originalGrid) {
  let newRow = [];
  for (let c = 0; c < rowMarked.length; c++) {
    let value = rowMarked[c];
    let value2 = ".";
    if (value === "X") {
      newRow.push("X");
      if (
        connects(originalGrid, [rowNum, c + 1], [rowNum, c]) &&
        connects(originalGrid, [rowNum, c], [rowNum, c + 1])
      ) {
        value2 = "X";
      }
    } else newRow.push(".");
    newRow.push(value2);
  }
  return newRow;
}

function interpolateRow(rowMarked, rowNum, originalGrid) {
  let newRow = [];
  for (let c = 0; c < rowMarked.length; c++) {
    let value = rowMarked[c];
    if (value === "X") {
      if (
        connects(originalGrid, [rowNum, c], [rowNum + 1, c]) &&
        connects(originalGrid, [rowNum + 1, c], [rowNum, c])
      ) {
        value = "X";
      } else {
        value = ".";
      }
    }
    newRow.push(value === "X" ? "X" : ".");
    let secondValue = ".";
    newRow.push(secondValue);
  }
  return newRow;
}

function doubleResolution(markedGrid, originalGrid) {
  const rows = markedGrid.length;
  const cols = markedGrid[0].length;
  let zoomed = [];
  for (let r = 0; r < rows; r++) {
    zoomed.push(doubleCols(markedGrid[r], r, originalGrid));
    zoomed.push(interpolateRow(markedGrid[r], r, originalGrid));
  }
  //print(zoomed);
  return zoomed;
}

function findStart(grid) {
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      if (grid[r][c] === "S") {
        return [r, c];
      }
    }
  }
}

function main() {
  let grid = getData("data.txt")
    .split("\n")
    .map((row) => row.split(""));
  const originalGrid = grid.map((row) => [...row]);

  const start = findStart(grid);
  let totalLength = countPath(grid, start, start);
  //Part 1
  console.log(Math.ceil(totalLength / 2));

  //Part 2
  let zoomed = doubleResolution(grid, originalGrid);
  markOutside(zoomed);
  //print(zoomed);

  //A 2x2 square of dots is a hole
  let count = 0;
  for (let r = 0; r < zoomed.length; r += 2) {
    for (let c = 0; c < zoomed[0].length; c += 2) {
      if (
        zoomed[r][c] === "." &&
        zoomed[r][c + 1] === "." &&
        zoomed[r + 1][c] === "." &&
        zoomed[r + 1][c + 1] === "."
      ) {
        count++;
      }
    }
  }
  console.log(count);
}

main();
