/*
Code Logic
- It checks the command-line arguments to ensure a filename is provided.
- Reads and parses the JSON file.
- Calls the evaluateTree function, which is a function that implements the Stack Data Structure and a Dictionary
- Prints the result to the console.
*/

// module for file system
import { readFileSync } from 'fs';

// Node interface to represent the nodes
interface Node {
    action?: '+' | '-' | '*' | '/' | '^';
    value?: number;
    left?: Node;
    right?: Node;
}

function evaluateTree(root: Node): number|undefined {
    // inititialise Stack
    const stack: Node[] = [root];
    // Dictionary with values
    const evaluated: Map<Node, number> = new Map();

    while (stack.length) {
        console.log("\n-------------------------------------\n")
        console.log("\nstack length:", stack.length)
        // Current Node
        const current = stack[stack.length - 1];
        console.log("\n Current Node", current)

        // If the node has a value, it's a leaf node, and we can just store its value
        if (current.value !== undefined) {
            console.log("\n Current Node is leaf node saving value ", current.value," on Dictionary")
            evaluated.set(current, current.value);
            stack.pop();
            continue;
        }
        
        // Find anything that is evaluated
        const leftValue = current.left && evaluated.get(current.left);
        console.log("\n left:",leftValue)
        const rightValue = current.right && evaluated.get(current.right);
        console.log("\n right:",rightValue)
        // If both children have been evaluated, we can evaluate the current node
        if (leftValue !== undefined && rightValue !== undefined) {
            let result: number;
            switch (current.action) {
                case '+':
                    result = leftValue + rightValue;
                    break;
                case '-':
                    result = leftValue - rightValue;
                    break;
                case '*':
                    result = leftValue * rightValue;
                    break;
                case '/':
                    result = leftValue / rightValue;
                    break;
                case '^':
                    result = Math.pow(leftValue, rightValue);
                    break;
                default:
                    throw new Error('Unknown action');
            }
            console.log("\n left and right are found computing and saving value ", result," on Dictionary")
            evaluated.set(current, result);
            stack.pop();
        } else {
            // If children haven't been evaluated, push them to the stack

            // if left not in Dictionary grab the left Node
            if (current.left && !evaluated.has(current.left)) {
                stack.push(current.left);
            }

            // if Right not in Dictionary Grab the right node
            if (current.right && !evaluated.has(current.right)) {
                stack.push(current.right);
            }
        }
    }

    return evaluated.get(root);
}



// Main logic
if (process.argv.length !== 3) {
    console.error('Usage: ts-node index.ts filename.json');
    process.exit(1);
}

const filename = process.argv[2];
const content = readFileSync(filename, 'utf-8');
const tree: Node = JSON.parse(content);

console.log("\n\nFinal Result is:",evaluateTree(tree));

