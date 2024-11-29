const Building = require('../models/Building');
const Unit = require('../models/Unit');

exports.createBuilding = async (req, res) => {
  const { name, location, totalFloors, unitsPerFloor, adminId } = req.body; // Accept `adminId` in request
  try {
    const newBuilding = new Building({ name, location, totalFloors, unitsPerFloor, admin: adminId });
    await newBuilding.save();
    res.status(201).json({ message: 'Building created', building: newBuilding });
  } catch (error) {
    res.status(500).json({ error: 'Error creating building' });
  }
};


exports.getBuildings = async (req, res) => {
  try {
    // Get adminId from request query or auth middleware
    const { adminId } = req.query;

    // If adminId is provided, filter buildings by admin
    const query = adminId ? { admin: adminId } : {};
    
    const buildings = await Building.find(query).populate('admin');
    res.status(200).json(buildings);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving buildings' });
  }
};

// Alternative: Separate endpoint for admin's buildings
exports.getBuildingsByAdmin = async (req, res) => {
  try {
    const { adminId } = req.params;
    
    const buildings = await Building.find({ admin: adminId })
      .populate('admin')
      .sort({ createdAt: -1 }); // Optional: sort by creation date

    res.status(200).json(buildings);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving admin buildings' });
  }
};

exports.getBuildingById = async (req, res) => {
    try {
      const building = await Building.findById(req.params.id).populate('admin'); // Populate admin details
      if (!building) return res.status(404).json({ error: 'Building not found' });
      res.status(200).json(building);
    } catch (error) {
      res.status(500).json({ error: 'Error retrieving building' });
    }
  };

exports.updateBuilding = async (req, res) => {
  const { id } = req.params;
  const { name, location, totalFloors, unitsPerFloor } = req.body;
  
  try {
    const building = await Building.findByIdAndUpdate(
      id,
      { name, location, totalFloors, unitsPerFloor },
      { new: true, runValidators: true }
    ).populate('admin');

    if (!building) {
      return res.status(404).json({ error: 'Building not found' });
    }

    res.status(200).json({ message: 'Building updated', building });
  } catch (error) {
    res.status(500).json({ error: 'Error updating building' });
  }
};

exports.deleteBuilding = async (req, res) => {
  const { id } = req.params;
  
  try {
    const building = await Building.findByIdAndDelete(id);
    
    if (!building) {
      return res.status(404).json({ error: 'Building not found' });
    }

    // You might want to also delete all units associated with this building
    await Unit.deleteMany({ building: id });

    res.status(200).json({ message: 'Building and associated units deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting building' });
  }
};
  