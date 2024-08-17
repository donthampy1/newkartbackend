const mongoose = require('mongoose')
const {Schema} = mongoose


const sellerSchema = new Schema({
    agencyname: { type:String, required: true },
    email:{ type:String, required:true, unique: true},
    isSeller:{ type: Boolean, default: true},
    phone:{ type:Number },
    password:{ type:String },

},{ timestamps: true })


exports.Seller = mongoose.model('Seller', sellerSchema)

