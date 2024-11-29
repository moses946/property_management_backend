const jwt = require('jsonwebtoken');
const Tenant = require('../models/Tenant');

const tenantAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.tenantId) {
      return res.status(403).json({ error: 'Tenant access required' });
    }

    const tenant = await Tenant.findById(decoded.tenantId);
    if (!tenant) {
      throw new Error();
    }

    req.tenant = tenant;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Please authenticate as tenant' });
  }
};

module.exports = tenantAuth; 