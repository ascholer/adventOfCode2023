import { chunks, getData } from "utils";

const lines = getData("data.txt").split("\n");

class TranslationRange {
  constructor(destinationMin, sourceMin, range) {
    this.destinationMin = destinationMin;
    this.sourceMin = sourceMin;
    this.range = range;
  }
  contains(value) {
    return value >= this.sourceMin && value < this.sourceMin + this.range;
  }
  rcontains(value) {
    return (
      value >= this.destinationMin && value < this.destinationMin + this.range
    );
  }
  map(value) {
    return value - this.sourceMin + this.destinationMin;
  }
  rmap(value) {
    return value - this.destinationMin + this.sourceMin;
  }
}

function parseLines(lines) {
  const seeds = [...lines[0].matchAll(/(\d+)/g)].map((match) =>
    parseInt(match[0])
  );

  let maps = [];
  let curMap = [];
  //start on data of first map
  for (let i = 3; i < lines.length; i++) {
    if (lines[i].indexOf("map:") !== -1) {
      maps.push(curMap);
      curMap = [];
      continue;
    } else if (lines[i] === "") {
      continue;
    }
    const [destinationMin, sourceMin, range] = lines[i]
      .split(" ")
      .map((x) => parseInt(x));
    curMap.push(new TranslationRange(destinationMin, sourceMin, range));
  }
  maps.push(curMap);

  return [seeds, maps];
}

function seedToLocation(seed, maps) {
  let curVal = seed;
  for (let map of maps) {
    for (let range of map) {
      if (range.contains(curVal)) {
        curVal = range.map(curVal);
        break;
      }
    }
  }
  return curVal;
}

function part1() {
  const [seeds, maps] = parseLines(lines);
  const seedLocs = seeds.map((seed) => seedToLocation(seed, maps));
  console.log(seedLocs.reduce((a, b) => (a < b ? a : b)));
}

//Works but slow
function part2() {
  const [seeds, maps] = parseLines(lines);
  const seedsRanges = chunks(seeds, 2);
  let min = Number.MAX_SAFE_INTEGER;
  for (const seedRange of seedsRanges) {
    for (let i = seedRange[0]; i < seedRange[0] + seedRange[1]; i++) {
      const loc = seedToLocation(i, maps);
      if (loc < min) {
        min = loc;
      }
    }
  }
  console.log(min);
}

function locationToSeed(loc, maps) {
  let curVal = loc;
  for (let map of maps) {
    let found = false;
    for (let range of map) {
      if (range.rcontains(curVal)) {
        curVal = range.rmap(curVal);
        found = true;
        break;
      }
    }
  }
  return curVal;
}

//Better
function part2v2() {
  const [seeds, maps] = parseLines(lines);
  maps.reverse();
  const seedsRanges = chunks(seeds, 2);

  let found = false;
  let loc = 0;
  while (!found) {
    loc++;
    const seed = locationToSeed(loc, maps);
    found =
      seedsRanges.filter((x) => x[0] <= seed && x[0] + x[1] > seed).length > 0;
  }

  console.log(loc);
}

part1();
//part2();
part2v2();
