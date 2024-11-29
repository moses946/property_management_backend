// controllers/tenantController.js

const Tenant = require('../models/Tenant');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const TenantLedger = require("../models/TenantLedger")
const Unit = require("../models/Unit")

// Register a new tenant
exports.registerTenant = async (req, res) => {
    try {
      const { email, firstName, lastName, phoneNumber, unit, password } = req.body;
  
      // Check if tenant with the same email exists
      const existingTenant = await Tenant.findOne({ email });
      if (existingTenant) {
        return res.status(400).json({ message: 'Email already registered' });
      }
  
      // Create and save tenant
      const tenant = new Tenant({ email, firstName, lastName, phoneNumber, unit, password });
      await tenant.save();
  
      // Create an initial ledger for the tenant
      const ledger = new TenantLedger({ tenant: tenant._id });
      await ledger.save();
  
      // Update the unit status to "Occupied"
      const updatedUnit = await Unit.findByIdAndUpdate(unit, { status: 'Occupied' });
      if (!updatedUnit) {
        return res.status(400).json({ message: 'Unit not found or could not be updated' });
      }

      const formattedTenant = await Tenant.findById(tenant._id).populate({
        path: 'unit',
        populate: {
          path: 'building',
          select: 'name address'
        }
      });
  
      res.status(201).json({ message: 'Tenant registered successfully',  formattedTenant });
    } catch (error) {
      res.status(500).json({ error: 'Failed to register tenant' });
      console.log(error);
    }
  };

// Get tenants for a specific building with optional status filter
exports.getBuildingTenants = async (req, res) => {
  try {
    const { buildingId } = req.params;
    const { status } = req.query;
    
    
    // Find all units in the building
    const buildingUnits = await Unit.find({ building: buildingId }).select('_id');
    
    if (buildingUnits.length === 0) {
      return res.status(404).json({ message: 'No units found for this building' });
    }
    
    const unitIds = buildingUnits.map(unit => unit._id);
    
    // Base query requiring units from the specified building
    let query = { unit: { $in: unitIds } };
    
    // Add status filter if provided
    if (status) {
      query.tenancyStatus = status;
    }


    const tenants = await Tenant.find(query)
      .populate({
        path: 'unit',
        populate: {
          path: 'building',
          select: 'name address'
        }
      });


    if (tenants.length === 0) {
      return res.status(404).json({ message: 'No tenants found for this building' });
    }

    res.status(200).json(tenants);
  } catch (error) {
    console.error('Error in getBuildingTenants:', error);
    res.status(500).json({ error: 'Failed to retrieve tenants' });
  }
};

// Get single tenant details
exports.getTenant = async (req, res) => {
  try {
    const tenant = await Tenant.findById(req.params.id).populate('unit');
    if (!tenant) return res.status(404).json({ message: 'Tenant not found' });

    res.status(200).json(tenant);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve tenant' });
  }
};

// Update tenant details
exports.updateTenant = async (req, res) => {
  try {
    const updates = req.body;
    const tenant = await Tenant.findByIdAndUpdate(req.params.id, updates, { new: true });

    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }

    const formattedTenant = await Tenant.findById(tenant._id).populate({
      path: 'unit',
      populate: {
        path: 'building',
        select: 'name address'
      }
    });

    res.status(200).json({ message: 'Tenant updated successfully', tenant: formattedTenant });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update tenant' });
  }
};

// Delete tenant
exports.deleteTenant = async (req, res) => {
  try {
    const tenant = await Tenant.findByIdAndDelete(req.params.id);
    if (!tenant) return res.status(404).json({ message: 'Tenant not found' });

    res.status(200).json({ message: 'Tenant deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete tenant' });
  }
};

// Tenant Login (optional)
exports.loginTenant = async (req, res) => {
  try {
    const { email, password } = req.body;
    const tenant = await Tenant.findOne({ email });

    if (!tenant || !(await tenant.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { tenantId: tenant._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      token,
      tenantId: tenant._id.toString(),
      tenantData: {
        id: tenant._id.toString(),
        email: tenant.email,
        firstName: tenant.firstName,
        lastName: tenant.lastName,
        unit: tenant.unit
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
};
