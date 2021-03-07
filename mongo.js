const mongoose = require("mongoose");
const password = require("./password");
const { model, Schema } = mongoose;

const connectionString = `mongodb+srv://scipio:${password}@cluster0.hagqe.mongodb.net/notes?retryWrites=true&w=majority`;

// conexión a mongodb
mongoose
  .connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.error(err);
  });

const noteSchema = new Schema({
  content: String,
  date: Date,
  important: Boolean,
});

const Note = model("Note", noteSchema);

const note = new Note({
  content: "Mongodb es increible midu",
  date: new Date(),
  important: true,
});

note
  .save()
  .then((result) => {
    console.log(result);
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error(err);
  });
