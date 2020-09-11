var express = require("express");
var path = require("path");
var fs = require("fs");
var app = express();
const PORT = process.env.PORT || 3000;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname));

fs.readFile("./db/db.json", 'utf8', function(err,responses){
  if(err){
    throw err;
  } 

  var notes=JSON.parse(responses);

  // Displays all notes
  app.get("/api/notes", function(req, res) {
    res.json(notes);
  });


    //setup the /api/notes post route and save it
  app.post("/api/notes", function(req, res) {

    let note = req.body;
    let id = (notes.length).toString();
    note.id = id;
    notes.push(note);
    res.json(note);
    fs.writeFile("./db/db.json", JSON.stringify(notes,"\t"), 'utf-8', function(err){
      if(err){
        throw err;
      } 
      return true;
    });
  
    
    return console.log("New note: "+note.title);

  });

  

  //DELETE method to delete note with specified ID
  app.delete("/api/notes/:id", function(req, res){
    //splice function returns removed item
    notes.splice(req.params.id, 1);
    var noteData = req.params.id;
    console.log(noteData);

    for (var i = 0; i < notes.length; i++) {
      
      if (noteData === notes[i].routeName) {
        
        console.log("Deleted " + notes[i].title);
        return res.json(notes[i]);
      }
    }
    return res.json(false);

  });
  //========API ROUTES ===============

  //Display the notes.html /notes route
  app.get("/notes", function(req, res) {
      res.sendFile(path.join(__dirname, "./public/notes.html"));
  });

  //Display the index.html route
  app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"));
  });

  // Starts the server to begin listening
  // =============================================================
  
});
app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});
