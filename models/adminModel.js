const mongoose = require('mongoose')
const {Schema} = mongoose


const adminSchema = new Schema({
    email:{ type:String, required:true, unique: true},
    password:{ type:String },


},{ timestamps: true })


exports.Admin = mongoose.model('Admin', adminSchema)

