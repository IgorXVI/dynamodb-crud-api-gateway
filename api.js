const { CustomerRepository } = require("./dist/repositories/CustomerRepository")
const { CustomerService } = require("./dist/services/CustomerService")
const { CustomerController } = require("./dist/controllers/CustomerController")

const customerRepository = new CustomerRepository()
const customerService = new CustomerService(customerRepository)
const customerController = new CustomerController(customerService)

module.exports = {
    createCustomer: customerController.create.bind(customerController),
    getAllCustomers: customerController.getAll.bind(customerController),
    updateCustomer: customerController.update.bind(customerController),
    deleteCustomer: customerController.deleteOne.bind(customerController),
    getOneCustomer: customerController.getOne.bind(customerController),
}
