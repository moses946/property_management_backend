const Issue = require("../models/Issue");
const jwt = require("jsonwebtoken");
const Unit = require("../models/Unit");
const Tenant = require("../models/Tenant");

// exports.getTenantIssues = async (req, res)=>{
//     // get the user id
//     const user = req.user
//     const unit = await Unit.find({tenant:user})
//     const issues = await Issue.find({unit:unit})

//     res.status(200).send(issues)


// }

