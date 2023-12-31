import { getData } from "utils";
import { create, all } from "mathjs";

const config = {};
const math = create(all, config);

const EPS = 0.0000000001;

class XYZ {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  make2D() {
    this.z = 0;
  }
  toArray() {
    return [this.x, this.y, this.z];
  }
  minus(other) {
    return new XYZ(this.x - other.x, this.y - other.y, this.z - other.z);
  }
  eq(other) {
    if (
      Math.abs(this.x - other.x) < EPS &&
      Math.abs(this.y - other.y) < EPS &&
      Math.abs(this.z - other.z) < EPS
    )
      return true;
    return false;
  }
  inRange(min, max, includeZ = false) {
    if (!(min <= this.x && this.x <= max)) return false;
    if (!(min <= this.y && this.y <= max)) return false;
    if (includeZ && !(min <= this.z && this.z <= max)) return false;
    return true;
  }
}

class Hailstone {
  constructor(i, v) {
    this.i = i;
    this.v = v;
    this.cache = new Map();
  }
  make2D() {
    this.i.z = 0;
    this.v.z = 0;
  }
  posAt(t) {
    if (this.cache.has(t)) return this.cache.get(t);
    let pos = new XYZ(
      this.i.x + t * this.v.x,
      this.i.y + t * this.v.y,
      this.i.z + t * this.v.z
    );
    this.cache.set(t, pos);
    return pos;
  }
}

class Segment {
  constructor(p1, p2) {
    this.p1 = p1;
    this.p2 = p2;
  }
}

//adopted from: https://paulbourke.net/geometry/pointlineplane/lineline.c

/*
   Calculate the line segment PaPb that is the shortest route between
   two lines P1P2 and P3P4. Calculate also the values of mua and mub where
      Pa = P1 + mua (P2 - P1)
      Pb = P3 + mub (P4 - P3)
   Return FALSE if no solution exists.
*/
function getIntersect(p1, p2, p3, p4) {
  let p13 = new XYZ(p1.x - p3.x, p1.y - p3.y, p1.z - p3.z);
  let p43 = new XYZ(p4.x - p3.x, p4.y - p3.y, p4.z - p3.z);

  if (Math.abs(p43.x) < EPS && Math.abs(p43.y) < EPS && Math.abs(p43.z) < EPS)
    return null;

  let p21 = new XYZ(p2.x - p1.x, p2.y - p1.y, p2.z - p1.z);
  if (Math.abs(p21.x) < EPS && Math.abs(p21.y) < EPS && Math.abs(p21.z) < EPS)
    return null;

  let d1343 = p13.x * p43.x + p13.y * p43.y + p13.z * p43.z;
  let d4321 = p43.x * p21.x + p43.y * p21.y + p43.z * p21.z;
  let d1321 = p13.x * p21.x + p13.y * p21.y + p13.z * p21.z;
  let d4343 = p43.x * p43.x + p43.y * p43.y + p43.z * p43.z;
  let d2121 = p21.x * p21.x + p21.y * p21.y + p21.z * p21.z;

  let denom = d2121 * d4343 - d4321 * d4321;
  if (Math.abs(denom) < EPS) return null;

  let numer = d1343 * d4321 - d1321 * d4343;

  let mua = numer / denom;
  let mub = (d1343 + d4321 * mua) / d4343;

  let pa = new XYZ(p1.x + mua * p21.x, p1.y + mua * p21.y, p1.z + mua * p21.z);
  let pb = new XYZ(p3.x + mub * p43.x, p3.y + mub * p43.y, p3.z + mua * p43.z);

  return { pa, pb, mua, mub };
}

function getHail(filename, make2d = true) {
  let hailList = [];
  const lines = getData(filename).split("\n");
  for (let l of lines) {
    let parts = l.match(
      /(-?\d+),\s*(-?\d+),\s*(-?\d+)\s*@\s*(-?\d+),\s*(-?\d+),\s*(-?\d+)/
    );
    parts = parts.map((p) => parseInt(p));
    let pos = new XYZ(parts[1], parts[2], parts[3]);
    let vel = new XYZ(parts[4], parts[5], parts[6]);
    if (make2d) {
      pos.make2D();
      vel.make2D();
    }
    let h = new Hailstone(pos, vel);
    hailList.push(h);
  }
  return hailList;
}

function part1() {
  let hail = getHail("data.txt");
  //let bounds = { min: 7, max: 27 };
  let bounds = { min: 200000000000000, max: 400000000000000 };
  //console.log(hail);

  let tMin = 0;
  let tMax = 1;

  let sum = 0;

  for (let i = 0; i < hail.length; i++) {
    for (let j = i + 1; j < hail.length; j++) {
      let h1 = hail[i];
      let h2 = hail[j];
      let p1 = h1.posAt(tMin);
      let p2 = h1.posAt(tMax);
      let p3 = h2.posAt(tMin);
      let p4 = h2.posAt(tMax);

      let r = getIntersect(p1, p2, p3, p4);

      let inRange = r && r.pa.inRange(bounds.min, bounds.max);
      let inFuture = r && r.mua >= 0 && r.mub >= 0;
      if (inRange && inFuture) sum++;
      //console.log(r, inRange && inFuture, i, j);
    }
  }

  console.log(sum);
}

function intersectLinePlane(p, n, hail) {
  let hibig = hail.i.toArray().map((n) => math.bignumber(n));
  let hvbig = hail.v.toArray().map((n) => math.bignumber(n));
  let a = math.dot(math.subtract(p, hibig), n);
  let b = math.dot(hvbig, n);
  let t = math.divide(a, b);
  let newp = math.add(hibig, math.multiply(hvbig, t));
  return [newp, t];
}

function part2() {
  let hail = getHail("data.txt", false);

  let hailRelative = hail.map((h) => {
    return new Hailstone(h.i.minus(hail[0].i), h.v.minus(hail[0].v));
  });

  let p0 = hailRelative[0].i.toArray().map((n) => math.bignumber(n));
  let p1a = hailRelative[1].posAt(0);
  let p1b = hailRelative[1].posAt(1);

  let p1aBig = p1a.toArray().map((n) => math.bignumber(n));
  let p1bBig = p1b.toArray().map((n) => math.bignumber(n));

  let normal = math.cross(p1aBig, p1bBig);

  let h2 = hailRelative[2];
  let h3 = hailRelative[3];

  let [p2, t2] = intersectLinePlane(p0, normal, h2);
  let [p3, t3] = intersectLinePlane(p0, normal, h3);

  let diffT = math.subtract(t2, t3);
  let dir = math.divide(math.subtract(p2, p3), diffT);
  let pos = math.subtract(p2, math.multiply(dir, t2));

  let h0ibig = hail[0].i.toArray().map((n) => math.bignumber(n));
  pos = math.add(pos, h0ibig);
  let sum = pos.reduce((a, b) => math.add(a, b));
  console.log(math.number(sum));
}

//part1();
part2();
