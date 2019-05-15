const AWS = require('aws-sdk');
const fs = require('fs');
const env = require('./env.js');
const intermediate = fs.readFileSync('cert/intermediate.crt');
const provision_template = require('./provision_template.json');
const certificateid = require('./certificateid.js');


const iot = new AWS.Iot({
  iot: '2015-05-28',
  region: env.region
  // other service API versions
});

async function describeThing(thingName) {
  var params = {
    thingName: thingName
  };
  try {
    let data = await iot.describeThing(params).promise();
    console.log(data);           // successful response
    return data;
  }
  catch(err) {
    console.log(err, err.stack); // an error occurred
    throw err;
  }

}

async function updateCertificate(certificateId, status) {
    let params = {
      certificateId: certificateId, /* required */
      newStatus: status /* required */
    };
    try {
      return await iot.updateCertificate(params).promise();
    }
    catch(err) {
      console.log(err, err.stack); // an error occurred
    }
}

async function deleteCertificate(certificateId) {
  try {
    //revoke
    await updateCertificate(certificateId, 'REVOKED');

    //delete
    var params = {
      certificateId: certificateId, /* required */
      forceDelete: false
    };
    return await iot.deleteCertificate(params).promise();
  }
  catch(err) {
    console.log(err, err.stack); // an error occurred
    throw err;
  }
}

async function deleteThing(thingName) {
  var params = {
    thingName: thingName, /* required */
    //expectedVersion: 'NUMBER_VALUE'
  };
  try {
    let principals = await detachThingPrincipal(thingName);
    //delete policy


    //delete certificate
    for(let i in principals.certificateId) {
      console.log('delete certificate: ' + principals.certificateId[i]);
      await deleteCertificate(principals.certificateId[i]);
    }

    //delete thing
    console.log('delete Thing: ' + thingName);
    let data = await iot.deleteThing(params).promise();
    console.log(data);           // successful response
    return data;
  }
  catch(err) {
    console.log(err, err.stack); // an error occurred
    throw err;
  }
}

async function describeThingCert(certificateId) {
  var params = {
    certificateId: certificateId /* required */
  };
  try {
    let data = await iot.describeCertificate(params).promise();
    console.log(data);           // successful response
    return data;
  }
  catch(err) {
    console.log(err, err.stack); // an error occurred
    throw err;
  }

}

async function listThingCerts() {
  var params = {
    ascendingOrder: true,
    //marker: 'STRING_VALUE',
    pageSize: 10
  };
  try {
    let data = await iot.listCertificates(params).promise();
    console.log(data);           // successful response
    return data;
  }
  catch(err) {
    console.log(err, err.stack); // an error occurred
    throw err;
  }

}

async function listThingPrincipals(thingName) {
  let params = {
    thingName: thingName /* required */
  };
  try {
    let data = await iot.listThingPrincipals(params).promise();
    
    //parse
    let principals = parsePrincipals(data);
    console.log(principals);
    return principals;
  }
  catch(err) {
    console.log(err, err.stack); // an error occurred
    throw err;
  }

}

//parse principals structure from AWS IoT
function parsePrincipals(data) {
  let output = {
    certificateId: [],
    certificateArn: [],
    policies: []
  }
  for(let i in data.principals) {
    console.log(data.principals[i]);

    let index;
    if((index = data.principals[i].indexOf('cert')) > 0) {
      output.certificateArn.push(data.principals[i]);
      output.certificateId.push(data.principals[i].substring(index+'cert'.length+1));
    } else if((index = data.principals[i].indexOf('policy')) > 0) {
      output.policies.push(data.principals[i].substring(index+'policy'.length+1));
    }
  }
  return output;
}

async function detachThingPrincipal(thingName) {
  let doDetach = async (principal) => {
    let params = {
      principal: principal, /* required */
      thingName: thingName /* required */
    };
    try {
      //no response if successful
      return await iot.detachThingPrincipal(params).promise();
    }
    catch(err) {
      throw err;
    }
  }

  try {
    let principals = await listThingPrincipals(thingName);
    //certificates
    for(let i in principals.certificateArn) {
      await doDetach(principals.certificateArn[i]);
    }
    return principals;
  }
  catch(err) {
    console.log(err, err.stack); // an error occurred
    throw err;
  }
}

async function registerDeviceCert(cert) {
  var params = {
    certificatePem: cert.toString(), // required 
    caCertificatePem: intermediate.toString(),
    setAsActive: true
  };
  try {
    let data = await iot.registerCertificate(params).promise();
    console.log(data);
    /*
    {
      certificateArn: '',
      certificateId:'' 
    }
    */
    return data;
  }
  catch(err) {
    if(err.statusCode >= 400) {
      console.log(`Thing certificate existed.`);
      //get certificate id
      let certid = await certificateid.get(cert);
      return {
        certificateArn: '',
        certificateId: certid
      };
    } else {
      throw err;
    }
  }
}

async function register(uuid, cert) {
  //cert = fs.readFileSync('../cert/aws/device1/device1.crt');

  //await listThingCerts();
  //await describeThing(uuid);

  //let principals = await listThingPrincipals(uuid);
  //await describeThingCert('2c6a719a330b3bc1208d2f0bdaf669a3280b897ab4665b8ba8fda6789d664046');



  try {
    let thingCert = await registerDeviceCert(cert);
    let params = {
      templateBody: JSON.stringify(provision_template), // required
      parameters: {
        'ThingName': uuid,
        'CertificateId': thingCert.certificateId
      }
    };
    let data = await iot.registerThing(params).promise();
    console.log(data);           // successful response
    return data;
  }
  catch(err) {
    console.log(err, err.stack); // an error occurred
    throw err;
  }


}

exports.deleteThing = deleteThing;
exports.register = register;