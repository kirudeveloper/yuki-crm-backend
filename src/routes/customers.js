const express = require('express');
const router = express.Router();
const CustomerController = require('../controllers/customerController');
const { customerCreateValidationRules, customerValidationRules } = require('../middleware/validation');
const authMiddleware = require('../middleware/auth');

// All customer routes require authentication
router.use(authMiddleware);

// Create controller instance
const customerController = new CustomerController();

// Customer routes
router.post('/', 
  customerCreateValidationRules(), 
  customerController.createCustomer.bind(customerController)
);

router.get('/', 
  customerController.getAllCustomers.bind(customerController)
);

router.get('/search', 
  customerController.searchCustomers.bind(customerController)
);

router.get('/:id', 
  customerController.getCustomerById.bind(customerController)
);

router.put('/:id', 
  customerValidationRules(), 
  customerController.updateCustomer.bind(customerController)
);

router.delete('/:id', 
  customerController.deleteCustomer.bind(customerController)
);

module.exports = router;
