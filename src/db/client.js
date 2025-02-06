const { DynamoDBClient } = require("@aws-sdk/client-dynamodb")

const client = new DynamoDBClient({ endpoint: process.env.IS_OFFLINE ? "http://localhost:8000" : undefined })

module.exports = client
