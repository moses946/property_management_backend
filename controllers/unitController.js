const Unit = require('../models/Unit');
const Building = require('../models/Building');

exports.createUnit = async (req, res) => {
  const {
    unitName, floorNumber, building, rent,
    waterUnitsConsumed, costOfWater, garbageFee, status, type
  } = req.body;

  try {
    const buildingExists = await Building.findById(building);
    if (!buildingExists) {
      return res.status(400).json({ error: 'Invalid building ID' });
    }

    const newUnit = new Unit({
      unitName,
      floorNumber,
      building,
      rent,
      waterUnitsConsumed,
      costOfWater,
      garbageFee,
      status,
      type
    });

    await newUnit.save();
    
    // const populatedUnit = await Unit.findById(newUnit._id).populate('building');
    res.status(201).json({ message: 'Unit created', unit: newUnit });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: `Validation error: ${error.message}` });
    }
    res.status(500).json({ error: `Error creating unit: ${error.message}` });
  }
};

exports.getUnitsByBuilding = async (req, res) => {
  const { buildingId } = req.params;
  try {
    const units = await Unit.find({ building: buildingId });
    res.status(200).json(units);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving units' });
  }
};

exports.getUnitById = async (req, res) => {
  try {
    const unit = await Unit.findById(req.params.id).populate('building');
    if (!unit) {
      return res.status(404).json({ error: 'Unit not found' });
    }
    res.status(200).json(unit);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving unit' });
  }
};

exports.updateUnit = async (req, res) => {
  const { id } = req.params;
  const {
    unitName, floorNumber, rent,
    waterUnitsConsumed, costOfWater, garbageFee, status, type
  } = req.body;

  try {
    const unit = await Unit.findByIdAndUpdate(
      id,
      {
        unitName,
        floorNumber,
        rent,
        waterUnitsConsumed,
        costOfWater,
        garbageFee,
        status,
        type
      },
      { new: true, runValidators: true }
    );

    if (!unit) {
      return res.status(404).json({ error: 'Unit not found' });
    }

    // Format the response to match the frontend model
    const formattedUnit = {
      _id: unit._id,
      unitName: unit.unitName,
      floorNumber: unit.floorNumber,
      building: unit.building.toString(), // Convert ObjectId to string
      rent: unit.rent,
      waterUnitsConsumed: unit.waterUnitsConsumed,
      costOfWater: unit.costOfWater,
      garbageFee: unit.garbageFee,
      status: unit.status,
      type: unit.type
    };

    res.status(200).json({ message: 'Unit updated', unit: formattedUnit });
  } catch (error) {
    res.status(500).json({ error: 'Error updating unit' });
  }
};

exports.deleteUnit = async (req, res) => {
  const { id } = req.params;
  
  try {
    const unit = await Unit.findByIdAndDelete(id);
    
    if (!unit) {
      return res.status(404).json({ error: 'Unit not found' });
    }

    res.status(200).json({ message: 'Unit deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting unit' });
  }
};

