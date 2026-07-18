// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");

// const app = express();

// // Middlewares
// app.use(express.json());   // JSON data read karne ke liye (axios ke liye zaroori)
// // app.use(cors());           // taaki HTML file se request block na ho


// app.use(cors({
//     origin: "http://127.0.0.1:5500",
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type"]
// }));

// console.log("CORS Loaded");
// app.options(/.*/, cors());
// // ================== MongoDB Connect ==================
// // Apni Atlas connection string yaha daalo
// // mongoose.connect("mongodb+srv://USER_DATABASE_syED:NyRvELuIzA36do1U@cluster0.z3w8chw.mongodb.net/?appName=Cluster0")
// //   .then(() => console.log("MongoDB connected!"))
// //   .catch(err => console.log("Connection error:", err));


// // if call via url key and Value (online site ka lea key value)

// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log("MongoDB connected!"))
//   .catch(err => console.log("Connection error:", err));


// // ================== Schema & Model ==================
// const notesSchema = new mongoose.Schema({
//   title: String,
//   content: String
// });

// const Note = mongoose.model("note", notesSchema);

// // ================== Routes ==================

// // Home route (test ke liye)
// app.get("/", (req, res) => {
//   res.send("Server chal raha hai! /notes par jao data dekhne ke liye.");
// });

// // GET - sab notes JSON mein bhejna
// app.get("/notes", (req, res) => {
//   Note.find({})
//     .then(notes => res.json(notes))
//     .catch(err => res.status(500).json({ error: err.message }));
// });

// // POST - naya note add karna
// app.post("/notes", (req, res) => {
//   const newNote = new Note({
//     title: req.body.title,
//     content: req.body.content
//   });

//   newNote.save()
//     .then((saved) => {
//       console.log(saved,'POST')
//       return res.json(saved) 
//     })
//     .catch(err => res.status(500).json({ error: err.message }));
// });

// // PUT - note update karna (id se)
// app.put("/notes/:id", (req, res) => {
//   Note.findByIdAndUpdate(
//     req.params.id,
//     { title: req.body.title, content: req.body.content },
//     { new: true }
//   )
//     .then(updated => res.json(updated))
//     .catch(err => res.status(500).json({ error: err.message }));
// });

// // DELETE - note delete karna
// app.delete("/notes/:id", (req, res) => {
//   Note.findByIdAndDelete(req.params.id)
//     .then(() => res.json({ message: "Note deleted successfully" }))
//     .catch(err => res.status(500).json({ error: err.message }));
// });

// // ================== Server Start ==================


// // Extra  // {"status":"OK"} // to server sahi chal raha hai.
// app.get("/health", (req, res) => {
//     res.status(200).json({ status: "OK" });
// });

// app.options("/getoption", (req, res) => {
//     res.header("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
//     res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
//     res.header("Access-Control-Allow-Headers", "Content-Type");
//     res.sendStatus(204);
// });

// const PORT = process.env.PORT || 3009;

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

// // app.listen(3009, () => {
// //   console.log("Server is running on http://localhost:3009/");
// // });



const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
// require('dotenv').config();
require('dotenv').config();
const app = express();

// ================== Debug ==================
app.use((req, res, next) => {
    console.log(req.method, req.url);
    next();
});

// ================== CORS ==================
app.use(cors({
    origin: [
        "http://127.0.0.1:5500/",
        "http://localhost:5500"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type"]
}));

// Preflight request handle
app.options("*", cors());

// ================== Middlewares ==================
app.use(express.json());

// ================== MongoDB ==================
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected!"))
    .catch(err => console.log("Connection error:", err));

// ================== Schema ==================
const notesSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Note = mongoose.model("note", notesSchema);

// ================== Routes ==================

// Home
app.get("/", (req, res) => {
    res.send("Server chal raha hai!");
});

// Health
app.get("/health", (req, res) => {
    res.json({ status: "OK" });
});

// GET
app.get("/notes", async (req, res) => {
    try {
        const notes = await Note.find();
        res.json(notes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST
app.post("/notes", async (req, res) => {
    try {
        console.log("POST BODY:", req.body);

        const note = new Note({
            title: req.body.title,
            content: req.body.content
        });

        const saved = await note.save();

        console.log("Saved:", saved);

        res.status(201).json(saved);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// PUT
app.put("/notes/:id", async (req, res) => {
    try {

        const updated = await Note.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(updated);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE
app.delete("/notes/:id", async (req, res) => {
    try {

        await Note.findByIdAndDelete(req.params.id);

        res.json({
            message: "Deleted Successfully"
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ================== Server ==================

const PORT = process.env.PORT || 3009;

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});