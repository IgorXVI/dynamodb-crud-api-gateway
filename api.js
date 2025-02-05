const db = require("./db")

const { PutItemCommand, ScanCommand } = require("@aws-sdk/client-dynamodb")

const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb")

const z = require("zod")

const { v4: uuidv4 } = require("uuid")

const errorHandlingWrapper = (fun) => async (event) => {
    try {
        const normalResponse = await fun(event)
        return normalResponse
    } catch (e) {
        console.error(e)

        const errorResponse = {}

        errorResponse.statusCode = 500

        errorResponse.body = JSON.stringify({
            success: false,
            errorMessage: e.message ? e.message : "Error has no message!",
            errorStack: e.stack ? e.stack : "Error has no stack!",
        })

        return errorResponse
    }
}

const makeValidationErrorResponse = (errorMessage, details) => ({
    statusCode: 400,
    body: JSON.stringify({
        success: false,
        errorMessage,
        details,
    }),
})

const customerValidationSchema = z.object({
    fullName: z.string().max(1000),
    birthday: z.string().date(),
    addresses: z
        .array(
            z.object({
                postalCode: z.string().max(8),
                state: z.string().max(2),
                city: z.string().max(1000),
                neighborhood: z.string().max(1000),
                street: z.string().max(1000),
                streetNumber: z.number().min(1),
                complement: z.string().max(1000).optional(),
            })
        )
        .nonempty(),
    emailAddresses: z
        .array(
            z.object({
                email: z.string().email(),
                isMain: z.boolean(),
            })
        )
        .nonempty(),
    phoneNumbers: z
        .array(
            z.object({
                phoneNumber: z.string().max(1000),
                isMain: z.boolean(),
            })
        )
        .nonempty(),
})

const today = new Date()
const past = new Date("01-01-1899")

const createCustomer = errorHandlingWrapper(async (event) => {
    const body = JSON.parse(event.body)

    const validationResult = customerValidationSchema.safeParse(body)

    if (!validationResult.success) {
        return makeValidationErrorResponse(
            validationResult.error.issues[0]?.message ?? "Validation failed",
            validationResult.error.issues
        )
    }

    const birthdayDate = new Date(body.birthday)

    if (birthdayDate.getTime() < past.getTime()) {
        return makeValidationErrorResponse("Bithday date is too old.", { value: body.birthday })
    }

    if (today.getTime() < birthdayDate.getTime()) {
        return makeValidationErrorResponse("Bithday date must be in the past.", { value: body.birthday })
    }

    const countMains = (arr = []) => arr.reduce((acc, e) => (e.isMain ? acc + 1 : acc), 0)

    const mainEmailCount = countMains(body.emailAddresses)
    if (mainEmailCount !== 1) {
        return makeValidationErrorResponse("Must have one main email.", {
            value: body.emailAddresses,
            count: mainEmailCount,
        })
    }

    const mainPhoneNumberCount = countMains(body.phoneNumbers)
    if (mainPhoneNumberCount !== 1) {
        return makeValidationErrorResponse("Must have one main phone number.", {
            value: body.phoneNumbers,
            count: mainPhoneNumberCount,
        })
    }

    body.id = uuidv4()
    body.active = true

    const params = {
        TableName: process.env.DDB_TABLE_NAME,
        Item: marshall(body),
    }

    await db.send(new PutItemCommand(params))

    console.log("Customer created!")

    return {
        statusCode: 200,
        body: JSON.stringify({
            success: true,
            id: body.id,
        }),
    }
})

const getAllCustomers = errorHandlingWrapper(async () => {
    const params = {
        TableName: process.env.DDB_TABLE_NAME,
    }

    const { Items, Count } = await db.send(new ScanCommand(params))

    console.log("Customers scanned!")

    return {
        statusCode: 200,
        body: JSON.stringify({
            success: true,
            data: {
                count: Count,
                items: Items.map(unmarshall),
            },
        }),
    }
})

module.exports = {
    createCustomer,
    getAllCustomers,
}
