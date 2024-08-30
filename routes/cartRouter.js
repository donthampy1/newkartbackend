const express = require('express')
const router = express.Router()
const CartData = require('../models/cartModel') 

router.post('/additems', async (req, res) => {
    const { userId, items } = req.body;
  
    try {
    let cart = await CartData.findOne({ userId });
    console.log(userId)
  
    if (cart) {
      let itemExists = false;

      items.forEach(item => {
        const existingItem = cart.items.find(i => i.productId.equals(item.productId));
        if (existingItem) {
          itemExists = true;
        } else {
          cart.items.push(item);
        }
      });

      if (itemExists) {
        return res.status(200).json({ message: 'Item already in cart', cart });
      }

      await cart.save();
    } else {
      // Create a new cart if it doesn't exist
      cart = new CartData({ userId, items });
      await cart.save();
    }
  
      res.status(201).json(cart);
    } catch (error) {
      res.status(500).json({ error: 'Failed to add items to cart' });
      console.log(error)
    }
  });



  router.get('/search', async (req,res)=>{
    const {id} = req.query
    console.log(id,"this is searchcart")
  try{
    let cart = await CartData.findOne({ userId:Object(id) });
res.status(201).json(cart)
  }catch(error){
    console.log(error)
    res.status(500).json({ error: 'Failed to add items to cart' });

  }
  
  })
  
  exports.router = router;