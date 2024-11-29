// models/TenantLedger.js

const mongoose = require('mongoose');

const tenantLedgerSchema = new mongoose.Schema({
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
  transactions: [
    {
      date: { type: Date, default: Date.now },
      description: { type: String, required: true },
      amount: { type: Number, required: true },
      type: { type: String, enum: ['charge', 'payment'], required: true }, // "charge" or "payment"
    },
  ],
  balance: { type: Number, default: 0 }, // Keeps a running balance
});

// Method to calculate balance based on transactions
tenantLedgerSchema.methods.calculateBalance = function () {
  this.balance = this.transactions.reduce((acc, transaction) => {
    return transaction.type === 'charge' ? acc + transaction.amount : acc - transaction.amount;
  }, 0);
  return this.balance;
};

module.exports = mongoose.model('TenantLedger', tenantLedgerSchema);
