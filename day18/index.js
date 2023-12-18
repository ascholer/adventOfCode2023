import { getData } from "utils";

function floodfill(map, row, col, color) {
  let stack = [];
  stack.push([row, col]);
  while (stack.length > 0) {
    let [r, c] = stack.pop();
    //console.log(r, c);
    if (Math.abs(r) >= 250 || Math.abs(c) >= 250) {
      console.log("out of bounds");
      return 0;
    }

    let key = `${r},${c}`;
    if (map.has(key)) {
      continue;
    }
    map.set(key, "XXXXXX");
    stack.push([r + 1, c]);
    stack.push([r - 1, c]);
    stack.push([r, c + 1]);
    stack.push([r, c - 1]);
  }
}

function part1() {
  let pos = { r: 0, c: 0 };
  let walls = new Map();

  const lines = getData("data.txt").split("\n");
  lines.forEach((line) => {
    let [dump, dir, amt, color] = line.match(/(\w) (\d+) \(#([0-9a-f]{6})\)/);
    amt = parseInt(amt);
    for (let i = 0; i < amt; i++) {
      switch (dir) {
        case "R":
          pos.c += 1;
          break;
        case "L":
          pos.c -= 1;
          break;
        case "U":
          pos.r -= 1;
          break;
        case "D":
          pos.r += 1;
          break;
      }
      let key = `${pos.r},${pos.c}`;
      if (!walls.has(key)) {
        walls.set(key, color);
      }
    }
  });

  //floodfill(walls, 1, 1, "XXXXXX"); //in test
  floodfill(walls, 50, 50, "XXXXXX"); //in real

  console.log(walls.size);
}

function getCorners(lines) {
  let pos = { r: 0, c: 0 };

  let corners = new Array();

  lines.forEach((line) => {
    let [dump, dir, amt, color] = line.match(/(\w) (\d+) \(#([0-9a-f]{6})\)/);
    amt = parseInt(color.slice(0, 5), 16);
    dir = color[5];
    switch (dir) {
      case "0":
        pos.c += amt;
        break;
      case "2":
        pos.c -= amt;
        break;
      case "3":
        pos.r -= amt;
        break;
      case "1":
        pos.r += amt;
        break;
    }
    corners.push({ r: pos.r, c: pos.c });
  });
  return corners;
}

function cornersToLines(corners) {
  let hLines = [];
  let vLines = [];
  corners.unshift({ r: 0, c: 0 });
  for (let i = 0; i < corners.length - 1; i += 2) {
    let c1 = corners[i];
    let c2 = corners[i + 1];
    hLines.push({
      r: c1.r,
      startcol: Math.min(c1.c, c2.c),
      endcol: Math.max(c1.c, c2.c),
    });
    let c3 = corners[i + 2];
    vLines.push({
      c: c2.c,
      startrow: Math.min(c3.r, c2.r),
      endrow: Math.max(c3.r, c2.r),
    });
  }
  hLines.sort((a, b) => a.r - b.r);
  vLines.sort((a, b) => a.c - b.c);
  return [hLines, vLines];
}

function checkVLines(vLines, row, col) {
  for (let i = 0; i < vLines.length; i++) {
    if (
      col === vLines[i].c &&
      row >= vLines[i].startrow &&
      row <= vLines[i].endrow
    ) {
      return vLines[i];
    }
  }
  return null;
}

function part2() {
  const lines = getData("data.txt").split("\n");
  let minc = -3134569; //real
  let maxc = 10407190; //real
  // const lines = getData("testdata.txt").split("\n");
  // let minc = 0; //tests
  // let maxc = 1186328; //test

  let corners = getCorners(lines);
  let [hLines, vLines] = cornersToLines(corners);

  let sum = 0;
  for (let c = minc; c <= maxc; c++) {
    let curRow = Number.MIN_SAFE_INTEGER;
    let total = 0;
    let inBounds = false;
    for (let i = 0; i < hLines.length; i++) {
      if (c >= hLines[i].startcol && c <= hLines[i].endcol) {
        let isStartOfHLine = c === hLines[i].startcol;
        let isEndOfHLine = c === hLines[i].endcol;
        if (isStartOfHLine || isEndOfHLine) {
          let intersectedVLine = checkVLines(vLines, hLines[i].r, c);
          let isStartOfVLine = hLines[i].r === intersectedVLine.startrow;
          if (isStartOfVLine) {
            if (inBounds) {
              let distance = hLines[i].r - curRow;
              total += distance;
            }
            curRow = hLines[i].r;
          } else {
            //end of VLine - always was part of shape
            let distance = hLines[i].r - curRow + 1;
            total += distance;
            curRow = hLines[i].r + 1;
          }
          if (isEndOfHLine) inBounds = !inBounds;
        } else {
          //middle of hLine
          if (inBounds) {
            let distance = hLines[i].r - curRow + 1;
            total += distance;
          }
          inBounds = !inBounds;
          curRow = hLines[i].r;
        }
      }
    }
    sum += total;
  }

  console.log(sum);
}

//part1();
part2();
