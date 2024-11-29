const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
    unit: { type: mongoose.Schema.Types.ObjectId, ref: "Unit", required:true },
    description: { type:String, required:true },
    reportedAt: { type:Date, default:Date.now },
    status: {type:String, enum:["open", "in_progress", "resolved"]},
    resolvedAt:{type:Date}
})

module.exports = mongoose.model('Issue', issueSchema);
