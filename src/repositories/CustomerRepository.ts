import { v4 as uuidv4 } from "uuid"
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb"
import { GetItemCommand, PutItemCommand, ScanCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb"
import { DynamoDBClient } from "@aws-sdk/client-dynamodb"

import { dbClient } from "../db/client"

export class CustomerRepository {
    private db: DynamoDBClient

    constructor() {
        this.db = dbClient
    }

    async update(id: string, body: any) {
        const objKeys = Object.keys(body)
        const params = {
            TableName: process.env.DDB_TABLE_NAME,
            Key: marshall({ id }),
            UpdateExpression: `SET ${objKeys.map((_, index) => `#key${index} = :value${index}`).join(", ")}`,
            ExpressionAttributeNames: objKeys.reduce(
                (acc, key, index) => ({
                    ...acc,
                    [`#key${index}`]: key,
                }),
                {}
            ),
            ExpressionAttributeValues: marshall(
                objKeys.reduce(
                    (acc, key, index) => ({
                        ...acc,
                        [`:value${index}`]: body[key],
                    }),
                    {}
                )
            ),
        }

        await this.db.send(new UpdateItemCommand(params))

        console.log("Customer updated!")
    }

    async softDeleteOne(id: string) {
        await this.update(id, {
            active: false,
        })

        console.log("Customer marked as innactive!")
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

    async getOne(id: string) {
        const params = {
            TableName: process.env.DDB_TABLE_NAME,
            Key: marshall({ id }),
        }

        const { Item } = await this.db.send(new GetItemCommand(params))

        const result = Item ? unmarshall(Item) : null

        console.log("Customer was fetched!")

        return result && !result.active ? null : result
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
