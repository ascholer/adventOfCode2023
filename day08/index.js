import { getData } from "utils";

const lines = getData("data.txt").split("\n");

function part1() {
  const pattern = lines[0].split("");
  const nodes = {};
  lines.slice(2).forEach((line) => {
    const parts = line.replaceAll(/( =)|\(|,|\)/g, "").split(" ");
    nodes[parts[0]] = { L: parts[1], R: parts[2] };
  });

  let loc = "AAA";
  let i = 0;
  while (loc !== "ZZZ") {
    const dir = pattern[i++ % pattern.length];
    loc = nodes[loc][dir];
  }
  console.log(i);
}

//Thanks SO... https://stackoverflow.com/questions/68371293/how-can-i-find-the-gcd-of-two-or-more-integers-javascript-no-methods
const gcd = (a, b) => (b == 0 ? a : gcd(b, a % b));
const gcdAll = (n, ...ns) => (ns.length == 0 ? n : gcd(n, gcdAll(...ns)));

function part2() {
  const pattern = lines[0].split("");
  const nodes = {};
  lines.slice(2).forEach((line) => {
    const parts = line.replaceAll(/( =)|\(|,|\)/g, "").split(" ");
    nodes[parts[0]] = { L: parts[1], R: parts[2] };
  });

  let locs = Object.keys(nodes).filter((node) => node.endsWith("A"));
  let cycleLengths = Array(locs.length).fill(0);
  let i = 0;
  //Continue until all cycles are identified
  while (cycleLengths.filter((loc) => loc === 0).length > 0) {
    const dir = pattern[i++ % pattern.length];
    locs = locs.map((loc) => nodes[loc][dir]);
    locs.forEach((loc, index) => {
      if (loc.endsWith("Z") && cycleLengths[index] === 0) {
        cycleLengths[index] = i;
      }
    });
  }
  const gcd = gcdAll(...cycleLengths);
  const total =
    cycleLengths.map((cycle) => cycle / gcd).reduce((a, b) => a * b) * gcd;
  console.log(total);
}

part1();
part2();
