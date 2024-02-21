const routes = require("express").Router();
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const { Router } = require("express");
const router = require("./html-routes");

// GET /api/notes should read the db.json file and return all saved notes as JSON.

router.get("/api/notes", async (req, res) => {
  const dbJSON = await fs.promises.readFile("db/db.json", "utf8");
  res.json(dbJSON);
});

// POST /api/notes should receive a new note to save on the request body, add it to the db.json file, and then return the new note to the client.

router.post("/api/notes", async (req, res) => {
  const dbJSON = JSON.parse(fs.readFileSync("db/db.json", "utf8"));
  const newFeedback = {
    title: req.body.title,
    text: req.body.text,
    id: uuidv4(),
  };
  dbJSON.push(newFeedback);
  fs.writeFileSync("db/db.json", JSON.stringify(dbJSON));
  res.json(dbJSON);
});

// DELETE /api/notes/:id should receive a query parameter containing the id of a note to delete. This means you'll need to find a way to give each note a unique id when it's saved. In order to delete a note, you'll need to read all notes from the db.json file, remove the note with the given id property, and then rewrite the notes to the db.json file.

router.delete("/api/notes/:id", (req, res) => {
  let data = fs.readFileSync("db/db.json", "utf8");
  const dataJSON = JSON.parse(data);
  const newNotes = dataJSON.filter((note) => {
    return note.id !== req.params.id;
  });
  fs.writeFileSync("db/db.json", JSON.stringify(newNotes));
  res.json(newNotes);
});

module.exports = routes;
