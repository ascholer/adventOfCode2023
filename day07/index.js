import { getData } from "utils";

const lines = getData("data.txt").split("\n");

const ranks = {
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  T: 10,
  J: 11,
  Q: 12,
  K: 13,
  A: 14,
};

function playerCompare(p1, p2, ranking = ranks) {
  let scoreDiff = p1.score - p2.score;
  if (scoreDiff !== 0) return scoreDiff;
  for (let i = 0; i < 5; i++) {
    const rankDiff = ranking[p1.hand[i]] - ranking[p2.hand[i]];
    if (rankDiff !== 0) return rankDiff;
  }
  return 0;
}

function getHandType(hand, JisWild = false) {
  const cards = hand.split("");
  const cardCounts = cards
    .map((card, i) => {
      if (JisWild && card === "J") return null;
      const count = cards.filter((c) => c === card).length;
      if (i === cards.indexOf(card)) return { card, count };
      else return null;
    })
    .filter((c) => c !== null);
  cardCounts.sort((a, b) => b.count - a.count);

  if (JisWild) {
    const Jcount = cards.filter((c) => c === "J").length;
    if (Jcount === 5) return 5;
    else cardCounts[0].count += Jcount;
  }

  switch (cardCounts[0].count) {
    case 5:
    case 4:
      return cardCounts[0].count;
    case 3:
      return cardCounts[1].count === 2 ? 3.5 : 3;
    case 2:
      return cardCounts[1].count === 2 ? 2 : 1;
    default:
      return 0;
  }
}

function part1() {
  const players = lines.map((line) => {
    let [hand, bid] = line.split(" ");
    bid = parseInt(bid);
    return { hand, bid };
  });
  players.forEach((p) => {
    p["score"] = getHandType(p.hand);
  });
  players.sort(playerCompare);
  const total = players.map((p, i) => p.bid * (i + 1)).reduce((a, b) => a + b);
  console.log(total);
}

//--------------------------------------------------------

function part2() {
  let ranks2 = { ...ranks, J: 1 };
  const players = lines.map((line) => {
    let [hand, bid] = line.split(" ");
    bid = parseInt(bid);
    return { hand, bid };
  });
  players.forEach((p) => {
    p["score"] = getHandType(p.hand, true);
  });
  players.sort((a, b) => playerCompare(a, b, ranks2));
  const total = players.map((p, i) => p.bid * (i + 1)).reduce((a, b) => a + b);
  console.log(total);
}

part1();
part2();
