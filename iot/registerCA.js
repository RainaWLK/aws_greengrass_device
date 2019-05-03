const AWS = require('aws-sdk');
const fs = require('fs');
const rootca = fs.readFileSync('../cert/root.crt');

const iot = new AWS.Iot({
  iot: '2015-05-28',
  region: 'us-west-2'
  // other service API versions
});

function go() {
  const ca = fs.readFileSync('../cert/aws/intermediate-aws.crt');

  let params = {
    caCertificate: rootca.toString(), /* required */
    verificationCertificate: ca.toString(), /* required */
    allowAutoRegistration: true,
  //  registrationConfig: {
  //    roleArn: 'STRING_VALUE',
  //    templateBody: 'STRING_VALUE'
  //  },
    setAsActive: true
  };
  iot.registerCACertificate(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
  });
}

exports.go = go;