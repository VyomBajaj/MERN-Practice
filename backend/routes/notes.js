import express from 'express'
import { fetchUser } from '../middleware/fetchUser.js';
import { Notes } from '../models/notes.model.js';
import {body,validationResult} from 'express-validator'

const router = express.Router();

//Route 1 - Fetch All Notes (login Required)
router.get('/fetchallnotes',fetchUser,async(req,res)=>{
    const notes = await Notes.find({user:req.user.id});
    res.json(notes)
})

router.post('/addnote',fetchUser,[
    body('title','Title should not be empty').isLength({min:1}),
    body('description','Enter a valid description minLength - 5').isLength({min:5})
],async(req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    const {title,description,tag} = req.body;

    const note = new Notes({
        title,
        description,
        tag,
        user:req.user.id
    })
    const savedNote = await note.save();
    res.json(savedNote)
})

export default router