'use strict';  // Try without strict mode

//import * as proto from './picture-album-prototypes.js';
import * as lib from '../model/picture-library-browser.js';

const libraryJSON = "picture-library.json";
let library;  //Global varibale, Loaded async from the current server in window.load event
let slideIndex = 1;

//use the DOMContentLoaded, or window load event to read the library async and render the images
window.addEventListener('DOMContentLoaded', async () => {
  
  let picIds = JSON.parse(sessionStorage.getItem("pictureIdForSlide"));
  library = await lib.pictureLibraryBrowser.fetchJSON(libraryJSON);  //reading library from JSON on local server 
  //library = lib.pictureLibraryBrowser.createFromTemplate();  //generating a library template instead of reading JSON
  createLArrow();
  let dotIndex = 1;
  for (const album of library.albums) {
    for (const picId of picIds) {
      for (const picture of album.pictures) {
        if(picture.id === picId){
          renderImage(`${album.path}/${picture.imgHiRes}`, picture.id, picture.title, picture.comment);
          createDot(dotIndex);
          dotIndex++;
        }
      }
    }
  }
  showSlides(slideIndex);
  createRArrow();
});



function renderImage(src, tag, Title, Comment) {


  const div = document.createElement('div');
  div.className = `ShowSlide fade`;
  div.dataset.picId = tag;

  const title = document.createElement('p')
  title.className = 'title'
  title.innerHTML = Title
  div.appendChild(title)

  const img = document.createElement('img');
  img.src = src;
  img.alt = Comment;
  div.appendChild(img);

  const comment = document.createElement('p');
  comment.className = 'comment';
  comment.innerHTML = Comment;
  div.appendChild(comment)

  const imgFlex = document.querySelector('.FlexWrap');
  imgFlex.appendChild(div);

};

function createDot(dotIndex){

  const div = document.createElement('div');
  div.className='dot';
  div.onclick= function() {
    currentSlide(dotIndex);
  }
  const imgFlex = document.querySelector('.DotWrap');
  imgFlex.appendChild(div);

}

function createRArrow(){

  const rightarrow = document.createElement('a');
  rightarrow.className = 'next';
  rightarrow.textContent='>';
  rightarrow.onclick= function (){
    plusSlides(1);
  }
  const imgFlex = document.querySelector('.FlexWrap');
  imgFlex.appendChild(rightarrow);
}


function createLArrow(){

  const leftarrow = document.createElement('a');
  leftarrow.className= 'prev';
  leftarrow.textContent= '<';
  leftarrow.onclick= function(){
    plusSlides(-1);
  }

  const imgFlex = document.querySelector('.FlexWrap');
  imgFlex.appendChild(leftarrow);
}


function plusSlides(n) {
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}


function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("ShowSlide");
  let dots = document.getElementsByClassName("dot");
  if (n > slides.length) { slideIndex = 1 }
  if (n < 1) { slideIndex = slides.length }
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
     dots[i].className = dots[i].className.replace(" active", "");
   }
  slides[slideIndex - 1].style.display = "block";
  dots[slideIndex-1].className += " active"; 
}