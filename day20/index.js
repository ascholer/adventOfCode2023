import { getData, lcm } from "utils";

class Broadcast {
  constructor(name, targets) {
    this.name = name;
    this.targets = targets;
  }
  recieve(sender, pulse) {
    return this.targets.map((target) => {
      return {
        source: this,
        target,
        pulse,
      };
    });
  }
}

class Output {
  constructor(name) {
    this.name = name;
    this.lowPulses = 0;
  }
  recieve(sender, pulse) {
    if (!pulse) {
      this.lowPulses++;
    }
    return [];
  }
}

class FlipFlop {
  constructor(name, targets) {
    this.name = name;
    this.state = false;
    this.targets = targets;
  }
  recieve(sender, pulse) {
    if (!pulse) {
      this.state = !this.state;
      return this.targets.map((target) => {
        return {
          source: this,
          target,
          pulse: this.state,
        };
      });
    } else {
      return [];
    }
  }
  toString() {
    return `${this.name}: ${this.state}`;
  }
}

class Conjunction {
  constructor(name, targets) {
    this.name = name;
    this.targets = targets;
    this.senderMem = {};
  }
  initSender(sender) {
    this.senderMem[sender.name] = false;
  }
  recieve(sender, pulse) {
    this.senderMem[sender.name] = pulse;
    let allPulse = Object.values(this.senderMem).every(
      (pulse) => pulse === true
    );
    let sendValue = allPulse ? false : true;

    return this.targets.map((target) => {
      return {
        source: this,
        target,
        pulse: sendValue,
      };
    });
  }
  toString() {
    let s = Object.entries(this.senderMem).map(([k, v]) => `${k}: ${v}`);
    return `${this.name}: ` + s.join(", ");
  }
}

function getModules(filename) {
  const lines = getData(filename).split("\n");
  let modules = new Map();
  lines.forEach((line) => {
    let [m, type, name, dest] = line.match(/([%&])?(\w+) -> (.*)/);
    dest = dest.split(", ");
    if (type === "%") {
      modules.set(name, new FlipFlop(name, dest));
    } else if (type === "&") {
      modules.set(name, new Conjunction(name, dest));
    } else {
      modules.set(name, new Broadcast(name, dest));
    }
  });
  modules.forEach((module) => {
    if (module.targets === undefined) return;
    let realTargets = module.targets.map((t) => {
      if (modules.has(t)) return modules.get(t);
      let target = new Output(t);
      modules.set(t, target);
      return target;
    });
    module.targets = realTargets;
    module.targets.forEach((target) => {
      if (target instanceof Conjunction) {
        target.initSender(module);
      }
    });
  });
  return modules;
}

function part1() {
  const modules = getModules("data.txt");
  let pulseCount = { false: 0, true: 0 };
  for (let i = 0; i < 1000; i++) {
    let trigger = {
      source: null,
      target: modules.get("broadcaster"),
      pulse: false,
    };
    let propList = [trigger];
    while (propList.length > 0) {
      let p = propList.shift();
      pulseCount[p.pulse]++;
      let newProps = p.target.recieve(p.source, p.pulse);
      propList = propList.concat(newProps);
    }
  }
  console.log(pulseCount[true] * pulseCount[false]);
}

function part2() {
  const modules = getModules("data.txt");

  let found = false;
  let i = 0;
  let keyNodes = ["pm", "mk", "pk", "hf"];
  let seenKeyNodes = new Map();
  while (seenKeyNodes.size < keyNodes.length) {
    i++;
    let trigger = {
      source: null,
      target: modules.get("broadcaster"),
      pulse: false,
    };
    let propList = [trigger];
    while (propList.length > 0) {
      let p = propList.shift();
      if (keyNodes.includes(p.source?.name) && p.pulse == true) {
        console.log(p.source.name, i);
        console.log(i);
        if (!seenKeyNodes.has(p.source.name)) {
          seenKeyNodes.set(p.source.name, i);
        }
      }
      let newProps = p.target.recieve(p.source, p.pulse);
      propList = propList.concat(newProps);
    }
  }
  console.log(seenKeyNodes);
  console.log(lcm([...seenKeyNodes].map((e) => e[1])));
}

part1();
part2();
