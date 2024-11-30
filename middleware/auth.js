const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Tenant = require('../models/Tenant');

exports.verifyToken = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if(!token) return res.status(401).json({message:"Unauthorized"})
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

// a general auth middleware for protected routes to check is a valid token is provided
exports.checkTokenValidity = async (req, res, next) => {
      console.log("Hit the main auth middleware")
      // check if token is provided; authorization headers set correctly
      const accessToken = req.headers['authorization']?.split(" ")[1]
      if(!accessToken){
        res.status(401).json()
        
      }else{
        // check validity of the token
        try{
          // if the token is expired or not real, the function throws an error
          const decodedToken =  jwt.verify(accessToken, proces.env.JWT_SECRET)
          req.user.isAuthenticated = true
          next()
        }catch(e){
          console.log(`Error in general auth middleware: ${e}`)
          res.status(401).json()          
        }
      }

}