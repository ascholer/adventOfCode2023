import { getData } from "utils";

const grid = getData("data.txt").split("\n");

class SymbolMap extends Map {
  constructor() {
    super();
  }
  addSymbol(row, col, symbol) {
    if (!this.has(row)) this.set(row, new Map());
    this.get(row).set(col, symbol);
  }
  includes(row, col) {
    if (!this.has(row)) return false;
    return this.get(row).has(col);
  }
  getSymbol(row, col) {
    return this.get(row).get(col);
  }
}

function getSymbolMap(grid) {
  let symbolMap = new SymbolMap();
  grid.forEach((row, rowNum) => {
    row.split("").forEach((symbol, colNum) => {
      if (/[^\d\.]/.test(symbol)) {
        symbolMap.addSymbol(rowNum, colNum, symbol);
      }
    });
  });
  return symbolMap;
}

//Number is obj with {row, col, value}
//Returns {symbol, row, col} if adjacent or null if not
function adjacentSymbol(number, symbolMap) {
  const numLength = Math.ceil(Math.log10(number.value + 1));
  for (let c = number.col - 1; c <= number.col + numLength; c++) {
    for (let r = number.row - 1; r <= number.row + 1; r++) {
      if (symbolMap.includes(r, c)) {
        let s = symbolMap.getSymbol(r, c);
        return { s, r, c };
      }
    }
  }
  return null;
}

function part1() {
  let sum = 0;
  const symbolMap = getSymbolMap(grid);
  grid.forEach((line, rowNum) => {
    let numberGroups = line.matchAll(/(\d+)/g);
    for (let match of numberGroups) {
      const number = {
        row: rowNum,
        col: match.index,
        value: parseInt(match[0]),
      };
      if (adjacentSymbol(number, symbolMap) !== null) {
        sum += number.value;
      }
    }
  });
  console.log(sum);
}

class GearMap extends Map {
  constructor() {
    super();
  }
  addMatch(row, col, number) {
    if (!this.has(row)) this.set(row, new Map());
    if (!this.get(row).has(col)) this.get(row).set(col, []);
    this.get(row).get(col).push(number);
  }
  *[Symbol.iterator]() {
    for (let r of this.values()) {
      for (let c of r.values()) {
        yield c;
      }
    }
  }
}

function part2() {
  let sum = 0;
  const symbolMap = getSymbolMap(grid);

  let gears = new GearMap();
  grid.forEach((line, rowNum) => {
    let numberGroups = line.matchAll(/(\d+)/g);
    for (let match of numberGroups) {
      const number = {
        row: rowNum,
        col: match.index,
        value: parseInt(match[0]),
      };
      const symbol = adjacentSymbol(number, symbolMap);
      if (symbol !== null && symbol.s === "*") {
        gears.addMatch(symbol.r, symbol.c, number);
      }
    }
  });

  for (let g of gears) {
    if (g.length === 2) {
      sum += g[0].value * g[1].value;
    }
  }

  console.log(sum);
}

part1();
part2();
