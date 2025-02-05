const db = require("./db")

const {
    GetItemCommand,
    PutItemCommand,
    UpdateItemCommand,
    DeleteItemCommand,
    ScanCommand,
} = require("@aws-sdk/client-dynamodb")

const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb")

const getPost = async (event) => {
    const response = { statusCode: 200 }

    try {
        const params = {
            TableName: process.env.DDB_TABLE_NAME,
            Key: marshall({ postId: event.pathParameters.postId }),
        }

        const { Item } = await db.send(new GetItemCommand(params))

        console.log("Item retrieved!")

        response.body = JSON.stringify({
            success: true,
            data: Item ? unmarshall(Item) : null,
            rawData: Item,
        })
    } catch (e) {
        console.error(e)

        response.statusCode = 500

        response.body = JSON.stringify({
            success: false,
            errorMessage: e.message ? e.message : "Error has no message!",
            errorStack: e.stack ? e.stack : "Error has no stack!",
        })
    }

    return response
}

const createPost = async (event) => {
    const response = { statusCode: 200 }

    try {
        const body = JSON.parse(event.body)
        const params = {
            TableName: process.env.DDB_TABLE_NAME,
            Item: marshall(body),
        }

        const createResult = await db.send(new PutItemCommand(params))

        console.log("Item created!")

        response.body = JSON.stringify({
            success: true,
            createResult,
        })
    } catch (e) {
        console.error(e)

        response.statusCode = 500

        response.body = JSON.stringify({
            success: false,
            errorMessage: e.message ? e.message : "Error has no message!",
            errorStack: e.stack ? e.stack : "Error has no stack!",
        })
    }

    return response
}

const updatePost = async (event) => {
    const response = { statusCode: 200 }

    try {
        const body = JSON.parse(event.body)
        const objKeys = Object.keys(body)
        const params = {
            TableName: process.env.DDB_TABLE_NAME,
            Key: marshall({ postId: event.pathParameters.postId }),
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

        const updateResult = await db.send(new UpdateItemCommand(params))

        console.log("Item updated!")

        response.body = JSON.stringify({
            success: true,
            updateResult,
        })
    } catch (e) {
        console.error(e)

        response.statusCode = 500

        response.body = JSON.stringify({
            success: false,
            errorMessage: e.message ? e.message : "Error has no message!",
            errorStack: e.stack ? e.stack : "Error has no stack!",
        })
    }

    return response
}

const deletePost = async (event) => {
    const response = { statusCode: 200 }

    try {
        const params = {
            TableName: process.env.DDB_TABLE_NAME,
            Key: marshall({ postId: event.pathParameters.postId }),
        }

        const deleteResult = await db.send(new DeleteItemCommand(params))

        console.log("Item deleted!")

        response.body = JSON.stringify({
            success: true,
            deleteResult,
        })
    } catch (e) {
        console.error(e)

        response.statusCode = 500

        response.body = JSON.stringify({
            success: false,
            errorMessage: e.message ? e.message : "Error has no message!",
            errorStack: e.stack ? e.stack : "Error has no stack!",
        })
    }

    return response
}

const getAllPost = async (event) => {
    const response = { statusCode: 200 }

    try {
        const params = {
            TableName: process.env.DDB_TABLE_NAME,
        }

        const { Items, Count } = await db.send(new ScanCommand(params))

        console.log("Items scanned!")

        response.body = JSON.stringify({
            success: true,
            data: {
                count: Count,
                items: Items.map(unmarshall),
            },
        })
    } catch (e) {
        console.error(e)

        response.statusCode = 500

        response.body = JSON.stringify({
            success: false,
            errorMessage: e.message ? e.message : "Error has no message!",
            errorStack: e.stack ? e.stack : "Error has no stack!",
        })
    }

    return response
}

module.exports = {
    getPost,
    createPost,
    updatePost,
    deletePost,
    getAllPost,
}
