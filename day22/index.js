import { getData } from "utils";

class Location {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
}

class Brick {
  static id = 0;
  constructor(start, end) {
    this.id = Brick.id++;
    this.start = start;
    this.end = end;
  }
}

class Grid {
  constructor() {
    this.map = new Map();
  }
  addBrick(brick) {
    let zTarget = 1;
    for (let x = brick.start.x; x <= brick.end.x; x++) {
      for (let y = brick.start.y; y <= brick.end.y; y++) {
        let locstring = `${x},${y}`;
        if (this.map.has(locstring)) {
          let brick = this.map.get(locstring).slice(-1)[0];
          if (brick.end.z + 1 > zTarget) {
            zTarget = brick.end.z + 1;
          }
        }
      }
    }

    brick.end.z = brick.end.z - brick.start.z + zTarget;
    brick.start.z = zTarget;

    for (let x = brick.start.x; x <= brick.end.x; x++) {
      for (let y = brick.start.y; y <= brick.end.y; y++) {
        let locstring = `${x},${y}`;
        if (!this.map.has(locstring)) {
          this.map.set(locstring, new Array());
        }
        this.map.get(locstring).push(brick);
      }
    }
  }
  getBlockAt(x, y, z) {
    let locstring = `${x},${y}`;
    let col = this.map.get(locstring);
    if (!col) {
      return null;
    }
    for (let brick of col) {
      if (brick.start.z <= z && brick.end.z >= z) {
        return brick;
      }
    }
    return null;
  }

  getSupportedBricks(brick) {
    let supportedList = [];
    for (let x = brick.start.x; x <= brick.end.x; x++) {
      for (let y = brick.start.y; y <= brick.end.y; y++) {
        let supportee = this.getBlockAt(x, y, brick.end.z + 1);
        if (supportee) {
          supportedList.push(supportee);
        }
      }
    }
    return supportedList;
  }

  getSupports(brick) {
    let supportList = [];
    for (let x = brick.start.x; x <= brick.end.x; x++) {
      for (let y = brick.start.y; y <= brick.end.y; y++) {
        let supporter = this.getBlockAt(x, y, brick.start.z - 1);
        if (supporter && !supportList.includes(supporter)) {
          supportList.push(supporter);
        }
      }
    }
    return supportList;
  }
}

function parseLoc(s) {
  let [x, y, z] = s.split(",");
  [x, y, z] = [x, y, z].map((n) => parseInt(n));
  return new Location(x, y, z);
}

function getBricks(filename) {
  const lines = getData(filename).split("\n");
  Brick.id = 0;
  return lines.map((line) => {
    const [s, e] = line.split("~");
    return new Brick(parseLoc(s), parseLoc(e));
  });
}

function part1() {
  let bricks = getBricks("data.txt");
  bricks.sort((a, b) => a.start.z - b.start.z);
  const maxZ = bricks[bricks.length - 1].end.z;

  let grid = new Grid();
  bricks.forEach((brick) => grid.addBrick(brick));

  let sum = 0;
  let sum2 = 0;
  bricks.forEach((brick) => {
    let supportList = grid.getSupportedBricks(brick);
    supportList = supportList.filter((b, i) => {
      let supports = grid.getSupports(b);
      return supports.length === 1 ? true : false;
    });
    if (supportList.length === 0) {
      sum += 1;
    }
  });
  console.log(sum);
}

function doDelete(grid, brick) {
  let deleted = [brick];
  let toDelete = [brick];
  while (toDelete.length > 0) {
    let b = toDelete.shift();
    let supportList = grid.getSupportedBricks(b);
    for (let supportee of supportList) {
      let supported = false;
      let supports = grid.getSupports(supportee);
      for (let supporter of supports) {
        if (!deleted.includes(supporter)) supported = true;
      }

      if (!supported && !deleted.includes(supportee)) {
        toDelete.push(supportee);
        deleted.push(supportee);
      }
    }
  }
  return deleted.length - 1;
}

function part2() {
  let bricks = getBricks("data.txt");
  bricks.sort((a, b) => a.start.z - b.start.z);
  const maxZ = bricks[bricks.length - 1].end.z;

  let grid = new Grid();
  bricks.forEach((brick) => grid.addBrick(brick));

  let sum = 0;
  bricks.forEach((brick) => {
    let supportList = grid.getSupportedBricks(brick);
    supportList = supportList.filter((b, i) => {
      let supports = grid.getSupports(b);
      return supports.length === 1 ? true : false;
    });

    if (supportList.length > 0) {
      let num = doDelete(grid, brick);
      sum += num;
    }
  });
  console.log(sum);
}

part1();
part2();
