import { getData } from "utils";

const hashes = getData("data.txt").split(",");

function getHash(s) {
  return s
    .split("")
    .map((c) => c.charCodeAt())
    .reduce((a, b) => ((a + b) * 17) % 256, 0);
}

function part1() {
  let sum = 0;
  for (let hash of hashes) {
    sum += getHash(hash);
  }
  console.log(sum);
}

class LensMap {
  constructor(n) {
    this.a = new Array(n);
    for (let i = 0; i < n; i++) {
      this.a[i] = [];
    }
  }
  add(label, lens) {
    let hash = getHash(label);
    let box = this.a[hash];
    let contains = false;
    box.forEach((l) => {
      if (l.label == label) {
        l.focal = lens;
        contains = true;
      }
    });
    if (!contains) {
      box.push({ label, focal: lens });
    }
  }
  remove(label) {
    let hash = getHash(label);
    let box = this.a[hash];
    let newBox = box.filter((l) => l.label != label);
    this.a[hash] = newBox;
  }
}

function part2() {
  let map = new LensMap(256);
  for (let hash of hashes) {
    let [m, label, op, lens] = hash.match(/(\w+)(=|-)(\d*)/);
    if (op == "=") {
      map.add(label, parseInt(lens));
    } else {
      map.remove(label);
    }
  }

  let sum = 0;
  map.a.forEach((b, bi) => {
    b.forEach((lens, li) => {
      sum += (bi + 1) * (li + 1) * lens.focal;
    });
  });
  console.log(sum);
}

part1();
part2();
