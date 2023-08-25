const authorize = require("./src/authorize.js");
const calculate = require("./src/calculate.js");

exports.handler = async function (event) {
  // Authorize
  if (!await authorize(event)) {
    return {
      statusCode: 403,
      body: "Unauthorized"
    };
  }
  
  // Calculate
  const result = await calculate(event);
  return {
    statusCode: 200,
    body: JSON.stringify(result)
  };
};
