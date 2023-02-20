function Block() {
    this.val = 0;
    this.increment = () => {
        this.val = (this.val + 1) % 256;
    };
    this.decrement = () => {
        this.val = this.val > 0 ? this.val - 1 : 255;
    };
}

function Ptr() {
    this.val = 0;
    this.moveRight = () => {
        this.val += 1;
    };
    this.moveLeft = () => {
        this.val = this.val > 0 ? this.val - 1 : 0;
    };
}

function Memory() {
    this.blocks = [new Block()];

    this.accessAt = (i) =>
        i < this.blocks.length
            ? this.blocks[i]
            : (() => {
                  const needed = i - this.blocks.length + 1;
                  for (let j = 0; j < needed; j++) {
                      this.blocks.push(new Block());
                  }
                  return this.blocks;
              })()[i];
}

function askQuestion() {
    return new Promise((resolve) => {
        process.stdin.setEncoding("ascii");
        process.stdin.setRawMode(true);

        process.stdin.on("data", function (key) {
            if (key === "\u0003") {
                process.exit();
            } else {
                resolve(key.charCodeAt(0) % 128);
                // process.exit();
            }
        });
    });
}

export default async function run(instructions) {
    const memory = new Memory();

    instructions = instructions
        .split(/([\uD800-\uDBFF][\uDC00-\uDFFF])/)
        .filter((i) => i !== "");

    const count = [0, 0];
    for (const uwu of instructions) {
        if (uwu === "😒") {
            count[0] += 1;
        } else if (uwu === "😡") {
            count[1] += 1;
        }
    }

    if (count[0] !== count[1]) throw new Error("Invalid syntax");

    // precompute matching brackets
    const matchingPos = {};
    const stack = [];
    let i = 0;
    for (const uwu of instructions) {
        if (uwu === "😒") {
            stack.push(i);
        } else if (uwu === "😡") {
            const opening = stack.pop();
            matchingPos[opening] = i;
            matchingPos[i] = opening;
        }
        i++;
    }

    stack.length = 0;

    const ptr = new Ptr();
    let instructionAt = 0;

    while (instructionAt < instructions.length) {
        const block = memory.accessAt(ptr.val);
        const uwu = instructions[instructionAt].codePointAt(0);
        switch (uwu) {
            case "👆".codePointAt(0):
                block.increment();
                break;
            case "👇".codePointAt(0):
                block.decrement();
                break;
            case "👉".codePointAt(0):
                ptr.moveRight();
                break;
            case "👈".codePointAt(0):
                ptr.moveLeft();
                break;
            case "😳".codePointAt(0):
                // block.val = prompt()
                await askQuestion();
                break;
            case "🥺".codePointAt(0):
                await process.stdout.write(String.fromCharCode(block.val));
                // yield String.fromCharCode(block.val);
                break;
            case "😒".codePointAt(0):
                instructionAt =
                    block.val === 0
                        ? matchingPos[instructionAt] - 1
                        : instructionAt;
                break;
            case "😡".codePointAt(0):
                instructionAt =
                    block.val !== 0
                        ? matchingPos[instructionAt] - 1
                        : instructionAt;
                break;
        }
        instructionAt++;
    }
}
