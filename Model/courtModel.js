const mongoose = require('mongoose');
const courtSchema = new mongoose.Schema({
courtName: { type: String,unique:true, required: true },
sportType: { type: String, required: true },
location: { type: String, required: true },
description: { type: String, required: true },
address: { type: String, required: true },
courtImage: { type: String, required: true }, // Store image as a URL or file path
timeStamp:{type:Date,
default:new Date()}
});                                                
const courts = mongoose.model('courts', courtSchema);
module.exports = courts;
