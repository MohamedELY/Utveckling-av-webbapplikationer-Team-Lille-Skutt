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


app.post('/api/upload/album', (req, res) => {
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
          title: capitalizeFirstLetter(title).replace('-', ' '),
          comment: fields.albumDescription,
          path: dir,
          headerImage: newPath,
          pictures: [],
        };
        
        // Save Changes to library Json
        libraryJson.albums.push(albumObj);
        console.log(libraryJson.albums);
        
       
        fs.writeFileSync(libraryJsonPath, JSON.stringify(libraryJson), function(err) {
          // Todo: remove album header picture and directory in case of an error
          
          res.status(501).send("Error creating album");
          return;
        });
        

    res.status(200).send("Album created!"); 
  });
});

/* --------------------------------------------------------------- */ 

app.post('/api/upload/picture', (req, res) => {
  const form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files){
      
      if (err) {
        res.status(500).send('Error uploading pictures');
        return;
      }
      
      //mimetype
      let fileExtentionHigh = checkMimeType(files.myFileHigh.mimetype);
      let fileExtentionLow = checkMimeType(files.myFileLow.mimetype);
      

      // Check mimetype before continuing
      if(!fileExtentionHigh || !fileExtentionLow){
        res.status(415).send('File extension not supported');
        return;
      }
      
      // Load picture-library.json
      libraryJson = JSON.parse(fs.readFileSync(libraryJsonPath));
      let targetAlbum = undefined;

      for (const album of libraryJson.albums) {

        if (album.id === fields.albumId)
        // Get a reference to the album in focus, to then later alter it when inserting new images
          targetAlbum = album;
    
      }

      if (!targetAlbum)
      {
        res.status(500).send('Album not found!');
        return;
      }


      const title = fields.pictureTitle.trim().replace(' ', '-').replace(/(\s|-|_|~)+/g, '-').toLowerCase();
      const albumDir = targetAlbum.path;
      

      // Process uploaded image
      const highResPath = `${title}-highres.${fileExtentionHigh}`;
      const oldPathHigh = files.myFileHigh.filepath;
      const newPathHigh = `${albumDir}/${highResPath}`;

      const lowResPath = `${title}-lowres.${fileExtentionLow}`;
      const oldPathLow = files.myFileLow.filepath;
      const newPathLow = `${albumDir}/${lowResPath}`;

      // Todo : check file size (for limiting)

      const dataHigh = fs.readFileSync(oldPathHigh);
      const dataLow = fs.readFileSync(oldPathLow);
      
      // highres
      fs.writeFileSync(newPathHigh, dataHigh, function(err){
        res.status(501).send('Couldnt create album');
        return;
      });

      // lowres
      fs.writeFileSync(newPathLow, dataLow, function(err){
        res.status(501).send('Couldnt create album');
        return;
      });
      pictureObj = {
        id: uniqueId(),
        title: title,
        comment: fields.pictureDescription,
        imgLoRes: lowResPath,
        imgHiRes: highResPath,
        rating: 0
      };
      
      // Save Changes to library Json
      targetAlbum.pictures.push(pictureObj);
      console.log(libraryJson.albums);
      
      
      fs.writeFileSync(libraryJsonPath, JSON.stringify(libraryJson), function(err) {
        // Todo: remove album header picture and directory in case of an error
        
        res.sendStatus(501);
        return;
      });
        

    res.send(200); 
  });
});
 /* --------------------------------------------------------------- */


app.post('/api/upload/rating', (req, res) => {
  const form = new formidable.IncomingForm();
  form.parse(req, function(err, fields, files){

    console.log("Inside rating server");
    if (err) {
      return;
    }

    // Load and alter picture-library.json
    libraryJson = JSON.parse(fs.readFileSync(libraryJsonPath));

    let success = false;
    for (const album of libraryJson.albums) {
      if (album.id === fields.albumId){
        for (const picture of album.pictures) {
          if(picture.id === fields.ratedPictureId)
          {
            picture.rating = fields.rateRange;
            success = true;
          }
        }
      }
    }
    if(!success){
      res.status(501).send("Could not find picture!");
      return;
    }
    
    fs.writeFileSync(libraryJsonPath, JSON.stringify(libraryJson), function(err) {
      // Todo: remove album header picture and directory in case of an error
      
      res.sendStatus(501);
      return;
    });

    res.send(200);
  })
});

/*-------------------------------------------------------------------------------------------------*/


app.post('/api/upload/editPic', (req, res) => {
  const form = new formidable.IncomingForm();

    form.parse(req, function(err, fields, files){
      
      if (err) {
        return;
      }
      console.log("Inside Server");
        // Load and alter picture-library.json
        libraryJson = JSON.parse(fs.readFileSync(libraryJsonPath));

        for (const album of libraryJson.albums) {

          for (const pic of album.pictures) {
            if(pic.id === fields.editPicId){
              pic.title = fields.modalTitle;
              pic.comment = fields.modalDescription;
            }
          }
        }
             
        fs.writeFileSync(libraryJsonPath, JSON.stringify(libraryJson), function(err) {
          // Todo: remove album header picture and directory in case of an error
          
          res.status(501).send("Error submitting");
          return;
        });
        

    res.status(200).send("Changes saved!"); 
  });
});

/*-------------------------------------------------------------------------------------------------*/

app.listen(port, () =>
  console.log(`http://localhost:${port} is listening.`)
);

function loadPictureLibraryJSON(path){
  return fs.readFileSync(path);
};

function CreatePictureLibrary(path, name, desc, headerImage){
  return fs.readFileSync(path);
};

function checkMimeType(mimeType)
{
    if (typeof mimeType !== 'string')
        return false;

    let pattern = /image\/(png|jpeg|webp|gif)/;

    if (mimeType.match(pattern)){
      return mimeType.split('/').pop();
    } 
    return false;
};

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

function uniqueId() {
  const dateString = Date.now().toString(36);
  const randomness = Math.random().toString(36).substring(2);
  return dateString + randomness;
};