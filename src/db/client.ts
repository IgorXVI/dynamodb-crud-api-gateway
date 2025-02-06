import { DynamoDBClient } from "@aws-sdk/client-dynamodb"

export const dbClient = new DynamoDBClient({ endpoint: process.env.IS_OFFLINE ? "http://localhost:8000" : undefined })
