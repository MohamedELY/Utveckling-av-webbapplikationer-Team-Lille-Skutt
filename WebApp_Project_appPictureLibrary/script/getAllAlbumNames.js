//Just to ensure we force js into strict mode in HTML scrips - we don't want any sloppy code
'use strict';  // Try without strict mode

//import * as proto from './picture-album-prototypes.js';
import * as lib from '../model/picture-library-browser.js';

const libraryJSON ="picture-library.json";
let library;  //Global varibale, Loaded async from the current server in window.load event


//use the DOMContentLoaded, or window load event to read the library async and render the images
window.addEventListener('DOMContentLoaded', async () => {

library = await lib.pictureLibraryBrowser.fetchJSON(libraryJSON);  //reading library from JSON on local server 
//library = lib.pictureLibraryBrowser.createFromTemplate();  //generating a library template instead of reading JSON

//Get all Album titles and id's
for (const album of library.albums) {
    renderAlbumMenu(album.title, album.id);
    //console.log(album.title)
  }
})


//Render the images
function renderAlbumMenu(Title, AlbumId) {

  const menuBlock = document.createElement('a');
  menuBlock.textContent = Title;

  menuBlock.href = "insideAlbum.html";

  const imgFlex = document.querySelector('.dropdown-content');
  imgFlex.appendChild(menuBlock);

  menuBlock.addEventListener("click", ()=> {
    sessionStorage.setItem('selectedAlbumId', JSON.stringify(AlbumId))
  });
};