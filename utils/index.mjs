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

export { getData, chunks, zip };
