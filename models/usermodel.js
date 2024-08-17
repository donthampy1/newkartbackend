const mongoose = require('mongoose')
const {Schema} = mongoose


const userSchema = new Schema({
    username: { type:String, required: true },
    email:{ type:String, required:true, unique: true},
    phone:{ type:Number},
    password:{ type:String },
    isUser:{ type: Boolean, default: true},


},{ timestamps: true })


exports.User = mongoose.model('User', userSchema)

