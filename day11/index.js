import { getData } from "utils";

const grid = getData("data.txt")
  .split("\n")
  .map((line) => line.split(""));

function transpose(matrix) {
  return matrix[0].map((col, i) => matrix.map((row) => row[i]));
}

function expandRows(grid) {
  let newGrid = [];
  grid.forEach((row, i) => {
    newGrid.push(row);
    if (row.every((col) => col === ".")) {
      newGrid.push(row);
    }
  });
  return newGrid;
}

function part1() {
  let expanded = expandRows(grid);
  expanded = transpose(expanded);
  expanded = expandRows(expanded);
  expanded = transpose(expanded);

  let galaxies = [];
  expanded.forEach((row, r) =>
    row.forEach((val, c) => {
      if (val === "#") galaxies.push([r, c]);
    })
  );

  let sum = 0;
  for (let i = 0; i < galaxies.length; i++) {
    for (let j = i + 1; j < galaxies.length; j++) {
      let dist =
        Math.abs(galaxies[i][0] - galaxies[j][0]) +
        Math.abs(galaxies[i][1] - galaxies[j][1]);
      sum += dist;
    }
  }

  console.log(sum);
}

function part2() {
  let galaxies = [];
  let scaleFactor = 1000000;

  grid.forEach((row, r) =>
    row.forEach((val, c) => {
      if (val === "#") galaxies.push({ r, c });
    })
  );

  for (let r = grid.length - 1; r >= 0; r--) {
    if (grid[r].every((col) => col === ".")) {
      galaxies.forEach((galaxy) => {
        if (galaxy.r > r) galaxy.r += scaleFactor - 1;
      });
    }
  }

  for (let c = grid[0].length - 1; c >= 0; c--) {
    let isEmpty = true;
    for (let r = grid.length - 1; r >= 0; r--) {
      if (grid[r][c] === "#") {
        isEmpty = false;
        break;
      }
    }
    if (isEmpty) {
      galaxies.forEach((galaxy) => {
        if (galaxy.c > c) galaxy.c += scaleFactor - 1;
      });
    }
  }

  let sum = 0;
  for (let i = 0; i < galaxies.length; i++) {
    for (let j = i + 1; j < galaxies.length; j++) {
      let dist =
        Math.abs(galaxies[i].r - galaxies[j].r) +
        Math.abs(galaxies[i].c - galaxies[j].c);
      sum += dist;
    }
  }
  console.log(sum);
}

part1();
part2();
