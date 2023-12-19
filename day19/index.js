import { getData } from "utils";

const [workflowLines, partLines] = getData("data.txt").split("\n\n");

class Rule {
  constructor(category, symbol, value, next) {
    this.category = category;
    this.symbol = symbol;
    this.value = value;
    this.next = next;
  }
  accepts(part) {
    let pVal = part[this.category];
    if (this.symbol == "<") {
      return pVal < this.value;
    } else {
      return pVal > this.value;
    }
  }
  filter(partsRange) {
    let cat = this.category;
    let rejected = partsRange.clone();
    if (this.symbol == "<") {
      partsRange[cat].max = this.value - 1;
      rejected[cat].min = this.value;
    } else {
      partsRange[cat].min = this.value + 1;
      rejected[cat].max = this.value;
    }
    return [partsRange, rejected];
  }
}

class DefaultRule {
  constructor(defaultValue) {
    this.next = defaultValue;
  }
  accepts(part) {
    return true;
  }
}

function parseWorkflow(workflowText) {
  let workflows = new Map();
  workflowText.split("\n").forEach((line) => {
    let [m, name, ruleText] = line.match(/(\w+){(.*)}/);
    let rules = ruleText.split(",").map((n) => {
      let match = n.match(/([xmas])([<>])(\d+):(\w+)/);
      if (match) {
        let [m, cat, symbol, value, next] = match;
        return new Rule(cat, symbol, Number.parseInt(value), next);
      } else {
        let [m, defaultValue] = n.match(/(\w+)/);
        return new DefaultRule(defaultValue);
      }
    });
    workflows.set(name, rules);
  });
  return workflows;
}

function part1() {
  let workflows = parseWorkflow(workflowLines);

  let sum = 0;

  partLines.split("\n").forEach((line) => {
    let part = {};
    line
      .slice(1, -1)
      .split(",")
      .forEach((catValue) => {
        let cat = catValue[0];
        let value = Number.parseInt(catValue.slice(2));
        part[cat] = value;
      });
    let workflow = "in";
    while (workflow != "R" && workflow != "A") {
      let rules = workflows.get(workflow);
      for (let r of rules) {
        if (r.accepts(part)) {
          workflow = r.next;
          break;
        }
      }
    }
    if (workflow == "A") {
      let partTotal = part.x + part.m + part.a + part.s;
      sum += partTotal;
    }
    console.log(part, workflow);
  });

  console.log(sum);
}

class PartsRange {
  constructor(parts) {
    for (let p of ["x", "m", "a", "s"]) {
      this[p] = { min: 1, max: 4000 };
    }
  }
  clone() {
    let clone = new PartsRange();
    for (let p of ["x", "m", "a", "s"]) {
      clone[p].min = this[p].min;
      clone[p].max = this[p].max;
    }
    return clone;
  }
  score() {
    let score = 1;
    for (let p of ["x", "m", "a", "s"]) {
      let range = this[p];
      score *= range.max - range.min + 1;
    }
    return score;
  }
}

function part2() {
  let workflows = parseWorkflow(workflowLines);

  let pBundle = { parts: new PartsRange(), workflow: "in", step: 0 };
  let pStack = [pBundle];

  let sum = 0;
  while (pStack.length > 0) {
    let pBundle = pStack.pop();
    let { parts, workflow, step } = pBundle;

    if (workflow == "R") {
      continue;
    }
    if (workflow == "A") {
      let partTotal = parts.score();
      sum += partTotal;
      continue;
    }

    let rules = workflows.get(workflow);
    if (rules[step] instanceof DefaultRule) {
      pStack.push({ parts, workflow: rules[step].next, step: 0 });
      continue;
    }
    let [p, r] = rules[step].filter(parts);
    pStack.push({ parts: p, workflow: rules[step].next, step: 0 });
    pStack.push({ parts: r, workflow, step: step + 1 });
  }
  console.log(sum);
}

//part1();
part2();
