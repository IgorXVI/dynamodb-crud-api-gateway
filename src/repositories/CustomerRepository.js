const { v4: uuidv4 } = require("uuid")
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb")
const { PutItemCommand, ScanCommand } = require("@aws-sdk/client-dynamodb")

const dbClient = require("../db/client")

class CustomerRepository {
    constructor() {
        this.db = dbClient

        this.create = this.create.bind(this)
        this.getAll = this.getAll.bind(this)
    }

    async create(body) {
        body.id = uuidv4()
        body.active = true

        body.id = uuidv4()
        body.active = true

        const params = {
            TableName: process.env.DDB_TABLE_NAME,
            Item: marshall(body),
        }

        await this.db.send(new PutItemCommand(params))

        console.log("Customer created!")

        return body.id
    }

    async getAll() {
        const params = {
            TableName: process.env.DDB_TABLE_NAME,
        }

        const { Items, Count } = await this.db.send(new ScanCommand(params))

        console.log("Customers scanned!")

        return {
            count: Count,
            items: Items.map(unmarshall),
        }
    }
}

module.exports = { CustomerRepository }
