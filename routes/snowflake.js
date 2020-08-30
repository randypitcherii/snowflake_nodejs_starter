const express = require('express');
const snowflake = require('snowflake-sdk');
const util = require('util');

// router with all snowflake handlers
const snowflakeRouter = express.Router();

// validation function for snowflake connection parameters
function validateSnowflakeConnectionParams(account, username, password) {
  if (!account) {
    return { 'status': 'unsuccessful', 'reason': 'invalid account' };
  } else if (!username) {
    return { 'status': 'unsuccessful', 'reason': 'invalid username' };
  } else if (!password) {
    return { 'status': 'unsuccessful', 'reason': 'invalid password' };
  }
}

// snowflake connection wrapper to handle optional parameters
function getSnowflakeConnection(account, username, password, role, warehouse) {
  // add required params
  let connParams = {
    account: account,
    username: username,
    password: password
  };

  // add optional params
  if (role) {
    connParams.role = role;
  }
  if (warehouse) {
    connParams.warehouse = warehouse;
  }

  // return connection
  const sfConn = snowflake.createConnection(connParams);
  return sfConn;
}

/**
 * Async wrapper for executing snowflake queries
 * 
 * Code provided from example in snowflake sdk github issue below:
 *  https://github.com/snowflakedb/snowflake-connector-nodejs/issues/3
 */
async function executeSnowflakeQuery(sfConn, options) {
  return new Promise((resolve, reject) => {
    sfConn.execute({
      ...options,
      complete: function(err, stmt, rows) {
        if (err) {
          reject(err)
        } else {
          resolve({stmt, rows})
        }
      }
    })
  });
}

/**
 * POST handler for creating a new query.
 */
snowflakeRouter.post('/query', async function (req, res) {
  // get body params
  const account   = req.body.account; 
  const username  = req.body.username; 
  const password  = req.body.password;
  const role      = req.body.role; // not required
  const warehouse = req.body.warehouse; // not required
  const query     = req.body.query;

  // validate config
  const configValidation = validateSnowflakeConnectionParams(account, username, password);
  if (configValidation) {
    res.send(configValidation);
    return;
  }
  
  // validate query text
  const queryValidation = query ? null : {'status': 'unsuccessful', 'reason': 'A query must be provided'};
  if (queryValidation) {
    res.send(queryValidation);
    return;
  }
  
  // Connect
  const sfConn = getSnowflakeConnection(account, username, password, role, warehouse);

  // Execute query
  let queryResponse = null;
  try {
    await util.promisify(sfConn.connect)();
    queryResponse = await executeSnowflakeQuery(sfConn, {sqlText: query});
  } catch (err) {
    const errMsg = "Error executing Snowflake query: " + err.message;
    console.error(errMsg);
    res.send({'status': 'unsuccessful', 'reason': errMsg});
    return;
  }

  // return response and status
  res.send({ 'status': 'successful', 'response': queryResponse });
});

module.exports = snowflakeRouter;