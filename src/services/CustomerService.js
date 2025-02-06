const z = require("zod")

class CustomerService {
    constructor(customerRepository) {
        this.customerRepository = customerRepository

        this.validationSchema = z.object({
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

        this.create = this.create.bind(this)
        this.getAll = this.getAll.bind(this)
    }

    async create(body) {
        const validationResult = this.validationSchema.safeParse(body)

        if (!validationResult.success) {
            return {
                success: false,
                errorMessage: validationResult.error.issues[0]?.message ?? "Validation failed",
                details: validationResult.error.issues,
            }
        }

        const today = new Date()
        const past = new Date("01-01-1899")
        const birthdayDate = new Date(body.birthday)

        if (birthdayDate.getTime() < past.getTime()) {
            return {
                success: false,
                errorMessage: "Bithday date is too old.",
                details: {
                    value: body.birthday,
                },
            }
        }

        if (today.getTime() < birthdayDate.getTime()) {
            return {
                success: false,
                errorMessage: "Bithday date must be in the past.",
                details: {
                    value: body.birthday,
                },
            }
        }

        const countMains = (arr = []) => arr.reduce((acc, e) => (e.isMain ? acc + 1 : acc), 0)

        const mainEmailCount = countMains(body.emailAddresses)
        if (mainEmailCount !== 1) {
            return {
                success: false,
                errorMessage: "Must have one main email.",
                details: {
                    value: body.emailAddresses,
                    count: mainEmailCount,
                },
            }
        }

        const mainPhoneNumberCount = countMains(body.phoneNumbers)
        if (mainPhoneNumberCount !== 1) {
            return {
                success: false,
                errorMessage: "Must have one main phone number.",
                details: {
                    value: body.phoneNumbers,
                    count: mainPhoneNumberCount,
                },
            }
        }

        const id = await this.customerRepository.create(body)

        return {
            success: true,
            data: {
                id,
            },
        }
    }

    async getAll() {
        const data = await this.customerRepository.getAll()

        return {
            success: true,
            data,
        }
    }
}

module.exports = { CustomerService }
