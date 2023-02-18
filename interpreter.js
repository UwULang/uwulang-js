// const readline = require("readline");
// const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout
// });
//
// rl.question("Enter something", (inp)=>{
//     console.log(inp)
//     rl.close()
// })


// const takeInput = () => {
//     rl.question("input: ",(inp) =>{
//       rl.close()
//       return (inp.charAt().codePointAt(0) % 256)
//     })
// }

// const readline = require("readline");
// const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout
// });


function Block(){
    this.val = 0
    this.increment = () => {
        this.val = (this.val + 1) % 256
    }
    this.decrement = () => {
        this.val = this.val > 0 ? this.val - 1: 255
    }
}

function Ptr(){
    this.val = 0
    this.moveRight = () => {
        this.val += 1
    }
    this.moveLeft = () => {
        this.val = this.val > 0 ? this.val - 1: 0
    }
}

function Memory(){
    this.blocks = [new Block()]

    this.accessAt = (i) => i < this.blocks.length ? this.blocks[i] : (() => {
        const needed = i - this.blocks.length + 1;
        for (let j = 0; j < needed; j++) {
            this.blocks.push(new Block())
        }
        return this.blocks
    })()[i]

}

const memory = new Memory()
let instructions = "👆👆👆👆👆👆👆👆😒👉👆👆👆👆😒👉👆👆👉👆👆👆👉👆👆👆👉👆👈👈👈👈👇😡👉👆👉👆👉👇👉👉👆😒👈😡👈👇😡👉👉🥺👉👇👇👇🥺👆👆👆👆👆👆👆🥺🥺👆👆👆🥺👉👉🥺👈👇🥺👈🥺👆👆👆🥺👇👇👇👇👇👇🥺👇👇👇👇👇👇👇👇🥺👉👉👆🥺👉👆👆🥺"
    // "👆👆👆👆😒👉👆👆👆👆👆👈👇😡👉😒👈👆👆👆👆👆👉👇😡👆👈👆😒👉😒👉👆👉👆👈👈👇😡👆👆👉👉😒👈👈👆👉👉👇😡👉👉👉😒👇😡👆👆👉😒👇😡👆👉👉👉👆😒😒👇😡👆👆👆👆👆👆👉👉👉😡👈👈👈😒😒👈👆👆👆👆👆👆👆👆👈👆👆👉👉👇😡👆👈🥺👈😒👉👇👇👇👇👈👇😡👈😡👈👈😒👉👉👉👉👉😒👉👉👉😒👇😡👆👆👆👆👆👆👆👆👆👈😒👉👇👈👇😡👆👆👆👆👆👆👆👆👆👉😒👇😒👈👇👉👇😡👆😒👈👈👈😡😡👈😒👉👆👈👇😡👉😡👈👈👇😡👈👈👇😡"

    // "👆👆👆👆👆👆👆👆😒👉👆👆👆👆😒👉👆👆👉👆👆👆👉👆👆👆👉👆👈👈👈👈👇😡👉👆👉👆👉👇👉👉👆😒👈😡👈👇😡👉👉🥺👉👇👇👇🥺👆👆👆👆👆👆👆🥺🥺👆👆👆🥺👉👉🥺👈👇🥺👈🥺👆👆👆🥺👇👇👇👇👇👇🥺👇👇👇👇👇👇👇👇🥺👉👉👆🥺👉👆👆🥺"
instructions = instructions.split(/([\uD800-\uDBFF][\uDC00-\uDFFF])/).filter((i)=> i !== "")


const count = [0,0]
for (const uwu of instructions) {
    if (uwu === "😒") {
        count[0] += 1
    } else if (uwu === "😡"){
        count[1] += 1
    }
}

if (count[0] !== count[1]) throw new Error("Invalid syntax")

const matchingPos = {}
const stack = []
let i = 0
for (const uwu of instructions) {
    if (uwu === "😒") {
        stack.push(i)
    } else if (uwu === "😡"){
        const opening = stack.pop()
        matchingPos[opening] = i
        matchingPos[i] = opening
    }
    i++
}

stack.length = 0

const ptr = new Ptr()
let instructionAt = 0;
// const instructions = "👆👆👆👆👆👆👆👆😒👉👆👆👆👆😒👉👆👆👉👆👆👆👉👆👆👆👉👆👈👈👈👈👇😡👉👆👉👆👉👇👉👉👆😒👈😡👈👇😡👉👉🥺👉👇👇👇🥺👆👆👆👆👆👆👆🥺🥺👆👆👆🥺👉👉🥺👈👇🥺👈🥺👆👆👆🥺👇👇👇👇👇👇🥺👇👇👇👇👇👇👇👇🥺👉👉👆🥺👉👆👆🥺"

while (instructionAt < instructions.length){
    const block = memory.accessAt(ptr.val)
    const uwu = instructions[instructionAt].codePointAt(0)
    switch (uwu) {
        case "👆".codePointAt(0):
            block.increment()
            break;
        case "👇".codePointAt(0):
            block.decrement()
            break;
        case "👉".codePointAt(0):
            ptr.moveRight()
            break;
        case "👈".codePointAt(0):
            ptr.moveLeft()
            break;
        case "😳".codePointAt(0):
            // block.val = takeInput()
            break;
        case "🥺".codePointAt(0):
            console.log(String.fromCharCode(block.val))
            break;
        case "😒".codePointAt(0):
            instructionAt = block.val === 0 ? matchingPos[instructionAt] - 1 : instructionAt
            break;
        case "😡".codePointAt(0):
            instructionAt = block.val !== 0 ? matchingPos[instructionAt] - 1 : instructionAt
            break;
    }
    instructionAt++
}
