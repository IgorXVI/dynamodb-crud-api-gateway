const { CustomerService } = require("../../../dist/services/CustomerService")

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
        })

        const result = await customerService.create(correctBody)

        expect(result).toEqual({
            success: true,
            data: {
                id: "123",
            },
        })
    })
})
