import { getData } from "utils";

const grids = getData("data.txt")
  .split("\n\n")
  .map((grid) => grid.split("\n").map((row) => row.split("")));

function transpose(matrix) {
  return matrix[0].map((col, i) => matrix.map((row) => row[i]));
}

function findSmugdeMatch(grid, maxSmudges = 0) {
  for (let i = 1; i < grid[0].length; i++) {
    let b = i - 1;
    let f = i;
    let smudgeCount = 0;
    while (b >= 0 && f < grid[0].length && smudgeCount < 2) {
      for (let j = 0; j < grid.length; j++) {
        if (grid[j][b] !== grid[j][f]) {
          smudgeCount++;
        }
      }
      b--;
      f++;
    }
    if (smudgeCount === maxSmudges) return i;
  }
  return 0;
}

function scoreGrids(maxSmudges) {
  return grids
    .map((grid, i) => {
      let score = findSmugdeMatch(grid, maxSmudges);
      if (score === 0) {
        grid = transpose(grid);
        score = findSmugdeMatch(grid, maxSmudges) * 100;
      }
      return score;
    })
    .reduce((a, b) => a + b);
}

function part1() {
  console.log(scoreGrids(0));
}

function part2() {
  console.log(scoreGrids(1));
}

part1();
part2();
