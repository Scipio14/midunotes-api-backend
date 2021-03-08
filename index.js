require("dotenv").config();
require("./mongo");
const express = require("express");
const app = express();
const cors = require("cors");
const Note = require("./models/Note");
const notFound = require("./middleware/notFound");
const handleErrors = require("./middleware/handleErrors");

app.use(cors());
app.use(express.json());

//lista de notas

//Creamos el servidor

/* Usando Nodejs

const app = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(notes));
});
*/

app.get("/", (req, res) => {
  res.send("<h1>Hello World</h1>");
});
app.get("/api/notes", (req, res) => {
  Note.find({}).then((notes) => {
    res.status(200).json(notes);
  });
});
app.get("/api/notes/:id", (req, res, next) => {
  //const id = Number(req.params.id);
  const { id } = req.params;
  //El req.params siempre va a devolver un string, por lo que siempre tenemos que pasarlo a un número
  Note.findById(id)
    .then((note) => {
      if (note) {
        res.json(note);
      } else {
        res.status(404).end();
      }
    })
    .catch((err) => {
      next(err);
    });

  //
});

app.delete("/api/notes/:id", (req, res, next) => {
  const { id } = req.params;
  Note.findByIdAndDelete(id)
    .then(() => {
      res.status(204).end();
    })
    .catch((err) => next(err));
  res.status(204).end();
});

app.post("/api/notes", (req, res) => {
  const note = req.body;

  if (!note.content) {
    return res.status(400).json({
      error: "required content field is missing",
    });
  }

  const newNote = new Note({
    content: note.content,
    date: new Date(),
    important: note.important || false,
  });
  newNote.save().then((savedNote) => {
    res.status(201).json(savedNote);
  });
});

app.put("/api/notes/:id", (req, res, next) => {
  const { id } = req.params;
  const note = req.body;
  const newNoteInfo = {
    content: note.content,
    important: note.important,
  };
  Note.findByIdAndUpdate(id, newNoteInfo, { new: true })
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.log(err.name);
    });
});

app.use(notFound);

app.use(handleErrors);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
