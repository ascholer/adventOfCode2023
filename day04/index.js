import { getData } from "utils";

const lines = getData("data.txt").split("\n");

function part1() {
  let sum = 0;
  for (const card of lines) {
    const [match, winnerString, heldString] = card.match(/.*:(.*)\|(.*)/);
    const winners = new Set(
      winnerString.split(" ").filter((x) => x.trim() !== "")
    );
    const held = heldString.split(" ").filter((x) => x.trim() !== "");

    const winCount = held.filter((x) => winners.has(x)).length;
    const cardTotal = winCount > 0 ? Math.pow(2, winCount - 1) : 0;
    sum += cardTotal;
  }

  console.log(sum);
}

function addOrSet(map, key, value) {
  if (map.has(key)) {
    map.set(key, map.get(key) + value);
  } else {
    map.set(key, value);
  }
}

function part2() {
  let cards = new Map();
  let currentCard = 0;
  for (const card of lines) {
    currentCard++;
    addOrSet(cards, currentCard, 1); //initial card
    const [match, winnerString, heldString] = card.match(/Card.*:(.*)\|(.*)/);
    const winners = new Set(
      winnerString.split(" ").filter((x) => x.trim() !== "")
    );
    const held = heldString.split(" ").filter((x) => x.trim() !== "");

    const copyCount = cards.get(currentCard);
    const matches = held.filter((x) => winners.has(x)).length;
    for (let i = currentCard + 1; i <= currentCard + matches; i++) {
      addOrSet(cards, i, copyCount);
    }
  }
  const sum = [...cards.values()].reduce((a, b) => a + b);
  console.log(sum);
}

part1();
part2();
