const AWS = require('aws-sdk');
const s3 = new AWS.S3();

async function upload(bucket, key, data) {
  let params = {
    Body: data, 
    Bucket: bucket,
    Key: key
  };
  try {
    let data = await s3.putObject(params).promise();
    console.log('update to s3 done: ' + bucket + '/' + key);
    console.log(data);           // successful response
    return data;
  }
  catch(err) {
    console.log(err, err.stack); // an error occurred
    throw err;
  }
}

exports.upload = upload;