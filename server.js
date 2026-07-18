const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middlewares
app.use(express.json());   // JSON data read karne ke liye (axios ke liye zaroori)
// app.use(cors());           // taaki HTML file se request block na ho


app.use(cors({
    origin: [
        "http://127.0.0.1:5500",
        "http://localhost:5500"
    ]
}));

console.log("CORS Loaded");
app.options(/.*/, cors());
// ================== MongoDB Connect ==================
// Apni Atlas connection string yaha daalo
// mongoose.connect("mongodb+srv://USER_DATABASE_syED:NyRvELuIzA36do1U@cluster0.z3w8chw.mongodb.net/?appName=Cluster0")
//   .then(() => console.log("MongoDB connected!"))
//   .catch(err => console.log("Connection error:", err));


// if call via url key and Value (online site ka lea key value)

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected!"))
  .catch(err => console.log("Connection error:", err));


// ================== Schema & Model ==================
const notesSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Note = mongoose.model("note", notesSchema);

// ================== Routes ==================

// Home route (test ke liye)
app.get("/", (req, res) => {
  res.send("Server chal raha hai! /notes par jao data dekhne ke liye.");
});

// GET - sab notes JSON mein bhejna
app.get("/notes", (req, res) => {
  Note.find({})
    .then(notes => res.json(notes))
    .catch(err => res.status(500).json({ error: err.message }));
});

// POST - naya note add karna
app.post("/notes", (req, res) => {
  const newNote = new Note({
    title: req.body.title,
    content: req.body.content
  });

  newNote.save()
    .then((saved) => {
      console.log(saved,'POST')
      return res.json(saved) 
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

// PUT - note update karna (id se)
app.put("/notes/:id", (req, res) => {
  Note.findByIdAndUpdate(
    req.params.id,
    { title: req.body.title, content: req.body.content },
    { new: true }
  )
    .then(updated => res.json(updated))
    .catch(err => res.status(500).json({ error: err.message }));
});

// DELETE - note delete karna
app.delete("/notes/:id", (req, res) => {
  Note.findByIdAndDelete(req.params.id)
    .then(() => res.json({ message: "Note deleted successfully" }))
    .catch(err => res.status(500).json({ error: err.message }));
});

// ================== Server Start ==================

const PORT = process.env.PORT || 3009;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// app.listen(3009, () => {
//   console.log("Server is running on http://localhost:3009/");
// });
