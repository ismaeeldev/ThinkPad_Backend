const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const fetchuser = require('../middleware/fetchuser.cjs');
const Notes = require('../models/Notes.cjs');



//Fetch the notes -- End point 
router.get('/fetchnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id });
        res.json(notes);
    } catch {
        res.status(400).send("Internal Server Error");
    }
})

//Add the Notes -- End point
router.post('/addnotes', fetchuser, [
    //validator
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'Enter a description').isLength({ min: 5 }),
], async (req, res) => {

    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
    }

    try {
        const { title, description, tag } = req.body;

        const note = new Notes({
            title, description, tag, user: req.user.id,
        })

        const savedNotes = await note.save();
        res.json(savedNotes);

    } catch {
        res.status(400).send("Internal Server Error ");
    }

})

//Update the Notes -- Endpoint
router.put('/updatenotes/:id', fetchuser, async (req, res) => {

    const { title, description, tag } = req.body;

    const newNote = {};

    if (title) { newNote.title = title };
    if (description) { newNote.description = description };
    if (tag) { newNote.tag = tag };

    try {
        let note = await Notes.findById(req.params.id);
        if (!note) {
            return res.status(404).json({ message: "Not Found.." });
        }

        if (note.user.toString() !== req.user.id) {
            return res.status(401).json({ message: "Not allowed" });
        }

        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });

        res.json(note);

    } catch {
        res.status(500).send("Internal Server Error ");
    }

})


// Delete Notes --EndPoint

router.delete('/deletenotes/:id', fetchuser, async (req, res) => {

    try {
        let note = await Notes.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Not Found..");
        }

        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        note = await Notes.findByIdAndDelete(req.params.id);
        res.json({ message: "Successfully Deleted Note" });

    } catch {
        res.status(500).send("Internal Server Error ");
    }
})

// Delete all notes end point 

router.delete('/deleteAllnotes', fetchuser, async (req, res) => {
    try {
        // Delete all notes belonging to the authenticated user
        await Notes.deleteMany({ user: req.user.id });

        res.json({ success: "true", message: "Successfully Deleted All Notes" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ title: "Error", text: "Internal Server Error ", icon: "error" });
    }
});


module.exports = router