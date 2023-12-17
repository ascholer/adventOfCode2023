import { getData, isEq } from "utils";
import {
  PriorityQueue,
  MinPriorityQueue,
} from "@datastructures-js/priority-queue";

const grid = getData("data.txt")
  .split("\n")
  .map((line) => line.split("").map((c) => parseInt(c)));

const DIRECTIONS = {
  N: { r: -1, c: 0 },
  S: { r: 1, c: 0 },
  E: { r: 0, c: 1 },
  W: { r: 0, c: -1 },
};

class State {
  constructor(r, c, cost, stepsInDir, parent) {
    this.r = r;
    this.c = c;
    this.cost = cost;
    this.future =
      cost + Math.abs(grid.length - 1 - r) + Math.abs(grid[0].length - 1 - c);
    this.stepsInDir = stepsInDir;
    this.parent = parent;
  }
}

function getDir(s1, s2) {
  return { r: s2.r - s1?.r, c: s2.c - s1?.c };
}

function move(state, dir) {
  let r = state.r + dir.r;
  let c = state.c + dir.c;
  if (grid[r] === undefined || grid[r][c] === undefined) return null;
  let cost = state.cost + grid[r][c];
  let lastDir = getDir(state.parent, state);
  let stepsInDir = isEq(dir, lastDir) ? state.stepsInDir + 1 : 1;
  return new State(r, c, cost, stepsInDir, state);
}

function getMoves(state, moveLimits) {
  let moves = [];
  let lastDir = getDir(state.parent, state);
  if (state.stepsInDir !== moveLimits.max) {
    moves.push(move(state, lastDir));
  }
  if (state.stepsInDir >= moveLimits.min) {
    if (isEq(lastDir, DIRECTIONS.N)) {
      moves.push(move(state, DIRECTIONS.E));
      moves.push(move(state, DIRECTIONS.W));
    } else if (isEq(lastDir, DIRECTIONS.S)) {
      moves.push(move(state, DIRECTIONS.E));
      moves.push(move(state, DIRECTIONS.W));
    } else if (isEq(lastDir, DIRECTIONS.E)) {
      moves.push(move(state, DIRECTIONS.N));
      moves.push(move(state, DIRECTIONS.S));
    } else if (isEq(lastDir, DIRECTIONS.W)) {
      moves.push(move(state, DIRECTIONS.N));
      moves.push(move(state, DIRECTIONS.S));
    }
  }
  return moves.filter((m) => m !== null);
}

function path(moveLimits) {
  const sQueue = new MinPriorityQueue((state) => state.future);
  let seenMap = new Map();
  let best = new State(0, 0, Number.MAX_SAFE_INTEGER, null, null, 0);
  const init = new State(0, 0, 0, null, null, 0);
  sQueue.enqueue(move(init, DIRECTIONS.S));
  sQueue.enqueue(move(init, DIRECTIONS.E));
  let prune = 0;
  while (sQueue.size() > 0 && sQueue.front().cost < best.cost) {
    let s = sQueue.dequeue();
    //console.log(s);
    if (s.r === grid.length - 1 && s.c === grid[0].length - 1) {
      if (s.cost < best.cost && s.stepsInDir >= moveLimits.min) {
        best = s;
      }
      continue;
    }
    let moves = getMoves(s, moveLimits);
    moves.forEach((m) => {
      let key = m.r + "," + m.c + "," + m.parent.r + "," + m.parent.c;
      if (!seenMap.has(key)) {
        seenMap.set(
          key,
          new Array(moveLimits.max + 1).fill(Number.MAX_SAFE_INTEGER)
        );
      }

      let v = seenMap.get(key);
      let better = false;
      if (v[m.stepsInDir] > m.cost) {
        v[m.stepsInDir] = m.cost;
        better = true;
      }
      if (m.stepsInDir > moveLimits.min) {
        for (let i = m.stepsInDir; i < moveLimits.max + 1; i++) {
          if (v[i] > m.cost) {
            v[i] = m.cost;
            better = true;
          }
        }
      }
      if (!better) {
        prune++;
        return;
      }
      sQueue.enqueue(m);
    });
  }
  return best;
}

function part1() {
  let best = path({ min: 0, max: 3 });
  console.log(best.cost);
}

function part2() {
  let best = path({ min: 4, max: 10 });
  console.log(best.cost);
}

part1();
part2();
