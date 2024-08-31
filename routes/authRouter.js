const express = require('express')
const router = express.Router()
const authController = require('../controller/authController')


router.post("/signup",authController.signup)
router.post("/signin",authController.signin)
router.post("/googlesignup",authController.googlesignup)
router.post("/googlesignin",authController.googlesignin)
router.post("/sellersignup",authController.sellersignup)
router.post("/sellersignin",authController.sellersignin)
router.get('/signout',authController.signout)

exports.router = router  