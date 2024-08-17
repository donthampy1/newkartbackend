const express = require('express');
const router = express.Router();
const Mobile = require('../models/mobilemodel.js');
const cloudinary = require('../config/cloudinary');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });



router.post('/add', upload.array('images', 10), async (req, res) => {
    try {

        console.log(req)
      
  
      const imageFiles = req.files; 
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
      
  
      const newMobile = new Mobile ({
        ...req.body,
        images: imageUrls
      });
  
      await newMobile.save();
      res.status(201).send('Mobile product created successfully');
  
    } catch (error) {
      console.error('Error creating laptop product', error);
      res.status(500).send('Error creating laptop product');
    }
  });
  
  exports.router = router