const express = require('express');
const router = express.Router();
const Product = require('../models/baseModel');


router.get('/search', async (req,res)=>{
    const {id} = req.query
    console.log(id)


   
        try {
          const product = await Product.findById(id);
          console.log(product)
          if (!product) {
            return res.status(404).json({ message: 'Product not found' });
          }
          res.json(product);
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
    })
    


    exports.router = router;

