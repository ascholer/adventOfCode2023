import { getData } from "utils";

import { create, all } from "mathjs";

const config = {};
const math = create(all, config);

class ConnectMap {
  constructor() {
    this.cons = new Map();
  }
  add(a, b) {
    if (!this.cons.has(a)) this.cons.set(a, new Set());
    this.cons.get(a).add(b);
    if (!this.cons.has(b)) this.cons.set(b, new Set());
    this.cons.get(b).add(a);
  }
}

function groupCount(conns, ignored) {
  let cmap = new Map();
  let group = 0;
  conns.cons.forEach((c, k) => {
    if (!cmap.has(k)) {
      group++; //new group identified
    }
    let checkList = [k];
    while (checkList.length > 0) {
      let cur = checkList.shift();
      let neighbors = conns.cons.get(cur);
      neighbors.forEach((n) => {
        if (ignored.has(`${cur}-${n}`) || ignored.has(`${n}-${cur}`)) return;
        if (!cmap.has(n)) {
          cmap.set(n, group);
          checkList.push(n);
        }
      });
    }
  });
  return [group, cmap];
}

function part1() {
  const lines = getData("data.txt").split("\n");
  let connections = new ConnectMap();
  let edgeSet = new Set();
  for (let l of lines) {
    let [s, list] = l.split(": ");
    for (let d of list.split(" ")) {
      connections.add(s, d);
      if (!edgeSet.has(`${d}-${s}`)) {
        edgeSet.add(`${s}-${d}`);
      }
    }
  }
  let nodes = [...connections.cons.keys()];
  let nodeNums = new Map();
  nodes.forEach((n, i) => {
    nodeNums.set(n, i);
  });

  let adjMatrix = [];
  for (let n of nodes) {
    let adj = nodes.map((n2) => {
      if (connections.cons.get(n).has(n2)) return 1;
      return 0;
    });
    adjMatrix.push(adj);
  }

  //let mm = math.pow(adjMatrix, 2);

  // let counts = [...connections.cons].map((c) => {
  //   return [c[0], c[1].size];
  // });

  let edgeList = new Array(...edgeSet);
  // edgeList = edgeList.filter((e) => {
  //   let nodes = e.split("-");
  //   let n0num = nodeNums.get(nodes[0]);
  //   let n1num = nodeNums.get(nodes[1]);
  //   return mm[n0num][n1num] === 0;
  // });
  for (let i = 0; i < edgeList.length; i++) {
    console.log(i);
    for (let j = i + 1; j < edgeList.length; j++) {
      console.log(i, j);
      for (let k = j + 1; k < edgeList.length; k++) {
        let ignoredEdges = new Set([edgeList[i], edgeList[j], edgeList[k]]);
        let [groups, colorMap] = groupCount(connections, ignoredEdges);
        if (groups === 2) {
          console.log(groups, ignoredEdges);
          let counts = new Array(3).fill(0);
          for (let [k, v] of colorMap) {
            counts[v]++;
          }
          console.log(counts[1] * counts[2]);
        }
      }
    }
  }
  //groupCount(connections);

  let sum = 0;

  console.log(sum);
}

function part2() {
  let sum = 0;

  console.log(sum);
}

part1();
part2();
