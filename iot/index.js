const fs = require('fs');
const registerCA = require('./registerCA.js');
const registerDevice = require('./registerDevice.js');
const bulkProvision = require('./bulkProvision.js');


//registerCA.go();
//registerDevice.registerDevice();
//const deviceCert = fs.readFileSync('../cert/aws/device1/device1.csr');

//registerDevice.registerThing('device3', deviceCert.toString());
bulkProvision.go(500);