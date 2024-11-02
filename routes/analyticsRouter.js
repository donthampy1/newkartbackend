const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Product = require('../models/baseModel');
const OrderDetails = require('../models/orderDetailsModel')




router.get('/data', async (req,res)=>{
    const { sellerId } = req.query


    try {
        const productdata = await Product.find({ sellerId })
        const orders = await OrderDetails.find({
            "products.sellerId":new mongoose.Types.ObjectId(sellerId),
          })
          console.log(productdata,orders)
        res.status(200).json({ products: productdata, orders: orders })

    }catch (error){
        res.status(500).json({ error: 'error on fetching data' });
        console.log(error)
    }

})

exports.router = router