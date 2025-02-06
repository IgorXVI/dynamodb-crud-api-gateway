import z from "zod"

import { CustomerRepository } from "../repositories/CustomerRepository"

export class CustomerService {
    private validationSchema = z.object({
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

    constructor(private customerRepository: CustomerRepository) {
        this.customerRepository = customerRepository
    }

    private validateBody(inputBody: unknown) {
        const validationResult = this.validationSchema.safeParse(inputBody)

        if (!validationResult.success) {
            return {
                success: false,
                errorMessage: validationResult.error.issues[0]?.message ?? "Validation failed",
                details: validationResult.error.issues,
            }
        }

        const body = validationResult.data

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

        const mainEmailCount = body.emailAddresses.reduce((acc, e) => (e.isMain ? acc + 1 : acc), 0)
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

        const mainPhoneNumberCount = body.phoneNumbers.reduce((acc, e) => (e.isMain ? acc + 1 : acc), 0)
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

        return {
            success: true,
            data: validationResult.data,
        }
    }

    async create(inputBody: unknown) {
        const validationResult = this.validateBody(inputBody)

        if (!validationResult.success) {
            return validationResult
        }

        const id = await this.customerRepository.create(validationResult.data)

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

    async update(id: string, inputBody: unknown) {
        const validationResult = this.validateBody(inputBody)

        if (!validationResult.success) {
            return validationResult
        }

        const data = await this.customerRepository.update(id, validationResult.data)

        if (data === null) {
            return {
                success: false,
                errorMessage: "Customer not found.",
                details: {
                    id,
                },
            }
        }

        return {
            success: true,
            data,
        }
    }

    async getOne(id: string) {
        const data = await this.customerRepository.getOne(id)

        if (!data) {
            return {
                success: false,
                errorMessage: "Customer not found.",
                details: {
                    id,
                },
            }
        }

        return {
            success: true,
            data,
        }
    }

    async deleteOne(id: string) {
        const data = await this.customerRepository.softDeleteOne(id)

        if (data === null) {
            return {
                success: false,
                errorMessage: "Customer not found.",
                details: {
                    id,
                },
            }
        }

        return {
            success: true,
            data,
        }
    }
}
