import { getData } from "utils";

const data = getData("data.txt");
const lines = data.split("\n");

function part1() {
  let sum = 0;
  for (let line of lines) {
    const chars = line.split("");

    function isDigit(char) {
      return char >= "0" && char <= "9";
    }

    let d1 = chars.find(isDigit);
    let d2 = chars.reverse().find(isDigit);
    sum += parseInt(d1 + d2);
  }
  console.log(sum);
}

const digits = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
];

function part2() {
  let sum = 0;
  for (let line of lines) {
    let matches = digits
      .map((d, index) => {
        return {
          loc: line.indexOf(d),
          lastloc: line.lastIndexOf(d),
          value: index % 10,
        };
      })
      .filter((match) => match.loc > -1);

    let d1 = matches.reduce((acc, curr) =>
      acc.loc < curr.loc ? acc : curr
    ).value;

    let d2 = matches.reduce((acc, curr) =>
      acc.lastloc > curr.lastloc ? acc : curr
    ).value;

    sum += d1 * 10 + d2;
  }
  console.log(sum);
}

part1();
part2();
