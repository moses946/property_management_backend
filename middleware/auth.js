const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Tenant = require('../models/Tenant');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if it's an admin token
    if (decoded.adminId) {
      const admin = await Admin.findById(decoded.adminId);
      if (!admin) {
        throw new Error();
      }
      req.admin = admin;
      req.userType = 'admin';
    }
    // Check if it's a tenant token
    else if (decoded.tenantId) {
      const tenant = await Tenant.findById(decoded.tenantId);
      if (!tenant) {
        throw new Error();
      }
      req.tenant = tenant;
      req.userType = 'tenant';
    } else {
      throw new Error();
    }

    next();
  } catch (error) {
    res.status(401).json({ error: 'Please authenticate' });
  }
};

module.exports = auth; 