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

export { getData };
