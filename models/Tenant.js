const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const tenantSchema = new mongoose.Schema({
    email: {type: String, required: true, unique: true},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    phoneNumber: {type: String, required: true},
    unit: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit', required: true },
    password: {type: String, required: true},
    createdAt: { type: Date, default: Date.now },
    tenancyStatus: { type: String, enum: ['active', 'vacated'], default: 'active' },
})

// Hash the password before saving
tenantSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});
  
// Method to compare password during login
tenantSchema.methods.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('Tenant', tenantSchema);