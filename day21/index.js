import { getData } from "utils";

class Location {
  constructor(r, c) {
    this.r = r;
    this.c = c;
  }
  toString() {
    return `${this.r},${this.c}`;
  }
}

function getInitialState(file) {
  const data = getData(file).split("\n");
  let start = [0, 0];
  let rocks = new Map();
  for (let r = 0; r < data.length; r++) {
    for (let c = 0; c < data[r].length; c++) {
      if (data[r][c] === "#") {
        let l = new Location(r, c);
        rocks.set(l.toString(), l);
      } else if (data[r][c] === "S") {
        start = new Location(r, c);
      }
    }
  }
  return [start, rocks, [data.length, data[0].length]];
}

function isRock(loc, rocks, dimensions) {
  let [r, c] = [loc.r % dimensions[0], loc.c % dimensions[1]];
  r = r > 0 ? r : r + dimensions[0];
  c = c > 0 ? c : c + dimensions[1];
  let locString = `${r},${c}`;
  return rocks.has(locString);
}

function getMoves(loc, rocks, dimensions, infinite = false) {
  let possibleMoves = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];
  possibleMoves.forEach((move, i) => {
    possibleMoves[i] = new Location(move[0] + loc.r, move[1] + loc.c);
  });
  if (!infinite) {
    possibleMoves = possibleMoves.filter((move) => {
      return (
        move.r >= 0 &&
        move.r < dimensions[0] &&
        move.c >= 0 &&
        move.c < dimensions[1]
      );
    });
  }
  possibleMoves = possibleMoves.filter((move) => {
    return !isRock(move, rocks, dimensions);
  });
  return possibleMoves;
}

function part1() {
  let [start, rocks, dimensions] = getInitialState("data.txt");
  let numSteps = 64;
  let sum = 0;

  let previousState = new Map();
  previousState.set(start.toString(), start);

  for (let i = 0; i < numSteps; i++) {
    let nextState = new Map();
    for (let [key, value] of previousState) {
      for (let move of getMoves(value, rocks, dimensions)) {
        nextState.set(move.toString(), move);
      }
    }
    previousState = nextState;
  }

  console.log(previousState.size);
}

function part2() {
  let [start, rocks, dimensions] = getInitialState("data.txt");
  let numSteps = 1000; //fill grid

  let evenState = new Map();
  evenState.set(start.toString(), start);
  let oddState = new Map();
  let previousNewLocs = [start];
  for (let i = 0; i < numSteps; i++) {
    let curState = i % 2 === 0 ? evenState : oddState;
    let nextState = i % 2 === 0 ? oddState : evenState;

    let newLocs = [];
    for (let loc of previousNewLocs) {
      for (let move of getMoves(loc, rocks, dimensions, false)) {
        if (!nextState.has(move.toString())) {
          newLocs.push(move);
          nextState.set(move.toString(), move);
        }
      }
    }
    previousNewLocs = newLocs;
  }

  //Now have data for how many locations reachable in odd and even steps
  //Each grid is same and either even or odd. Center is even, neighbors are opposite

  //Experimentation + excel to find pattern...

  //Number of full grids traveled in each direction:
  let gridDist = Math.floor(26501365 / 131);

  let numOddGrids = Math.pow(gridDist, 2);
  let numEvenGrids = Math.pow(gridDist + 1, 2);
  let gridTotal = numEvenGrids * evenState.size + numOddGrids * oddState.size;

  //Not all grids are full. Most partials cancel out. Need fudge factor.
  let fudge = -3712 + 24 * gridDist;

  let total = gridTotal + fudge;

  console.log(total);
}

part1();
part2();
