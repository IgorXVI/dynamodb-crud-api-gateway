const { CustomerRepository } = require("./src/repositories/CustomerRepository")
const { CustomerService } = require("./src/services/CustomerService")

const customerRepository = new CustomerRepository()
const customerService = new CustomerService(customerRepository)

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
        })

        return errorResponse
    }
}

const createCustomer = errorHandlingWrapper(async (event) => {
    const body = JSON.parse(event.body)

    const result = await customerService.create(body)

    const statusCode = result.success ? 201 : 400

    return {
        statusCode,
        body: JSON.stringify(result),
    }
})

const getAllCustomers = errorHandlingWrapper(async () => {
    const result = await customerService.getAll()

    return {
        statusCode: 200,
        body: JSON.stringify(result),
    }
})

module.exports = {
    createCustomer,
    getAllCustomers,
}
