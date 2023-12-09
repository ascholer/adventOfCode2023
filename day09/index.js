import { getData } from "utils";

const lines = getData("data.txt").split("\n");

function getNext(values) {
  if (values.every((value) => value === 0)) {
    return 0;
  }

  const deltas = values.slice(1).map((value, i) => {
    return value - values[i];
  });
  const step = getNext(deltas);
  return values[values.length - 1] + step;
}

function part1() {
  let sum = 0;
  for (const line of lines) {
    const values = line.split(" ").map((value) => parseInt(value));
    const step = getNext(values);
    sum += step;
  }
  console.log(sum);
}

//--------------------------------------------------------------

function getPrev(values) {
  if (values.every((value) => value === 0)) {
    return 0;
  }

  const deltas = values.slice(1).map((value, i) => {
    return value - values[i];
  });
  const step = getPrev(deltas);
  return values[0] - step;
}

function part2() {
  let sum = 0;
  for (const line of lines) {
    const values = line.split(" ").map((value) => parseInt(value));
    const step = getPrev(values);
    sum += step;
  }
  console.log(sum);
}

part1();
part2();
