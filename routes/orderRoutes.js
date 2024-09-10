const express = require('express')
const router = express.Router()
const OrderDetails = require ('../models/orderDetailsModel')


router.get('/search', async (req,res)=>{
    const {id} = req.query
    console.log(id,"this is searchorderdetails")
  try{
    let cart = await OrderDetails.find({ userId:Object(id) });
    console.log(cart)
res.status(201).json(cart)
console.log(id,"this is aftersearch")

  }catch(error){
    console.log(error)
    res.status(500).json({ error: 'Failed to add items to cart' });

  }
  
  })

  exports.router = router
