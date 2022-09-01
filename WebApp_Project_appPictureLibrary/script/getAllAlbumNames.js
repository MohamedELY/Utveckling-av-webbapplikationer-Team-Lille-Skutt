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


for (const album of library.albums) {
    renderAlbumMenu(album.title);
    //console.log(album.title)
  }

 /*
 let album = library.albums[0];
 for (const picture of album.pictures) {
    renderImage(`${album.path}/${picture.imgLoRes}`, picture.id, picture.title, picture.comment);

 }
 */
})


window.addEventListener('click',  () => {

  //just to confirm that the library is accessible as a global variable read async
  console.log (`library has ${library.albums.length} albums`);
});

//Render the images
function renderAlbumMenu(Title) {

  const title = document.createElement('a')
  title.innerHTML = Title

  const imgFlex = document.querySelector('.dropdown-content');
  imgFlex.appendChild(title);
};