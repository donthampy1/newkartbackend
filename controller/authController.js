const  model = require ('../models/usermodel.js')
const User = model.User
const sellermodel = require ('../models/sellermodel.js')
const Seller = sellermodel.Seller
const bcryptjs = require('bcryptjs')
require('dotenv').config()
const jwt = require('jsonwebtoken')

const saltRounds = 10

exports.signup = async (req,res)=> {
    try { 
        const { username, email,phone, password } = req.body
        const hashedpassword = bcryptjs.hashSync(password,saltRounds)
        const newUser =new User({ username,email,phone,password: hashedpassword})

        await newUser.save() 
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
        
        
        const validuser = await User.findOne({ email });
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
        return res.cookie("access_token", token, { httpOnly: true, expires: expiryDate })
                  .status(200)
                  .json(rest);

                

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: err.message });
    }
};


exports.googlesignup = async (req,res) => {
    try {
        const {username, email} = req.body
        const newUser =new User({ username,email})
        await newUser.save() 
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


exports.googlesignin = async (req,res) => {
    try {
    const { email } = req.body
    const validuser = await User.findOne({ email });
    if (!validuser) {
        return res.status(404).send({ message: 'email unregistered' });
    }
    const token = jwt.sign({ id: validuser._id }, process.env.JWT_SECRET);
    console.log(validuser)
    const { password: hashedpassword, ...rest } = validuser._doc;



    const expiryDate = new Date(Date.now() + 70000);
    console.log(token)
    return res.cookie("access_token", token, { httpOnly: true, expires: expiryDate })
              .status(203)
              .json(rest);
    

    }catch(error){
        console.log(error)
    }
 

}

exports.sellersignup = async (req,res)=> {
    try { 
        const { agencyname, email,phone, password } = req.body
        const hashedpassword = bcryptjs.hashSync(password,saltRounds)
        const newUser =new Seller({ agencyname,email,phone,password: hashedpassword})

        await newUser.save() 
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


exports.sellersignin = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        
        const validuser = await Seller.findOne({ email });
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
        return res.cookie("access_token", token, { httpOnly: true, expires: expiryDate })
                  .status(200)
                  .json(rest);

                

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: err.message });
    }
}




exports.signout = async (req,res) => {
    res.clearCookie('access_token').status(200).json('Signout Success')
}