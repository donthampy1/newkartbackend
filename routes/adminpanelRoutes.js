const express = require('express')
const router = express.Router()
const  model = require ('../models/usermodel.js')
const User = model.User
const sellermodel = require ('../models/sellermodel.js')
const Seller = sellermodel.Seller
const OrderDetails = require ('../models/orderDetailsModel')


router.get('/users', async (req, res) => {
    try {
      const users = await User.find()
      res.status(200).json(users)
    } catch (error) {
        console.log(error)
      res.status(500).json({ message: 'Error fetching users', error: error.message })
    }
  })


  router.delete('/deleteuser', async (req, res) => {
    const { id } = req.query
    console.log(id)
    try {
      const deleteusers = await User.findByIdAndDelete(id)
      res.status(200).json({message: 'user deleted successfully'})
    } catch (error) {
        console.log(error)
      res.status(500).json({ message: 'Error fetching users', error: error.message })
    } 
  })


  router.get('/sellers', async (req, res) => {
    try {
      const users = await Seller.find()
      res.status(200).json(users)
    } catch (error) {
        console.log(error)
      res.status(500).json({ message: 'Error fetching users', error: error.message })
    }
  })



  router.delete('/deleteseller', async (req, res) => {
    const { id } = req.query
    console.log(id)
    try {
      const deleteusers = await Seller.findByIdAndDelete(id)
      res.status(200).json({message: 'user deleted successfully'})
    } catch (error) {
        console.log(error)
      res.status(500).json({ message: 'Error fetching users', error: error.message })
    } 
  })


  router.get('/searchorders', async (req, res) => {
    try {
      const users = await OrderDetails.find()
      res.status(200).json(users)
    } catch (error) {
        console.log(error)
      res.status(500).json({ message: 'Error fetching users', error: error.message })
    }
  })



  router.get('/filterorders', async (req, res) => {
    const { category, orderStatus, paymentStatus } = req.query;
    console.log("Query received:",  category, orderStatus, paymentStatus);
  
    try {
      const orders = await OrderDetails.find({
        orderStatus: orderStatus,
        paymentStatus: paymentStatus,
        'products.category': category,
      });
  
      console.log("Orders fetched:", orders);
  
      // Always return status 200
      if (orders.length === 0) {
        console.log("No orders found");
        return res.status(200).json({ message: 'No orders found.', orders: [] });
      }
  
      console.log("Orders found");
      return res.status(200).json({ orders });
    } catch (error) {
      console.error('Error filtering products:', error);
      return res.status(500).json({ error: 'Server error' });
    }
  });






exports.router = router