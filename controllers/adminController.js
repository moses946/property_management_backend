const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
    try {
        const { email, password, name } = req.body;
        
        // Check if the admin already exists
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
          return res.status(400).json({ message: 'Admin already exists' });
        }
        
        // Create a new admin
        const admin = new Admin({ email, password, name });
        await admin.save();
        
        // Create JWT token
        const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        
        res.status(201).json({
          message: 'Admin created successfully!',
          token,
          adminId: admin._id.toString(),
          adminData: {
            id: admin._id.toString(),
            email: admin.email,
            name: admin.name
          }
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
      }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  console.log("login");
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    // Return all required data
    res.status(200).json({
      token,
      adminId: admin._id.toString(),
      adminData: {
        id: admin._id.toString(),
        email: admin.email,
        name: admin.name
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
