const AWS = require('aws-sdk');
const fs = require('fs');
const rootca = fs.readFileSync('../cert/root.crt');
let provision_template = require('./provision_template.json');

const iot = new AWS.Iot({
  iot: '2015-05-28',
  region: 'us-west-2'
  // other service API versions
});

function registerDeviceCert() {
  const deviceCert = fs.readFileSync('../cert/aws/device1/device1.pem');


  var params = {
    certificatePem: deviceCert.toString(), /* required */
    caCertificatePem: rootca.toString(),
    setAsActive: true
  };
  iot.registerCertificate(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
  });
}

function registerThing(name, csr) {
  var params = {
    templateBody: JSON.stringify(provision_template), /* required */
    parameters: {
      'ThingName': name,
      'CSR': csr
    }
  };
  iot.registerThing(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
  });
}

exports.registerDeviceCert = registerDeviceCert;
exports.registerThing = registerThing;