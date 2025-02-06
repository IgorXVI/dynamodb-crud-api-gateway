import { CustomerService } from "../services/CustomerService"

export class CustomerController {
    constructor(private customerService: CustomerService) {
        this.customerService = customerService
    }

    handleError(e: unknown) {
        console.error(e)

        const body = JSON.stringify({
            success: false,
            errorMessage: e instanceof Error && e.message ? e.message : "Error has no message!",
        })

        return {
            statusCode: 500,
            body,
        }
    }

    async create(event: { body: string }) {
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

    async update(event: { body: string; pathParameters: { id: string } }) {
        try {
            const id = event.pathParameters.id
            const body = JSON.parse(event.body)

            const result = await this.customerService.update(id, body)

            const statusCode = result.success ? 200 : result.errorMessage === "Customer not found." ? 404 : 400

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

    async getOne(event: { pathParameters: { id: string } }) {
        try {
            const id = event.pathParameters.id

            const result = await this.customerService.getOne(id)

            return {
                statusCode: result.errorMessage && result.errorMessage === "Customer not found." ? 404 : 200,
                body: JSON.stringify(result),
            }
        } catch (e) {
            return this.handleError(e)
        }
    }

    async deleteOne(event: { pathParameters: { id: string } }) {
        try {
            const id = event.pathParameters.id

            const result = await this.customerService.deleteOne(id)

            return {
                statusCode: result.errorMessage && result.errorMessage === "Customer not found." ? 404 : 200,
                body: JSON.stringify(result),
            }
        } catch (e) {
            return this.handleError(e)
        }
    }
}
