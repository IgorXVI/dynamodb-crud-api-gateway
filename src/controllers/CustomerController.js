class CustomerController {
    constructor(customerService) {
        this.customerService = customerService

        this.handleError = this.handleError.bind(this)
        this.create = this.create.bind(this)
        this.getAll = this.getAll.bind(this)
    }

    handleError(e) {
        console.error(e)

        const errorResponse = {}

        errorResponse.statusCode = 500

        errorResponse.body = JSON.stringify({
            success: false,
            errorMessage: e.message ? e.message : "Error has no message!",
        })

        return errorResponse
    }

    async create(event) {
        try {
            const body = JSON.parse(event.body)

            const result = await this.customerService.create(body)

            const statusCode = result.success ? 201 : 400

            return {
                statusCode,
                body: JSON.stringify(result),
            }
        } catch (e) {
            return this.handleError(e)
        }
    }

    async getAll() {
        try {
            const result = await this.customerService.getAll()

            return {
                statusCode: 200,
                body: JSON.stringify(result),
            }
        } catch (e) {
            return this.handleError(e)
        }
    }
}

module.exports = { CustomerController }
