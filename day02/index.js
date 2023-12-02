import { getData } from "utils";

const lines = getData("data.txt").split("\n");

//Get max used for each color in game
function gameRequirements(pullString) {
  let requirements = new Map([
    ["red", 0],
    ["green", 0],
    ["blue", 0],
  ]);
  pullString = pullString.replaceAll(";", ",");
  const pulls = pullString.split(", ");
  pulls.forEach((p) => {
    let [number, color] = p.split(" ");
    requirements.set(color, Math.max(requirements.get(color), number));
  });
  return requirements;
}

function part1() {
  const limits = new Map([
    ["red", 12],
    ["green", 13],
    ["blue", 14],
  ]);
  let sum = 0;
  lines.forEach((l) => {
    const [id, pullString] = l.match(/Game (\d+): (.*)/).slice(1);
    const requirements = gameRequirements(pullString);

    let possible = true;
    requirements.forEach((v, k) => {
      if (v > limits.get(k)) {
        possible = false;
      }
    });
    if (possible) {
      sum += parseInt(id);
    }
  });
  console.log(sum);
}

function part2() {
  let sum = 0;
  lines.forEach((l) => {
    const [id, pullString] = l.match(/Game (\d+): (.*)/).slice(1);
    const requirements = gameRequirements(pullString);
    const power = [...requirements.values()].reduce((a, b) => a * b);
    sum += power;
  });
  console.log(sum);
}

part1();
part2();
