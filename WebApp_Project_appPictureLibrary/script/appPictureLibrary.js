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

    //renderImage(album.headerImage, album.id);
    for (const picture of album.pictures) {
      renderImage(`${album.path}/${picture.imgLoRes}`, `${album.path}/${picture.imgHiRes}`, picture.id, picture.title, picture.comment);
      //renderImage(`${album.path}/${picture.imgHiRes}`, picture.id, picture.title, picture.comment);
    }
  }
})


//Render the images
function renderImage(srcL, srcH, tag, Title, Comment) {

  const div = document.createElement('div');
  div.className = `FlexItem`;
  div.dataset.albumId = tag;
    

  //Logic for Edit Button
  const editBtn = document.createElement('button');
  editBtn.className = "editBtn";
  editBtn.id = tag;
  editBtn.innerHTML = "🖉"; 
  div.appendChild(editBtn);


  let pageContentInModal = document.querySelector(".pageContentInModal");
  let closeBtn = document.querySelector(".windowModalHeader .btnCloseModal");

  let modalTitle = document.getElementById("modalTitle");
  let modalDescription = document.getElementById("modalDescription");


  editBtn.addEventListener('click', () => { 
    console.log("Edit button has been pressed");
    pageContentInModal.style.display = "block";
    modalTitle.value = Title;
    modalDescription.value = Comment;
    sessionStorage.setItem('selectedEditPicId', JSON.stringify(tag))
  });

  closeBtn.addEventListener('click', () => { pageContentInModal.style.display = "none"; })

  window.addEventListener('click', (e) => {
    if (e.target == pageContentInModal) {
       pageContentInModal.style.display = "none";
    }
 });

// End Of Logic for Edit Button

  const title = document.createElement('p');
  title.className = 'title';
  title.innerHTML = Title;
  div.appendChild(title);

  const img = document.createElement('img');
  img.src = srcL;
  img.alt = Comment;
  div.appendChild(img);


  var modal = document.getElementById("myModal");
  var bigTitle = document.getElementById("big-title");
  var modalcontent = document.getElementById("img01");
  var captionText = document.getElementById("caption");

  img.onclick = function()
  {
    modal.style.display = "block";
    bigTitle.innerHTML = Title;
    modalcontent.src = srcH;
    captionText.innerHTML = this.alt;
  }

  var span = document.getElementsByClassName("close")[0];

  span.onclick = function()
  {
    modal.style.display = "none";
  }



  const comment = document.createElement('p');
  comment.className = 'comment';
  comment.innerHTML = Comment;
  div.appendChild(comment)

  const imgFlex = document.querySelector('.FlexWrap');
  imgFlex.appendChild(div);

};