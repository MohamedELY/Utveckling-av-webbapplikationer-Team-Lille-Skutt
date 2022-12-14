//Just to ensure we force js into strict mode in HTML scrips - we don't want any sloppy code
'use strict';  // Try without strict mode

//https://developer.mozilla.org/en-US/docs/Web/API/FormData
const albumForm = document.getElementById('add-Album-Form');
const pictureForm = document.getElementById('add-Picture-Form');
const rateForm = document.getElementById('rating-Form');
const editForm = document.getElementById('add-Modal-Form');
const deleteForm = document.getElementById('deletePictureButton');


//Start the server by opening a terminal in /case-study-server and type node simple-with-form.js
const urlAlbumForm = 'http://localhost:3000/api/upload/album';
const urlPictureForm = 'http://localhost:3000/api/upload/picture';
const urlRatingForm = 'http://localhost:3000/api/upload/rating';
const urlEditForm = 'http://localhost:3000/api/upload/editPic';
const urlDeleteForm ='http://localhost:3000/api/delete';

if (albumForm !== null)
{
  albumForm.addEventListener('submit', async event => {
    event.preventDefault();

    //Create the key/value pairs used in the form
    const formDataAddAlbum = new FormData(albumForm);

    //show that you can append any field. For example a API key
    formDataAddAlbum.append('user', true);

    try {
      //send the data using post and await the reply
      const response = await fetch(urlAlbumForm, {
        method: 'post',
        body: formDataAddAlbum
      });
      const result = await response.text();

      if (response.ok) {
        alert("Album has been created");
      }
      else if(response.status == 415){
        alert("Invalid format");
      }
      else if(response.status == 501){
        alert("Error creating album");
      }
      else {
        alert("Transmission error");
      }
      console.log(result);
    }
    catch {
      alert("Transmission error hej");
    }
  });
}

if (pictureForm !== null)
{
  pictureForm.addEventListener('submit', async event => {
    event.preventDefault();
    
    //Create the key/value pairs used in the form
    const formData = new FormData(pictureForm);

    //show that you can append any field. For example a API key
    const albumId = JSON.parse(sessionStorage.getItem("selectedAlbumId")) || []
    formData.append('albumId', albumId);

    try {
      //send the data using post and await the reply
      const response = await fetch(urlPictureForm, {
        method: 'post',
        body: formData
      });
      const result = await response.text();

      if (response.ok) {
        alert("Pictures have been uploaded");
      }
      else if(response.status == 415){
        alert("Invalid format");
      }
      else if(response.status == 501){
        alert("Error creating album");
      }
      else {
        alert("Transmission error");
      }
      console.log(result);
    }
    catch{
      alert("Transmission error");
    }
  });
}

if (rateForm !== null)
{
  console.log("Inside rating frontend method");
  rateForm.addEventListener('submit', async event => {
    event.preventDefault();

    const formData = new FormData(rateForm);

    //show that you can append any field. For example a API key
    const albumId = JSON.parse(sessionStorage.getItem("selectedAlbumId")) || []
    formData.append('albumId', albumId);

    try {
      //send the data using post and await the reply
      const response = await fetch(urlRatingForm, {
        method: 'post',
        body: formData
      });
      const result = await response.text();

      if (response.ok) {
        alert("Rating has been uppdated.");
      }
      else if(response.status == 415){
        alert("Invalid format");
      }
      else if(response.status == 501){
        alert("Error Uppdating Rating");
      }
      else {
        alert("Transmission error from else if");
      }
      console.log(result);
    }
    catch(err){
      alert("Transmission error from catch:  " + err.message );
    }

  });
}

if (editForm !== null)
{
  editForm.addEventListener('submit', async event => {
    event.preventDefault();

    console.log("inside client side")
    //Create the key/value pairs used in the form
    const formData = new FormData(editForm);

    const modalId = JSON.parse(sessionStorage.getItem("selectedEditPicId")) || []
    formData.append('editPicId', modalId);
    console.log("formlistener rad 107");
    console.log(modalId);

    try {
      //send the data using post and await the reply
      const response = await fetch(urlEditForm, {
        method: 'post',
        body: formData
      });
      const result = await response.text();

      if (response.ok) {
        alert("Changes are now saved");
      }
      else {
        alert("Transmission error");
      }
      console.log(result);
    }
    catch {
      alert("Transmission error");
    } 
  });
}

if (deleteForm !== null)
{
  deleteForm.addEventListener('click', async event => {
    event.preventDefault();

    console.log("inside client side")
    //Create the key/value pairs used in the form
    
    const formData = new FormData(editForm);

    const deleteId = JSON.parse(sessionStorage.getItem("selectedEditPicId")) || []
    formData.append('deleteId', deleteId);

    try {
      //send the data using post and await the reply
      const response = await fetch(urlDeleteForm, {
        method: 'post',
        body: formData
      });
      const result = await response.text();

      if (response.ok) {
        alert("Picture is deleted");
      }
      else {
        alert("Transmission error");
      }
      console.log(result);
    }
    catch {
      alert("Transmission error");
    } 
  });
}