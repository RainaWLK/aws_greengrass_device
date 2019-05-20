//for AWS Lambda
const things = require('./things.js');

exports.post_handler = async (event) => {
  if((typeof event.uuid == 'string') && (typeof event.cert == 'string')) {
    let data = await things.register(event.uuid, event.cert);

    const response = {
      statusCode: 200,
      body: data,
    };
    return response;
  } else {
    const response = {
      statusCode: 401,
      body: JSON.stringify('input error')
    };
    return response;
  }
};

exports.delete_handler = async (event) => {
  if(typeof event.uuid == 'string') {
    let data = await things.deleteThing(event.uuid);

    const response = {
      statusCode: 200,
      body: data,
    };
    return response;
  } else {
    const response = {
      statusCode: 401,
      body: JSON.stringify('input error')
    };
    return response;
  }
};