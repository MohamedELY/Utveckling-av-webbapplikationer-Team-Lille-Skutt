const fs = require('fs');
const express = require('express');
const formidable = require('formidable');
const cors = require('cors');
const { response } = require('express');

const app = express();
const port = 3000;

// Paths
const libraryJsonPath = 'app-data/library/picture-library.json';

app.use(cors());


app.post('/api/upload', (req, res) => {
  const form = new formidable.IncomingForm();

    form.parse(req, function(err, fields, files){
      
      if (err) {
        return;
      }
      
      //mimetype
      let fileExtention = checkMimeType(files.myFile.mimetype);
      

      // Check mimetype before continuing
      if(!fileExtention){
        //res.sendStatus(415);
        return;
      }
      
      const title = fields.albumTitle.trim().replace(' ', '-').replace(/(\s|-|_|~)+/g, '-').toLowerCase();
      const dir = `app-data/library/pictures/${title}`;
      const albumHeaderDir = 'app-data/library/pictures/album-header/';
      
      // recursively create multiple directories
      fs.mkdirSync(dir, { recursive: true }, (err) => {
        if (err) {
          throw err;
        }
      });

      // Process uploaded image
      let oldPath = files.myFile.filepath;
      let newPath = albumHeaderDir + `${title}-header.${fileExtention}`;

      // Todo : check file size (for limiting)

      const data = fs.readFileSync(oldPath)
      
      fs.writeFileSync(newPath, data, function(err){
        //res.sendStatus(501);
        return;
      })
        
        // Load and alter picture-library.json
        libraryJson = JSON.parse(fs.readFileSync(libraryJsonPath));
        console.log(libraryJson.albums);

        albumObj = {
          id:  uniqueId(),
          title: capitalizeFirstLetter(title),
          comment: fields.albumDescription,
          path: dir,
          headerImage: newPath,
          pictures: [],
        };
        
        // Save Changes to library Json
        libraryJson.albums.push(albumObj);
        console.log(libraryJson.albums);
        
       
        fs.writeFile(libraryJsonPath, JSON.stringify(libraryJson), function(err) {
          // Todo: remove album header picture and directory in case of an error
          
          res.sendStatus(501);
          return;
        });
        

    res.send(200); 
  });
});


app.post('/', (req, res) => {
  const form = formidable();

  form.parse(req, (err, fields) => {
    if (err) {
      return;
    }
    console.log('POST body:', fields);
    res.sendStatus(200); 
  });
});

app.listen(port, () =>
  console.log(`http://localhost:${port} is listening.`)
);

function loadPictureLibraryJSON(path){
  return fs.readFileSync(path);
}

function CreatePictureLibrary(path, name, desc, headerImage){
  return fs.readFileSync(path);
}

function checkMimeType(mimeType)
{
    if (typeof mimeType !== 'string')
        return false;

    let pattern = /image\/(png|jpeg|webp|gif)/;

    if (mimeType.match(pattern)){
      return mimeType.split('/').pop();
    } 
    return false;
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function uniqueId() {
  const dateString = Date.now().toString(36);
  const randomness = Math.random().toString(36).substring(2);
  return dateString + randomness;
};