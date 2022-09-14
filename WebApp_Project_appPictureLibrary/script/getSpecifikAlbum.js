//Just to ensure we force js into strict mode in HTML scrips - we don't want any sloppy code
'use strict';  // Try without strict mode

//import * as proto from './picture-album-prototypes.js';
import * as lib from '../model/picture-library-browser.js';

const libraryJSON ="picture-library.json";
let library;  //Global varibale, Loaded async from the current server in window.load event



//use the DOMContentLoaded, or window load event to read the library async and render the images
window.addEventListener('DOMContentLoaded', async () => {

    const savedAlbumId = JSON.parse(sessionStorage.getItem("selectedAlbumId")) || []
    library = await lib.pictureLibraryBrowser.fetchJSON(libraryJSON);  //reading library from JSON on local server 
    //library = lib.pictureLibraryBrowser.createFromTemplate();  //generating a library template instead of reading JSON

    for (const album of library.albums) {
    
        if(album.id === savedAlbumId){
            //renderImage(album.headerImage, album.id);
            for (const picture of album.pictures) {
              //renderImage(`${album.path}/${picture.imgLoRes}`, picture.id, picture.title, picture.comment);
              renderImage(`${album.path}/${picture.imgHiRes}`, picture.id, picture.title, picture.comment);
            }
        }
    }
});


//Render the images
function renderImage(src, tag, Title, Comment) {

  const div = document.createElement('div');
  div.className = `FlexItem`;
  div.dataset.picId = tag;

  const innerDiv = document.createElement('div');
  innerDiv.className = `innerItemDiv`;
  
  const editBtn = document.createElement('button');
  editBtn.className = "editBtn";
  editBtn.id = tag;
  editBtn.innerHTML = "🖉"; 
  innerDiv.appendChild(editBtn);

  const checkBox = document.createElement("INPUT");
  checkBox.className = "chkBox";
  checkBox.id = tag;
  checkBox.setAttribute("type", "checkbox");
  innerDiv.appendChild(checkBox);

  div.appendChild(innerDiv);

  const title = document.createElement('p');
  title.className = 'title';
  title.innerHTML = Title;
  div.appendChild(title);

  const img = document.createElement('img');
  img.src = src;
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
    modalcontent.src = this.src;
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
  div.appendChild(comment);

  const imgFlex = document.querySelector('.FlexWrap');
  imgFlex.appendChild(div);


  
};


let slideBtn = document.querySelector('.slideBtn');

slideBtn.addEventListener('click',  () => {
  
  let allCheckItems = document.getElementsByClassName("chkBox");
  let allCheckItemsTrue = [];
  
  for (const checkBox of allCheckItems) {
    if (checkBox.checked === true) {
      allCheckItemsTrue.push(checkBox.id)
    }
  }
  
  sessionStorage.setItem("pictureIdForSlide", JSON.stringify(allCheckItemsTrue));
  location.href = "/slideShow.html";
  //console.log(allCheckItemsTrue);
});


