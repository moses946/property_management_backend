const mongoose = require('mongoose');

const buildingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  totalFloors: { type: Number, required: true },
  unitsPerFloor: { type: Number, required: true },
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true } // Reference to the Admin
});

module.exports = mongoose.model('Building', buildingSchema);

