//Just to ensure we force js into strict mode in HTML scrips - we don't want any sloppy code
'use strict';  // Try without strict mode

//import * as proto from './picture-album-prototypes.js';
import * as lib from '../model/picture-library-browser.js';

const libraryJSON ="picture-library.json";
let library;  //Global varibale, Loaded async from the current server in window.load event


//use the DOMContentLoaded, or window load event to read the library async and render the images

window.addEventListener('DOMContentLoaded', async () => {

    library = await lib.pictureLibraryBrowser.fetchJSON(libraryJSON);  //reading library from JSON on local server 

    for (const album of library.albums) {
        renderAlbums(album.headerImage, album.title, album.id, album.comment); 

    }
});


//Render the images method
function renderAlbums(header, Title, AlbumId, Comment) {

  const div = document.createElement('div');
  div.className = "FlexItem";

  const title = document.createElement('p')
  title.className = 'title'
  title.innerHTML = Title
  div.appendChild(title)

  const img = document.createElement('img');
  img.src = header;
  img.alt = "Header Photo";
  div.appendChild(img);

  const comment = document.createElement('p');
  comment.className = 'comment';
  comment.innerHTML = Comment;
  div.appendChild(comment) 

  const imgFlex = document.querySelector('.FlexWrap');
  imgFlex.appendChild(div); 

  div.addEventListener("click", ()=> {
      sessionStorage.setItem('selectedAlbumId', JSON.stringify(AlbumId))
      window.location.href = "insideAlbum.html"; 

  });
};