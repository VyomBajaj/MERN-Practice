import express from 'express'
import { fetchUser } from '../middleware/fetchUser.js';
import { Notes } from '../models/notes.model.js';
import { body, validationResult } from 'express-validator'

const router = express.Router();

//Route 1 - Fetch All Notes (login Required)
router.get('/fetchallnotes', fetchUser, async (req, res) => {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes)
})
// Route 2 - Add Notes (login Required)
router.post('/addnote', fetchUser, [
    body('title', 'Title should not be empty').isLength({ min: 1 }),
    body('description', 'Enter a valid description minLength - 5').isLength({ min: 5 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { title, description, tags } = req.body;

    const note = new Notes({
        title,
        description,
        tags,
        user: req.user.id
    })
    const savedNote = await note.save();
    res.json(savedNote)
})

//Route 3 - Update an existing note
router.put('/updatenote/:id', fetchUser, async (req, res) => {
    try {
        let note = await Notes.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Not Found")
        }
        const userId = req.user.id
        if (note.user.toString() != userId) {
            return res.status(401).send("You are not allowed to update this note")
        }
        const { title, description, tags } = req.body;
        const newNote = {};
        if (title) {
            newNote.title = title
        }
        if (description) { newNote.description = description; }
        if (tags) { newNote.tags = tags; }

        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json({ note })
    } catch (error) {
        res.json({error:error.message})
    }

})
//Route 4 - Delete a particular note (Login Required)
router.delete('/deletenote/:id', fetchUser, async (req, res) => {
    try {
        let note = await Notes.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Not Found")
        }
        const userId = req.user.id
        if (note.user.toString() != userId) {
            return res.status(401).send("You are not allowed to delete this note")
        }
        note = await Notes.findByIdAndDelete(req.params.id)
        res.json({"Success":"Note has been deleted successfully","note":note})

    } catch (error) {
        res.json({error:error.message})
    }

})

export default router