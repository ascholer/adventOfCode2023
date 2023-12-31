import { getData } from "utils";
import {
  PriorityQueue,
  MaxPriorityQueue,
} from "@datastructures-js/priority-queue";

class Location {
  constructor(r, c) {
    this.r = r;
    this.c = c;
    this.s = `${this.r},${this.c}`;
  }
  eq(other) {
    return this.r === other.r && this.c === other.c;
  }
  toString() {
    return this.s;
  }
}

function getMoves(loc, grid, slippy = true) {
  let possibles = [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1],
  ];
  let symbol = grid[loc.r][loc.c];
  let sindex = ["v", ">", "^", "<"].indexOf(symbol);
  if (slippy && sindex !== -1) {
    possibles = possibles.slice(sindex, sindex + 1);
  }
  let moves = possibles.map((p) => new Location(loc.r + p[0], loc.c + p[1]));
  moves = moves.filter((m) => {
    if (m.r < 0 || m.r >= grid.length || m.c < 0 || m.c >= grid[0].length)
      return false;
    let newSymbol = grid[m.r][m.c];
    return newSymbol !== "#" ? true : false;
  });
  return moves;
}

function activeChain(current, parents) {
  let loc = current;
  let chain = [];
  while (current !== null) {
    chain.push(current);
    current = parents.get(current.toString());
  }
  return chain;
}

function onPath(test, current, parents) {
  let loc = current;
  while (current !== null) {
    if (current.eq(test)) return true;
    current = parents.get(current.toString());
  }
  return false;
}

function print(grid, end, parents) {
  let path = activeChain(end, parents);
  grid.forEach((row, r) => {
    let s = "";
    grid.forEach((col, c) => {
      let onPath = false;
      for (let l of path) {
        if (l.r == r && l.c == c) {
          onPath = true;
          break;
        }
      }
      if (onPath) s += "@";
      else s += grid[r][c];
    });
    console.log(s);
  });
  console.log("===============================");
}

function part1() {
  const grid = getData("data.txt")
    .split("\n")
    .map((line) => line.split(""));
  const start = new Location(0, 1);
  const end = new Location(grid.length - 1, grid[0].length - 2);

  let costs = new Map();
  costs.set(start.toString(), 0);
  let parents = new Map();
  parents.set(start.toString(), null);

  let exploreList = [start];
  while (exploreList.length > 0) {
    let loc = exploreList.shift();
    let prospectiveCost = costs.get(loc.toString()) + 1;
    let moves = getMoves(loc, grid);
    moves = moves.filter((m) => {
      let curWorstCost = 0;
      if (costs.has(m.toString())) {
        curWorstCost = costs.get(m.toString());
      }
      let isAncestor = onPath(m, loc, parents);
      if (isAncestor) return false;
      if (prospectiveCost <= curWorstCost) return false;
      return true;
    });
    moves.forEach((m) => {
      parents.set(m.toString(), loc);
      costs.set(m.toString(), prospectiveCost);
      exploreList.push(m);
    });
  }

  //print(grid, end, parents);
  console.log(costs.get(end.toString()));
}

function part2a() {
  const grid = getData("data.txt")
    .split("\n")
    .map((line) => line.split(""));
  const end = new Location(0, 1);
  const start = new Location(grid.length - 1, grid[0].length - 2);

  let costs = new Map();
  costs.set(start.toString(), 0);
  let parents = new Map();
  parents.set(start.toString(), null);

  let exploreList = new MaxPriorityQueue((i) => {
    let base = costs.get(i.toString());
    let add = Math.abs(i.r - end.r) + Math.abs(i.c - end.c);
    return base + add;
  });
  exploreList.enqueue(start);
  while (exploreList.size() > 0) {
    let loc = exploreList.dequeue();
    let prospectiveCost = costs.get(loc.toString()) + 1;
    let moves = getMoves(loc, grid, false);
    moves = moves.filter((m) => {
      let curWorstCost = 0;
      if (costs.has(m.toString())) {
        curWorstCost = costs.get(m.toString());
      }
      let isAncestor = onPath(m, loc, parents);
      if (isAncestor) return false;
      if (prospectiveCost <= curWorstCost) return false;
      return true;
    });
    moves.forEach((m) => {
      parents.set(m.toString(), loc);
      costs.set(m.toString(), prospectiveCost);
      exploreList.enqueue(m);
    });
  }

  print(grid, end, parents);
  console.log(costs.get(end.toString()));
  //5330 too low
}

class Node {
  constructor(loc) {
    this.loc = loc;
    this.options = new Map();
  }
  eq(other) {
    return this.loc.eq(other.loc);
  }
}

class Path {
  constructor() {
    this.nodes = new Array();
    this.dist = 0;
    this.contained = new Map();
  }
  contains(node) {
    return this.contained.has(node.loc.toString());
  }
  add(node, dist) {
    this.nodes.push(node);
    this.dist += dist;
    this.contained.set(node.loc.toString(), true);
  }
  copy() {
    let np = new Path();
    np.dist = this.dist;
    np.nodes = this.nodes.slice();
    this.contained.forEach((v, k) => {
      np.contained.set(k, v);
    });
    return np;
  }
}

function part2() {
  const grid = getData("data.txt")
    .split("\n")
    .map((line) => line.split(""));

  const start = new Location(0, 1);
  const end = new Location(grid.length - 1, grid[0].length - 2);

  let nodes = new Map();
  let exploreList = [];

  let startNode = new Node(start);
  nodes.set(start.toString(), startNode);

  exploreList.push(startNode);
  while (exploreList.length > 0) {
    let startNode = exploreList.shift();
    let startLoc = startNode.loc;
    let moves = getMoves(startLoc, grid, false);
    for (let m of moves) {
      let atNode = false;
      let prevLoc = startLoc;
      let curLoc = m;
      let dist = 0;
      while (true) {
        let newMoves = getMoves(curLoc, grid, false);
        newMoves = newMoves.filter((nm) => {
          if (nm.eq(prevLoc)) return false;
          return true;
        });
        dist++;
        if (newMoves.length > 1) break;
        prevLoc = curLoc;
        curLoc = newMoves[0];
        if (curLoc.eq(end)) break;
        if (curLoc.eq(start)) break;
      }
      if (!nodes.has(curLoc.toString())) {
        let nn = new Node(curLoc);
        nodes.set(curLoc.toString(), nn);
        exploreList.push(nn);
      }
      let n = nodes.get(curLoc.toString());
      startNode.options.set(curLoc.toString(), { node: n, d: dist });
    }
  }

  console.log(nodes);

  let p1 = new Path();
  p1.nodes.push(nodes.get(start.toString()));

  let finished = [];
  let paths = [p1];
  let longestDist = 0;
  while (paths.length > 0) {
    let curPath = paths.pop();
    let lastNode = curPath.nodes.slice(-1)[0];
    let nextSteps = lastNode.options;
    for (let [k, o] of nextSteps) {
      if (!curPath.contains(o.node)) {
        let newPath = curPath.copy();
        newPath.add(o.node, o.d);
        if (o.node.loc.eq(end)) {
          if (newPath.dist > longestDist) {
            longestDist = newPath.dist;
            console.log(longestDist + 1);
          }
        } else {
          paths.push(newPath);
        }
      }
    }
  }
  console.log(longestDist + 1);
}

//part1();
part2();
