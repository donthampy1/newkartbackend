const express = require('express');
const router = express.Router();
const Laptop = require('../models/laptopmodel.js');
const cloudinary = require('../config/cloudinary');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/add', upload.array('images', 10), async (req, res) => {
  try {
    

    const imageFiles = req.files; 
    console.log(imageFiles)
    const imageUrls = [];

    for (const file of imageFiles) {
      try {
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
            if (error) {
              console.error('Cloudinary Upload Error:', error);
              reject(error);
            } else {
              resolve(result);
            }
          }).end(file.buffer);
        });
    
        imageUrls.push(result.secure_url);
        console.log('pushed')
      } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).send('Error uploading image');
        return;  
      }
    }
    

    const newLaptop = new Laptop({
      ...req.body,
      images: imageUrls
    });

    await newLaptop.save();
    res.status(201).send('Laptop product created successfully');

  } catch (error) {
    console.error('Error creating laptop product', error);
    res.status(500).send('Error creating laptop product');
  }
});

exports.router = router