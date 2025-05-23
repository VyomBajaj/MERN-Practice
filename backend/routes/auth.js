import express from 'express'
import {body,validationResult} from 'express-validator'
import { User } from '../models/user.model.js';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"

const router = express.Router();

router.post('/',[
    body('name').isLength({min:2}),
    body('email').isEmail(),
    body('password').isLength({min:5})
],async(req,res)=>{

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }

    const {name,email,password} = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        const user = new User({ name, email, password:hashedPassword });
        await user.save();

        const data = {
            user:{
                "id":user._id
            }
        }

        const authToken = jwt.sign(data,process.env.JWT_KEY)

        // console.log(data);

        console.log("User Created Successfully")
        res.status(201).json({ message: 'User registered successfully', authToken });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
})

router.post('/login',[

    body('email','Email should be valid').isEmail(),
    body('password','Password should not be empty').exists()  

],async(req,res)=>{

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }

    const {email,password} = req.body;

    try {

        let user = await User.findOne({email})
        if(!user){
            return res.status(400).json({message:"Please try to fill correct credentials"});
        }
        const passwordCompare = await bcrypt.compare(password,user.password);
        if(!passwordCompare){
            return res.status(400).json({message:"Please try to fill correct credentials"});
        }

        const data = {
            user:{
                "id":user._id
            }
        }

        const authToken = jwt.sign(data,process.env.JWT_KEY)
        res.json({
                  "message":"User logged in Successfully",
                  "authToken":authToken
                });
    } 
    catch (error) {
        console.log(error.message);
        res.status(500).send("InternalServerError:Some error occured in login route");
    }
})

export default router