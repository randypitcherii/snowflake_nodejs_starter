# Snowflake NodeJS Starter
A starter repository for NodeJS projects using the Snowflake sdk for Node.

## Running the Server
To run the server, you can either run `make` to use the `Makefile` instructions or do the following:
1. Install dependencies with `npm i`
2. Start the server with `node app.js`

## Submitting Queries
To submit a POST query, submit a raw JSON post request with the following header parameter:

```Content-Type:application/json```

Your raw JSON POST body should look like the following:
```json
{
    "username": "snowflake_username",
    "password": "my cool snowflake password",
    "account": "Snowflake account - basically everything after 'https://' and before '.snowflakecomputing.com' in the url of your snowflake account login page",
    "query": "SELECT * FROM MY_DB.MY_SCHEMA.MY_TABLE"
}
```

Optionally, you can also include a `warehouse` and `role` field in your json, but your default warehouse and role will be used if you omit these values.