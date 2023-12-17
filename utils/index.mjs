import fs from 'fs';

function getData(filename) {
  try {
    const data = fs.readFileSync(filename, "utf8");
    return data;
  } catch (err) {
    console.error(err);
    throw new Error("File read error");
  }
}

function chunks(arr, n) {
  let result = [];
  for (let i = 0; i < arr.length; i += n) {
    result.push(arr.slice(i, i + n));
  }
  return result;
}

function zip(a, b) {
  return a.map((k, i) => [k, b[i]]);
}

function transpose(matrix) {
  return matrix[0].map((col, i) => matrix.map((row) => row[i]));
}

function isEq(a, b) {
  if (a === null || (b === null && a !== b)) return true;
  if (typeof a !== "object" || typeof b !== "object") return a === b;
  if (Object.keys(a).length !== Object.keys(b).length) return false;
  for (let k of Object.keys(a)) {
    if (!b.hasOwnProperty(k) || !isEq(a[k], b[k])) return false;
  }
  return true;
}

export { getData, chunks, zip, transpose, isEq };
