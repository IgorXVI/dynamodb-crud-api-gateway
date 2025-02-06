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
