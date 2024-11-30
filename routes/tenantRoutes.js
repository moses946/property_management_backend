// routes/tenantRoutes.js

const express = require('express');
const tenantController = require('../controllers/tenantController');
const adminAuth = require('../middleware/adminAuth');
const tenantIssueController = require('../controllers/tenantIssueController')
const router = express.Router();

// Public route for tenant login
router.post('/login', tenantController.loginTenant);

// Admin-only routes
router.use(adminAuth);  // Apply adminAuth middleware to all routes below
router.post('/register', tenantController.registerTenant);
router.get('/building/:buildingId', tenantController.getBuildingTenants);
router.get('/:id', tenantController.getTenant);
router.put('/:id', tenantController.updateTenant);
router.delete('/:id', tenantController.deleteTenant);


// tenant routes
// router.get('/:id/issues', tenantIssueController.getTenantIssues)

module.exports = router;
