const Counter = require("./counter");
const Newest = require("./newest"); 

class Handler {
  static from(input) {
    switch (input) {
      case "COUNTER":
        return Counter;
      case "NEWEST":
        return Newest;
      default:
        throw new Error(`Handler for ${input} not found.`);
    }
  }
}

module.exports = Handler;
