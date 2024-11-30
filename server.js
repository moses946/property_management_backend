const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');

// middleware imports
const refreshTokenMiddleware = require("./middleware/refreshTokenAuth")
const authMiddleware = require("./middleware/auth")
// route imports
const buildingRoutes = require('./routes/buildingRoutes');
const unitRoutes = require('./routes/unitRoutes');
const tenantRoutes = require('./routes/tenantRoutes');
const tenantLedgerRoutes = require('./routes/tenantLedgerRoutes');
const adminRoutes = require('./routes/adminRoutes');
const tokenRoutes = require("./routes/tokenRoutes")
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;


// protected routes: routes that should enforce authentication
const PROTECTED_ROUTES = [
  '/api/token/refresh',
  '/api/admin',
  '/api/buildings',
  '/api/units',
  '/api/tenants',
  '/api/tenantLedger',
]

// middlewares: Order of declaration of middleware matters
app.use(express.json());
app.use(cors());
app.use(PROTECTED_ROUTES, authMiddleware.checkTokenValidity)
app.use("/api/token/refresh", refreshTokenMiddleware.checkIfBlacklist)

// MongoDB connection
mongoose.connect(process.env.DB_URI, {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('Failed to connect to MongoDB:', err));

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/buildings', buildingRoutes);
app.use('/api/units', unitRoutes);
app.use('/api/tenants', tenantRoutes);
app.use('/api/tenantLedger', tenantLedgerRoutes);
app.use('/api/token', tokenRoutes)

const jwt = require("jsonwebtoken")
app.get("/test", (req, res)=>{
  const testToken = jwt.sign({test:"oi"}, process.env.JWT_SECRET, {expiresIn:"1h"})
  res.status(200).json({testToken})

})
app.post("/test", (req, res)=>{
  const token = req.body.token
  try{

    var verify = jwt.verify(token, process.env.JWT_SECRET)
  }catch(e){
    res.status(401).json({message:"unauthorized"})
    return
  }
  console.log(verify)
  res.status(200).json("hazar!")
})
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
