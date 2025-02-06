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

        const result = await customerService.create(correctBody)

        expect(result).toEqual({
            success: true,
            data: {
                id: "123",
            },
        })
    })

    test("should not create a new user when there is no main email", async () => {
        const customerService = new CustomerService({
            create: async () => "123",
        } as any)

        correctBody.emailAddresses[0].isMain = false

        const result = await customerService.create(correctBody)

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

        const result = await customerService.create(correctBody)

        expect(result.success).toEqual(false)
        expect(result.errorMessage).toEqual("Must have one main email.")
        expect((result.details as any)?.count).toEqual(2)
    })

    test("should not create a new user when birthday is in the future", async () => {
        const customerService = new CustomerService({
            create: async () => "123",
        } as any)

        correctBody.birthday = "2100-01-01"

        const result = await customerService.create(correctBody)

        expect(result.success).toEqual(false)
        expect(result.errorMessage).toEqual("Bithday date must be in the past.")
        expect((result.details as any)?.value).toEqual("2100-01-01")
    })

    test("should not create a new user when birthday is too old", async () => {
        const customerService = new CustomerService({
            create: async () => "123",
        } as any)

        correctBody.birthday = "1899-01-01"

        const result = await customerService.create(correctBody)

        expect(result.success).toEqual(false)
        expect(result.errorMessage).toEqual("Bithday date is too old.")
        expect((result.details as any)?.value).toEqual("1899-01-01")
    })
})
