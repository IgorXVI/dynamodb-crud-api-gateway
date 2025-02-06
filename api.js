const { CustomerRepository } = require("./src/repositories/CustomerRepository")
const { CustomerService } = require("./src/services/CustomerService")
const { CustomerController } = require("./src/controllers/CustomerController")

const customerRepository = new CustomerRepository()
const customerService = new CustomerService(customerRepository)
const customerController = new CustomerController(customerService)

module.exports = {
    createCustomer: customerController.create,
    getAllCustomers: customerController.getAll,
}
