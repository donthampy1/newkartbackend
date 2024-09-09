const express = require('express')
const router = express.Router()
const adminauthController = require('../controller/adminauthController')


router.post("/signin",adminauthController.signin)
router.get("/signout",adminauthController.signout)


exports.router = router  
