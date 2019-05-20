const fs = require('fs');
const ca = require('./ca.js');
const things = require('./things.js');
const bulkProvision = require('./bulkProvision.js');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 8000;

// parse application/json
app.use(bodyParser.json())

app.get('/', (req, res) => res.send('Hello World!'));
app.post('/device', async (req, res) => {

  if((typeof req.body.uuid == 'string') && (typeof req.body.cert == 'string')) {
    let data = await things.register(req.body.uuid, req.body.cert);

    res.send(data);
  } else {
    res.status(401).send('input error');
  }
});

app.delete('/device', async (req, res) => {

  if(typeof req.body.uuid == 'string') {
    let data = await things.deleteThing(req.body.uuid);

    res.send(data);
  } else {
    res.status(401).send('input error');
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));





//init
async function init() {
  try {
    console.log('check CA existed in AWS....');
    let caList = await ca.list();
    if(caList.certificates.length == 0) {
      console.log('no CA found, init CA.');
      await ca.register();
    } else {
      await ca.describe();
    }
  }
  catch(err) {
    console.error(err);
  }
}

async function registerThing() {
  

}


//init();

//
//bulkProvision.go(300);