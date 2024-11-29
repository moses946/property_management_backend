const mongoose = require('mongoose');

const unitSchema = new mongoose.Schema({
  unitName: { type: String, required: true },
  floorNumber: { type: Number, required: true },
  building: { type: mongoose.Schema.Types.ObjectId, ref: 'Building', required: true },
  rent: { type: Number, required: true },
  waterUnitsConsumed: { type: Number, default: 0 },
  costOfWater: { type: Number, default: 0 },
  garbageFee: { type: Number, default: 0 },
  status: { type: String, enum: ['Vacant', 'Occupied'], default: 'Vacant' },
  type: { type: String, required: true },
});

module.exports = mongoose.model('Unit', unitSchema);
