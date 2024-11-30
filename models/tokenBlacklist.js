const mongoose = require("mongoose");


const tokenBlacklist = new mongoose.Schema({
    token:{type:String, required:true},
    timestamp:{type:Date, default:Date.now}
})
module.exports = mongoose.model("TokenBlacklist", tokenBlacklist)