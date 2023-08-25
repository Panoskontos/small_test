const Role = require('./role')
const { dbClient, TableNames } = require("../common/db");
const Handler = require("../handlers/index");

class Action {
  id;
  parentActionId;
  role;
  handler;

  constructor({id, parentRule, role, handler}) {
    this.id = id;
    this.parentRule = parentRule;
    this.role = Role.from(role);
    this.handler = Handler.from(handler);
  }

  static async getById(id) {
    const res = (await dbClient.get({ TableName: TableNames.AuthRule, Key: { pk: id } }).promise())
      .Item;

    if (!res.Item) {
      throw new Error("Action does not exist");
    }

    return new Action(res.Item);
  }

  async getParentAction() {
    const res = (
      await dbClient.get({ TableName: TableNames.Action, Key: { pk: this.parentRuleId } }).promise()
    ).Item;

    if (!res.Item) {
      throw new Error("Rule does not exist");
    }

    return new Action(res.Item);
  }

  async getChildActions() {
    const scanResults = await dbClient.scan({ TableName: TableNames.actions }).promise();
    const childActions = scanResults.Items.filter(item => item.parentActionId === this.id);
    
    if (childActions.length === 0) {
        console.log("Child Action does not exist");
        return []
    }

    return childActions.map((item) => new Action(item));
}

}

module.exports = Action;
