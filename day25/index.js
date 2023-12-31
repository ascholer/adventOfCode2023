import { getData } from "utils";

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

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  while (currentIndex > 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

function bfs(conns, start) {
  let parents = new Map();
  let visited = new Set();
  let queue = [start];
  let last = start;
  while (queue.length > 0) {
    let cur = queue.shift();
    let neighbors = [...conns.cons.get(cur)];
    //need to avoid always using same edges...
    neighbors = shuffle(neighbors);
    neighbors.forEach((n) => {
      if (!visited.has(n)) {
        parents.set(n, cur);
        queue.push(n);
        visited.add(n);
        last = n;
      }
    });
  }
  return [last, parents];
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

  //figure out which edges are required for longest paths from random nodes
  const trials = 10000;
  let requireCounts = new Map();
  for (let i = 0; i < trials; i++) {
    let used = new Set();
    let n1 = nodes[Math.floor(Math.random() * nodes.length)];
    let [end, parents] = bfs(connections, n1);
    let cur = end;
    while (cur !== n1) {
      let dest = parents.get(cur);
      let edge = `${cur}-${dest}`;
      let edge2 = `${dest}-${cur}`;
      used.add(edge);
      used.add(edge2);
      cur = dest;
    }
    for (let e of used) {
      if (!requireCounts.has(e)) requireCounts.set(e, 0);
      requireCounts.set(e, requireCounts.get(e) + 1);
    }
  }

  requireCounts = [...requireCounts];
  requireCounts.sort((a, b) => {
    return b[1] - a[1];
  });

  for (let i = 0; i < requireCounts.length; i += 2) {
    for (let j = i + 2; j < requireCounts.length; j += 2) {
      for (let k = j + 2; k < requireCounts.length; k += 2) {
        let ignoredEdges = new Set([
          requireCounts[i][0],
          requireCounts[j][0],
          requireCounts[k][0],
        ]);
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
}

part1();
