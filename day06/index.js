import { getData, zip } from "utils";

const lines = getData("data.txt").split("\n");

function part1() {
  const timeGroups = lines[0].match(/(\d+)/g);
  const distGroups = lines[1].match(/(\d+)/g);
  const races = zip(timeGroups, distGroups);

  let ways = 1;
  for (const race of races) {
    const [time, dist] = race;
    let raceWins = 0;
    for (let i = 0; i < time; i++) {
      const totalDist = i * (time - i);
      if (totalDist > dist) {
        raceWins++;
      }
    }
    ways *= raceWins;
  }

  console.log(ways);
}

function part2() {
  const time = lines[0].replaceAll(" ", "").match(/(\d+)/g);
  const dist = lines[1].replaceAll(" ", "").match(/(\d+)/g);

  let min;
  for (let i = 0; i < time; i++) {
    const totalDist = i * (time - i);
    if (totalDist > dist) {
      min = i;
      break;
    }
  }

  let max;
  for (let i = time - 1; i > 0; i--) {
    const totalDist = i * (time - i);
    if (totalDist > dist) {
      max = i;
      break;
    }
  }
  console.log(max - min + 1);
}

part1();
part2();
