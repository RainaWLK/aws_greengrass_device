const fs = require('fs');
const ca = require('./ca.js');
const things = require('./things.js');
const bulkProvision = require('./bulkProvision.js');


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
  await things.register('device3');

}


//init();

//
//bulkProvision.go(300);