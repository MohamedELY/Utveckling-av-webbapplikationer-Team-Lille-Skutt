const express = require('express');
const formidable = require('formidable');
const cors = require('cors');
const { response } = require('express');

const app = express();
const port = 3000;


app.use(cors());

app.get('/', (req, res) =>
  res.redirect('../addAlbum')
);

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
