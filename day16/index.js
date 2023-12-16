import { getData } from "utils";

const grid = getData("data.txt")
  .split("\n")
  .map((line) => line.split(""));

function inBounds(r, c) {
  return r >= 0 && r < grid.length && c >= 0 && c < grid[0].length;
}

function move(r, c, dir) {
  const ch = grid[r][c];
  switch (dir) {
    case "N":
      return { r: r - 1, c, dir };
    case "E":
      return { r, c: c + 1, dir };
    case "S":
      return { r: r + 1, c, dir };
    case "W":
      return { r, c: c - 1, dir };
  }
}

function step(quantum) {
  const [r, c, dir] = [quantum.r, quantum.c, quantum.dir];
  const ch = grid[r][c];
  switch (ch) {
    case ".":
      return [move(r, c, dir)];
    case "|":
      switch (dir) {
        case "N":
        case "S":
          return [move(r, c, dir)];
        case "E":
        case "W":
          return [move(r, c, "N"), move(r, c, "S")];
      }
    case "-":
      switch (dir) {
        case "N":
        case "S":
          return [move(r, c, "E"), move(r, c, "W")];
        case "E":
        case "W":
          return [move(r, c, dir)];
      }
    case "\\":
      switch (dir) {
        case "N":
          return [move(r, c, "W")];
        case "S":
          return [move(r, c, "E")];
        case "E":
          return [move(r, c, "S")];
        case "W":
          return [move(r, c, "N")];
      }
    case "/":
      switch (dir) {
        case "N":
          return [move(r, c, "E")];
        case "S":
          return [move(r, c, "W")];
        case "E":
          return [move(r, c, "N")];
        case "W":
          return [move(r, c, "S")];
      }
  }
}

function print(grid) {
  console.log(grid.map((row) => row.join("")).join("\n"));
}

function toString(quantum) {
  return `${quantum.r},${quantum.c},${quantum.dir}`;
}

function testScenario(quantum) {
  let quanta = [];
  let energized = new Array(grid.length)
    .fill([])
    .map((row) => new Array(grid[0].length).fill("."));
  quanta.push(quantum);
  let seen = new Map();
  while (quanta.length > 0) {
    const q = quanta.shift();
    if (!inBounds(q.r, q.c)) {
      continue;
    }
    let s = toString(q);
    if (seen.has(s)) {
      continue;
    }
    seen.set(s, true);
    energized[q.r][q.c] = "#";
    const next = step(q);
    quanta.push(...next);
  }

  return energized
    .map((row) => row.filter((ch) => ch === "#").length)
    .reduce((a, b) => a + b, 0);
}

function part1() {
  console.log(testScenario({ r: 0, c: 0, dir: "E" }));
}

function part2() {
  let sum = 0;
  for (let i = 0; i < grid.length; i++) {
    let s1 = testScenario({ r: i, c: 0, dir: "E" });
    let s2 = testScenario({ r: i, c: grid[0].length - 1, dir: "W" });
    let s3 = testScenario({ r: 0, c: i, dir: "S" });
    let s4 = testScenario({ r: grid.length - 1, c: i, dir: "N" });
    sum = Math.max(sum, s1, s2, s3, s4);
  }
  console.log(sum);
}

part1();
part2();
