const express = require('express')
const router = express.Router()
const Product = require('../models/baseModel')
const OrderDetails = require('../models/orderDetailsModel')

 

router.get('/search', async (req,res)=> {
    const {id} = req.query
    console.log(id,"this is editproducts")

    try{
        const product = await Product.find({sellerId: id})
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
          }
          res.json(product);
    }catch (error) {
        console.log(error)
    }

})

router.put('/update', async (req,res)=>{
    console.log('request received  ')
    const { id } = req.query
    const { stock, price } = req.body
    console.log(id, stock,price)


    try {

    const updatedProduct = await Product.findByIdAndUpdate(
        id,
        { stock, price },  
        { new: true }  
    )

    res.status(200).json(updatedProduct);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Server error', error });
}

}) 


router.delete('/delete', async (req,res)=>{
    console.log('request received  ')
    const { id } = req.query
    console.log(id)


    try {

    const updatedProduct = await Product.findByIdAndDelete( id )

    res.status(200).json(updatedProduct);
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Server error', error });
}

}) 





router.get('/filterproducts', async (req, res) => {
  const { id, category, orderStatus, paymentStatus } = req.query;
  console.log("Query received:", id, category, orderStatus, paymentStatus);

  try {
    const orders = await OrderDetails.find({
      'products.sellerId': id,
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



  
  router.get('/searchorders', async (req,res)=> {
    const {id} = req.query
    console.log(id,"this is editproducts")

    try{
        const product = await OrderDetails.find({ 'products.sellerId': id })
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
          }
          res.json(product);
    }catch (error) {
        console.log(error)
    }

})



router.put('/updateorder', async (req, res) => {
  const { id } = req.query;  // ID of the order to be updated
  const { orderStatus, deliveryDate } = req.body;  // Data sent from the frontend
  console.log(id, orderStatus,deliveryDate )

  try {
      // Find the order by ID
      const order = await OrderDetails.findById(id);
      console.log(order)
      if (!order) {
          return res.status(404).json({ message: 'Order not found' });
      }

      // Update the order fields
      order.orderStatus = orderStatus || order.orderStatus;
      order.deliveryDate = deliveryDate || order.deliveryDate;  // Update the date if provided

      // Save the updated order
      await order.save(); 

      return res.status(200).json({ message: 'Order updated successfully', order });
  } catch (error) {
      console.error('Error updating order:', error);
      return res.status(500).json({ message: 'Server error' });
  }
});







exports.router = router