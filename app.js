var express = require('express');

// import routes
const snowflakeRouter = require('./routes/snowflake');

// create express app
const app = express();
app.use(express.json());

// wire up routes
app.use('/snowflake', snowflakeRouter);

// start server
const port = 3000;
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})