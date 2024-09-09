const  model = require ('../models/adminModel.js')
const Admin = model.Admin

const bcryptjs = require('bcryptjs')
require('dotenv').config()
const jwt = require('jsonwebtoken')

const saltRounds = 10

exports.signup = async (req,res)=> {
    try { 
        const {  email, password } = req.body
        const hashedpassword = bcryptjs.hashSync(password,saltRounds)
        const newAdmin =new Admin({ email,password: hashedpassword})

        await newAdmin.save() 
        console.log('added admin')
        res.status(201).json({ message:"added new user" })

    } catch(err) {
        if (err.code === 11000){
            res.status(400).send({ message:'email already in use' })
        }else {
            console.log(err)
            res.status(500).json(err.message) 

        }
    }
   
} 

exports.signin = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        
        const validuser = await Admin.findOne({ email });
        if (!validuser) {
            return res.status(404).send({ message: 'Invalid credentials' });
        }
        
        const validpassword = bcryptjs.compareSync(password, validuser.password);
        if (!validpassword) {
            return res.status(404).send({ message: 'Invalid credentials' });
        }

      
        const token = jwt.sign({ id: validuser._id }, process.env.JWT_SECRET);
        const { password: hashedpassword, ...rest } = validuser._doc;

        const expiryDate = new Date(Date.now() + 70000);
        console.log(token)
        return res.cookie("access_token", token, { httpOnly: true, expires: expiryDate,  SameSite: 'Strict' })
                  .status(200)
                  .json(rest);

                

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: err.message });
    }
}


exports.signout = async (req,res) => {
    console.log('request recieved')
    res.clearCookie('access_token').status(200).json('Signout Success')
}

