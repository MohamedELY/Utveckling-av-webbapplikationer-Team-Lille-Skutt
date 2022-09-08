//Just to ensure we force js into strict mode in HTML scrips - we don't want any sloppy code
'use strict';  // Try without strict mode

//https://developer.mozilla.org/en-US/docs/Web/API/FormData

const myForm = document.getElementById('add-Album-Form');

//Start the server by opening a terminal in /case-study-server and type node simple-with-form.js
const url = 'http://localhost:3000/api/upload';


myForm.addEventListener('submit', async event => {
  event.preventDefault();

  //Create the key/value pairs used in the form
  const formData = new FormData(myForm);

  //show that you can append any field. For example a API key
  formData.append('user', true);

  try {
    //send the data using post and await the reply
    const response = await fetch(url, {
      method: 'post',
      body: formData
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