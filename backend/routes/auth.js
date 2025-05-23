import express from 'express'
import {body,validationResult} from 'express-validator'
import { User } from '../models/user.model.js';

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

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        const user = new User({ name, email, password });
        await user.save();

        console.log("User Created Successfully")
        res.status(201).json({ message: 'User registered successfully', user });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
})

export default router