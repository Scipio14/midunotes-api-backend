const express = require("express");
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());



//lista de notas

let notes = [
  {
    id: 1,
    content: "Me tengo que suscribir al canal de Midudev de youtube y twitch",
    date: "2019-05-30T17:30:31.098Z",
    important: true,
  },
  {
    id: 2,
    content: "Tngo que estudiar la clase del Fullstack Bootcamp",
    date: "2019-05-30T18:39:31.091Z",
    important: false,
  },
  {
    id: 3,
    content: "Repasar los retos de JS de Midudev",
    date: "2019-05-30T19:20:14.298Z",
    important: true,
  },
];

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
  res.status(200).json(notes);
 
});
app.get("/api/notes/:id", (req, res) => {
  const id = Number(req.params.id);
  //El req.params siempre va a devolver un string, por lo que siempre tenemos que pasarlo a un número
  console.log({ id }); 
  const note = notes.find((note) => note.id === id);
  console.log({ note });
  if (note) {
    res.json(note);
  } else {
    res.status(404).end();
  }
});

app.delete("/api/notes/:id", (req, res) => {
  const id = Number(req.params.id);
  notes = notes.filter((note) => note.id !== id);
  res.status(204).end();
});

app.post("/api/notes", (req, res) => {
  const note = req.body;

  if (!note || !note.content) {
    return res.status(400).json({
      error: "note.content is missing",
    });
  }

  const ids = notes.map((note) => note.id);
  const maxId = Math.max(...ids);
  const newNote = {
    id: maxId + 1,
    content: note.content,
    important: typeof note.important !== 'undefined' ? note.important : false,
    date: new Date().toISOString(),
  };
  notes = [...notes, newNote];

  res.status(201).json(newNote);
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
