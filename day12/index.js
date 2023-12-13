import { getData } from "utils";

const lines = getData("data.txt")
  .split("\n")
  .map((l) => {
    let [springs, key] = l.split(" ");
    key = key
      .split(",")
      .map((k) => parseInt(k))
      .reverse();
    return { springs, key };
  });

function isMatch(springs, pos, matchLength) {
  if (pos + matchLength > springs.length) return false;
  for (let i = 0; i < matchLength; i++) {
    if (springs[pos + i] === ".") {
      return false;
    }
  }
  if (
    pos + matchLength !== springs.length &&
    springs[pos + matchLength] === "#"
  ) {
    return false;
  }
  return true;
}

function countMatches(state, cache) {
  let matchCount = 0;
  const cacheString = state.springs + state.key.join(",");
  if (cache.has(cacheString)) {
    return cache.get(cacheString);
  }
  if (state.key.length === 0) {
    if (state.springs.indexOf("#") === -1) return 1;
    else return 0;
  }

  const matchLength = state.key.pop();
  for (let i = 0; i < state.springs.length; i++) {
    if (isMatch(state.springs, i, matchLength)) {
      let s = state.springs.slice(i + matchLength + 1);
      let newState = {
        springs: s,
        key: structuredClone(state.key),
      };
      matchCount += countMatches(newState, cache);
    }
    if (state.springs[i] === "#") {
      break;
    }
  }
  cache.set(cacheString, matchCount);
  return matchCount;
}

function part1() {
  let linesCopy = structuredClone(lines);
  let sum = 0;
  for (let line of linesCopy) {
    let cache = new Map();
    let count = countMatches(line, cache);
    sum += count;
  }
  console.log(sum);
}

function unfold(line) {
  let newsprings = structuredClone(line.springs);
  let newkey = structuredClone(line.key);
  for (let i = 0; i < 4; i++) {
    newsprings = newsprings + "?" + line.springs;
    newkey.push(...line.key);
  }
  return { springs: newsprings, key: newkey };
}

function part2() {
  let sum = 0;
  let lineNum = 0;
  let st = Date.now();
  for (const l of lines) {
    const line = unfold(l);
    let cache = new Map();
    let count = countMatches(line, cache);
    sum += count;
  }
  let et = Date.now();
  console.log(et - st);
  console.log(sum);
}

part1();
part2();
