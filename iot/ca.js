const AWS = require('aws-sdk');
const fs = require('fs');
const env = require('./env.js');
const intermediate = fs.readFileSync('cert/intermediate.crt');
let template_JITP = require('./template_JITP.json');

const iot = new AWS.Iot({
  iot: '2015-05-28',
  region: env.region
  // other service API versions
});

async function list() {
  let params = {
    ascendingOrder: true,
    //marker: 'STRING_VALUE',
    pageSize: 10
  };
  try {
    let data = await iot.listCACertificates(params).promise();

    return data;
  }
  catch(err) {
    console.log(err, err.stack); // an error occurred
    throw err;
  }
}

async function describe(certificateId) {
  let params = {
    certificateId: certificateId
  };

  try {
    let data = await iot.describeCACertificate(params).promise();
    console.log(data);           // successful response
    return data;
  }
  catch(err) {
    console.log(err, err.stack); // an error occurred
    throw err;
  }
}

async function register() {
  const verifyCa = fs.readFileSync('cert/aws/verificationCert.crt');

  console.log(template_JITP);
  let params = {
    caCertificate: intermediate.toString(), /* required */
    verificationCertificate: verifyCa.toString(), /* required */
    allowAutoRegistration: true,
    registrationConfig: {
      roleArn: env.arn,
      templateBody: JSON.stringify(template_JITP)
    },
    setAsActive: true
  };
  try {
    let data = await iot.registerCACertificate(params).promise();
    console.log(data);           // successful response
    return data;
  }
  catch(err) {
    if(err.statusCode >= 400) {
      throw err.message;
    } else {
      throw err;
    }
  }

}

exports.list = list;
exports.register = register;