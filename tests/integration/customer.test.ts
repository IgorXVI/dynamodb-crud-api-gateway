const correctBody = {
    id: "",
    active: true,
    fullName: "Mickey Mouse",
    birthday: "1999-05-19",
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

describe("Customer routes tests", () => {
    test("should create a new customer", async () => {
        const res = await fetch("http://localhost:3000/dev/customer", {
            method: "POST",
            headers: {
                "x-api-key": "d41d8cd98f00b204e9800998ecf8427e",
            },
            body: JSON.stringify(correctBody),
        })

        const resBody = await res.json()

        expect(resBody.success).toEqual(true)
        expect(typeof resBody.data.id).toEqual("string")
        correctBody.id = resBody.data.id
    })

    test("should get all customers", async () => {
        const res = await fetch("http://localhost:3000/dev/customer", {
            method: "GET",
            headers: {
                "x-api-key": "d41d8cd98f00b204e9800998ecf8427e",
            },
        })

        const resBody = await res.json()

        expect(resBody.success).toEqual(true)

        expect(resBody.data.items.find((item: any) => item.id === correctBody.id)).toEqual(correctBody)
    })

    test("should update one costumer", async () => {
        correctBody.fullName = "Igor"

        const res = await fetch(`http://localhost:3000/dev/customer/${correctBody.id}`, {
            method: "PUT",
            body: JSON.stringify(correctBody),
            headers: {
                "x-api-key": "d41d8cd98f00b204e9800998ecf8427e",
            },
        })

        const resBody = await res.json()

        expect(resBody.success).toEqual(true)
    })

    test("should get one costumer", async () => {
        const res = await fetch(`http://localhost:3000/dev/customer/${correctBody.id}`, {
            method: "GET",
            headers: {
                "x-api-key": "d41d8cd98f00b204e9800998ecf8427e",
            },
        })

        const resBody = await res.json()

        expect(resBody.success).toEqual(true)
        expect(resBody.data).toEqual(correctBody)
    })

    test("should delete one costumer", async () => {
        const res = await fetch(`http://localhost:3000/dev/customer/${correctBody.id}`, {
            method: "DELETE",
            headers: {
                "x-api-key": "d41d8cd98f00b204e9800998ecf8427e",
            },
        })

        const resBody = await res.json()

        expect(resBody.success).toEqual(true)
    })

    test("should get one costumer that is innactive and receive a not found error", async () => {
        const res = await fetch(`http://localhost:3000/dev/customer/${correctBody.id}`, {
            method: "GET",
            headers: {
                "x-api-key": "d41d8cd98f00b204e9800998ecf8427e",
            },
        })

        const resBody = await res.json()

        expect(resBody.success).toEqual(false)
        expect(resBody.errorMessage).toEqual("Customer not found.")
    })
})
