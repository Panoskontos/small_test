const Action = require("./models/action");
const Handlers = require("./handlers");
const { dbClient } = require("./common/db");
const Counter = require("./handlers/counter");
const Newest = require("./handlers/newest");

async function getByActionId(id) {
  const result = await dbClient.get({
      TableName: "actions",
      Key: { pk: id }
  }).promise();
  return result.Item;
}


async function calculate(event) {
  const body = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
  const actionId = body.actionid;
  console.log("********************")
  console.log("calc actionid:", actionId); 
  
  const test_action = await getByActionId(actionId);
  const action = new Action({id:test_action.pk, parentRule:test_action.parentRule, role:test_action.ROLE, handler:test_action.handler})
  console.log("calc action:", action); 
  const childActions = await action.getChildActions();
  console.log("Child Actions:", childActions);  // Log the child actions


  let results = [];
  
  for (let childAction of childActions) {
    results.push(await calculate({ body: { actionid: childAction.id } }));
  }

  if (typeof(action.handler)!==typeof(Counter)&&typeof(action.handler)!==typeof(Newest)) {
    throw new Error(`No handler found for type ${action.handler}`);
}

if (action.handler instanceof Counter){
  console.log("counter", Handlers.from("COUNTER"));
}
else if (action.handler instanceof Newest){
  console.log("newest", Handlers.from("NEWEST"));
}
else {
  return Handlers.from("COUNTER");
}

// return Handlers.from(action.handler)
  // console.log(Handlers[action.handler])
  // return Handlers[action.handler]
  // return Handlers[action.handler].handle(...results);
}

module.exports = calculate;
