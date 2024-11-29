// controllers/tenantLedgerController.js

const TenantLedger = require('../models/TenantLedger');

// Add a transaction (charge or payment) for a tenant
exports.addTransaction = async (req, res) => {
  try {
    const { tenantId } = req.params;
    const { description, amount, type } = req.body;

    // Find tenant ledger
    const ledger = await TenantLedger.findOne({ tenant: tenantId });
    if (!ledger) {
      return res.status(404).json({ message: 'Ledger not found' });
    }

    // Add transaction
    ledger.transactions.push({ description, amount, type });
    ledger.balance = ledger.calculateBalance();
    await ledger.save();

    res.status(200).json({ message: 'Transaction added successfully', ledger });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add transaction' });
  }
};

// Get tenant's ledger with balance and transactions
exports.getTenantLedger = async (req, res) => {
  try {
    const { tenantId } = req.params;

    const ledger = await TenantLedger.findOne({ tenant: tenantId }).populate('tenant');
    if (!ledger) {
      return res.status(404).json({ message: 'Ledger not found' });
    }

    res.status(200).json({ ledger });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve ledger' });
  }
};

// Delete a transaction from the ledger
exports.deleteTransaction = async (req, res) => {
  try {
    const { tenantId, transactionId } = req.params;

    // Find tenant ledger
    const ledger = await TenantLedger.findOne({ tenant: tenantId });
    if (!ledger) {
      return res.status(404).json({ message: 'Ledger not found' });
    }

    // Remove transaction
    ledger.transactions.id(transactionId).remove();
    ledger.calculateBalance();
    await ledger.save();

    res.status(200).json({ message: 'Transaction deleted successfully', ledger });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
};
