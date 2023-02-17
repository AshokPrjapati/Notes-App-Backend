const express = require("express");
const note = express.Router();
const NoteModel = require("../model/note.model")

note.get("/", async (req, res) => {
    try {
        const notes = await NoteModel.find(req.body);
        res.send(notes);
    } catch (e) {
        res.send({ error: e.message })
    }

});

note.post("/create", async (req, res) => {
    const payload = req.body;
    try {
        let newNote = new NoteModel(payload);
        await newNote.save();
        res.send({ message: "Note added succesfully" });
    } catch (e) {
        res.send({ error: e.message })
    }
});

note.patch("/update/:id", async (req, res) => {
    const id = req.params.id;
    const note = await NoteModel.findOne({ _id: id });
    const userId_note = note.userId;
    const userId_req = req.body.userId;
    try {
        if (userId_note !== userId_req) return res.status(401).send({ message: "You are not authorized to delete note" });
        await NoteModel.findByIdAndUpdate({ _id: id }, req.body);
        res.send({ message: "Note updated successfully" })
    } catch (e) {
        res.send({ error: e.message })
    }
});

note.delete("/delete/:id", async (req, res) => {
    const id = req.params.id;
    const note = await NoteModel.findOne({ _id: id });
    const userId_note = note.userId;
    const userId_req = req.body.userId;
    try {
        if (userId_note !== userId_req) return res.status(401).send({ message: "You are not authorized to update note" });
        await NoteModel.findByIdAndDelete({ _id: id });
        res.send({ message: "Note deleted successfully" })
    } catch (e) {
        res.send({ error: e.message })
    }
});

module.exports = note