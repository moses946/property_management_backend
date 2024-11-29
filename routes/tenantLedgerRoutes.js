// routes/tenantLedgerRoutes.js

const express = require('express');
const tenantLedgerController = require('../controllers/tenantLedgerController');
const adminAuth = require('../middleware/adminAuth');
const router = express.Router();

router.use(adminAuth);  // Apply adminAuth middleware to all routes

router.post('/:tenantId/transaction', tenantLedgerController.addTransaction);
router.get('/:tenantId', tenantLedgerController.getTenantLedger);
router.delete('/:tenantId/transaction/:transactionId', tenantLedgerController.deleteTransaction);

module.exports = router;
