const User = require("./models/user");
const Action = require("./models/action");
const Role = require("./models/role");
const { dbClient, TableNames } = require("./common/db");

async function getById(id) {
  const result = await dbClient.get({
      TableName: TableNames.users,
      Key: { pk: id }
  }).promise();
  return result.Item;
}

const ROLE_HIERARCHY = [
  Role.SYS_ADMIN,
  Role.LOCAL_ADMIN,
  Role.ENTERPRISE_USER,
  Role.BASIC_USER
];

// Check authorization based on role hierarchy
function canPerformAction(userRole, requiredRole) {
  const userRoleIndex = ROLE_HIERARCHY.indexOf(userRole);
  const requiredRoleIndex = ROLE_HIERARCHY.indexOf(requiredRole);
  
  // If either role isn't found, or the user's role is of a lower privilege than required
  if (userRoleIndex === -1 || requiredRoleIndex === -1 || userRoleIndex > requiredRoleIndex) {
    return false;
  }
  return true;
}

async function getByActionId(id) {
  const result = await dbClient.get({
      TableName: "actions",
      Key: { pk: id }
  }).promise();
  return result.Item;
}


async function authorize(event) {
  const userId = event.Headers && (event.Headers.userid || event.Headers.userId || event.Headers.UserID);

  const body = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
const actionId = body.actionid;


const test_user = await getById(userId);
const user = new User({id:test_user.pk, role:test_user.role})


const test_action = await getByActionId(actionId);
const action = new Action({id:test_action.pk, parentRule:test_action.parentRule, role:test_action.ROLE, handler:test_action.handler})

// Check authorization based on role hierarchy
// Use the function in your authorization logic
if (!canPerformAction(user.role, action.role)) {
  return false;
}
return true;
}

module.exports = authorize;
