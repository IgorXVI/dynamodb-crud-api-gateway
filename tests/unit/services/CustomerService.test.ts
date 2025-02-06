import { CustomerService } from "../../../src/services/CustomerService"

const correctBody = {
    fullName: "Mickey Mouse",
    birthday: "1999-05-19",
    active: true,
    addresses: [
        {
            postalCode: "99700114",
            state: "RS",
            city: "Erechim",
            neighborhood: "Centro",
            street: "Avenida Pedro Pinto de Souza",
            streetNumber: 199,
            complement: "Perto da agencia do mercado livre.",
        },
    ],
    emailAddresses: [
        {
            isMain: true,
            email: "inazumaseleven04@gmaill.com",
        },
        {
            isMain: false,
            email: "igoralmeida@gmail.com",
        },
    ],
    phoneNumbers: [
        {
            isMain: false,
            phoneNumber: "+55 54 9985-6043",
        },
        {
            isMain: true,
            phoneNumber: "+55 54 9975-6043",
        },
    ],
}

describe("CustomerService tests", () => {
    test("should create a new user", async () => {
        const customerService = new CustomerService({
            create: async () => "123",
        } as any)

        const result: any = await customerService.create(correctBody)

        expect(result).toEqual({
            success: true,
            data: {
                id: "123",
            },
        })
    })

    test("should return validation error", async () => {
        const customerService = new CustomerService({
            create: async () => "123",
        } as any)

        correctBody.fullName = 12345 as any

        const result: any = await customerService.create(correctBody)

        correctBody.fullName = "Mickey Mouse"

        expect(result.success).toEqual(false)
        expect(result.errorMessage).toEqual("Expected string, received number")
        expect(result.details as any).toEqual([
            {
                code: "invalid_type",
                expected: "string",
                message: "Expected string, received number",
                path: ["fullName"],
                received: "number",
            },
        ])
    })

    test("should not create a new user when there is no main email", async () => {
        const customerService = new CustomerService({
            create: async () => "123",
        } as any)

        correctBody.emailAddresses[0].isMain = false

        const result: any = await customerService.create(correctBody)

        expect(result.success).toEqual(false)
        expect(result.errorMessage).toEqual("Must have one main email.")
        expect((result.details as any)?.count).toEqual(0)
    })

    test("should not create a new user when there is too many main emails", async () => {
        const customerService = new CustomerService({
            create: async () => "123",
        } as any)

        correctBody.emailAddresses[0].isMain = true
        correctBody.emailAddresses[1].isMain = true

        const result: any = await customerService.create(correctBody)

        correctBody.emailAddresses[0].isMain = true
        correctBody.emailAddresses[1].isMain = false

        expect(result.success).toEqual(false)
        expect(result.errorMessage).toEqual("Must have one main email.")
        expect((result.details as any)?.count).toEqual(2)
    })

    test("should not create a new user when there is no main phone number", async () => {
        const customerService = new CustomerService({
            create: async () => "123",
        } as any)

        correctBody.phoneNumbers[1].isMain = false

        const result: any = await customerService.create(correctBody)

        expect(result.success).toEqual(false)
        expect(result.errorMessage).toEqual("Must have one main phone number.")
        expect((result.details as any)?.count).toEqual(0)
    })

    test("should not create a new user when there is too many main phone numbers", async () => {
        const customerService = new CustomerService({
            create: async () => "123",
        } as any)

        correctBody.phoneNumbers[0].isMain = true
        correctBody.phoneNumbers[1].isMain = true

        const result: any = await customerService.create(correctBody)

        correctBody.phoneNumbers[0].isMain = true
        correctBody.phoneNumbers[1].isMain = false

        expect(result.success).toEqual(false)
        expect(result.errorMessage).toEqual("Must have one main phone number.")
        expect((result.details as any)?.count).toEqual(2)
    })

    test("should not create a new user when birthday is in the future", async () => {
        const customerService = new CustomerService({
            create: async () => "123",
        } as any)

        correctBody.birthday = "2100-01-01"

        const result: any = await customerService.create(correctBody)

        expect(result.success).toEqual(false)
        expect(result.errorMessage).toEqual("Bithday date must be in the past.")
        expect((result.details as any)?.value).toEqual("2100-01-01")
    })

    test("should not create a new user when birthday is too old", async () => {
        const customerService = new CustomerService({
            create: async () => "123",
        } as any)

        correctBody.birthday = "1899-01-01"

        const result: any = await customerService.create(correctBody)

        correctBody.birthday = "1999-01-01"

        expect(result.success).toEqual(false)
        expect(result.errorMessage).toEqual("Bithday date is too old.")
        expect((result.details as any)?.value).toEqual("1899-01-01")
    })

    test("should get all users", async () => {
        const customerService = new CustomerService({
            getAll: async () => [1, 2, 3, 4, 5],
        } as any)

        const result: any = await customerService.getAll()

        expect(result).toEqual({
            success: true,
            data: [1, 2, 3, 4, 5],
        })
    })

    test("should get one user", async () => {
        const customerService = new CustomerService({
            getOne: async (id: string) => "user " + id,
        } as any)

        const result: any = await customerService.getOne("123")

        expect(result).toEqual({
            success: true,
            data: "user 123",
        })
    })

    test("should get one non existing user", async () => {
        const customerService = new CustomerService({
            getOne: async () => null,
        } as any)

        const result: any = await customerService.getOne("123")

        expect(result.success).toEqual(false)
        expect(result.errorMessage).toEqual("Customer not found.")
        expect((result.details as any)?.id).toEqual("123")
    })

    test("should delete one user", async () => {
        const customerService = new CustomerService({
            softDeleteOne: async () => null,
        } as any)

        const result: any = await customerService.deleteOne("123")

        expect(result).toEqual({
            success: true,
        })
    })

    test("should update a user", async () => {
        const customerService = new CustomerService({
            update: async () => null,
        } as any)

        const result: any = await customerService.update("123", correctBody)

        expect(result).toEqual({
            success: true,
        })
    })

    test("should return validation error on update", async () => {
        const customerService = new CustomerService({
            update: async () => null,
        } as any)

        correctBody.fullName = 12345 as any

        const result: any = await customerService.update("123", correctBody)

        correctBody.fullName = "Mickey Mouse"

        expect(result.success).toEqual(false)
        expect(result.errorMessage).toEqual("Expected string, received number")
        expect(result.details as any).toEqual([
            {
                code: "invalid_type",
                expected: "string",
                message: "Expected string, received number",
                path: ["fullName"],
                received: "number",
            },
        ])
    })
})
