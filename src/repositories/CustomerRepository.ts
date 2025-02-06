import { v4 as uuidv4 } from "uuid"
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb"
import { PutItemCommand, ScanCommand } from "@aws-sdk/client-dynamodb"
import { DynamoDBClient } from "@aws-sdk/client-dynamodb"

import { dbClient } from "../db/client"

export class CustomerRepository {
    private db: DynamoDBClient

    constructor() {
        this.db = dbClient
    }

    async create(body: any) {
        const id = uuidv4()

        body.id = id
        body.active = true

        const params = {
            TableName: process.env.DDB_TABLE_NAME,
            Item: marshall(body),
        }

        await this.db.send(new PutItemCommand(params))

        console.log("Customer created!")

        return id
    }

    async getAll() {
        const params = {
            TableName: process.env.DDB_TABLE_NAME,
        }

        const { Items, Count } = await this.db.send(new ScanCommand(params))

        console.log("Customers scanned!")

        return {
            count: Count,
            items: Items?.map((item) => unmarshall(item)),
        }
    }
}
