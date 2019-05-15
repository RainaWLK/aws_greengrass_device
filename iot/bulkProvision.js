const AWS = require('aws-sdk');
const fs = require('fs');
const s3 = require('./s3.js');
let provision_template = require('./provision_template.json');

const iot = new AWS.Iot({
  iot: '2015-05-28',
  region: 'us-west-2'
  // other service API versions
});

class Device {
  constructor(name, csr) {
    this.ThingName = name;
    this.CSR = csr;
  }
}

async function genernateBulkDevices(amount) {
  let csr = new Array();
  csr.push(fs.readFileSync('cert/aws/device1/device1.csr'));
  csr.push(fs.readFileSync('cert/aws/device2/device2.csr'));
  csr.push(fs.readFileSync('cert/aws/device3/device3.csr'));

  let devicesForm = "";

  for(let i = 0; i < amount; i++) {
    let name = "Device"+i;

    let device = new Device(name, csr[i%3].toString());
    
    devicesForm += JSON.stringify(device) + "\n";
  }

  console.log(devicesForm);

  return devicesForm;
}

async function bulkRegister(bucket, key) {
  var params = {
    inputFileBucket: bucket, /* required */
    inputFileKey: key, /* required */
    roleArn: env.arn, /* required */
    templateBody: JSON.stringify(provision_template) /* required */
  };
  try {
    let result = await iot.startThingRegistrationTask(params).promise();
    console.log(result);           // successful response
    return result.taskId;
  }
  catch(err) {
    console.log(err, err.stack); // an error occurred
    throw err;
  }
}

async function describeTask(taskId) {
  let params = {
    taskId: taskId /* required */
  };
  try {
    let result = await iot.describeThingRegistrationTask(params).promise();
    console.log(result);           // successful response
    console.log('---------------------');
    return result;
  }
  catch(err) {
    console.log(err, err.stack); // an error occurred
    throw err;
  }

}

async function go(amount) {
  // prepare device list
  let devicesForm = await genernateBulkDevices(amount);
  await s3.upload(process.env.S3_BUCKET_BULK_PROVISION, process.env.S3_FILE_BULK_PROVISION, devicesForm);

  //bulk register into aws iot core
  let taskId = await bulkRegister(process.env.S3_BUCKET_BULK_PROVISION, process.env.S3_FILE_BULK_PROVISION);

  //trace task
  let t = setInterval(() => {
    describeTask(taskId).then(result => {
      if(result.status != 'InProgress') {
        clearInterval(t);
      }
    });
  }, 5000);
}

exports.go = go;
