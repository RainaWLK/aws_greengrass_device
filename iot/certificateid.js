// tools to get certificate id for AWS
const util = require('util');
const exec = util.promisify(require('child_process').exec);

async function get(cert) {
  //let sha256sum = 'sha256sum';  //Linux
  let sha256sum = 'shasum -a 256';  //Mac
  let cmd = `echo '${cert}' | openssl x509 -outform der | ${sha256sum}`;
  
  try {
    const { stdout } = await exec(cmd);

    let certificateId = stdout.substr(0, stdout.indexOf(' '));
    return certificateId;
  }
  catch(err) {
    console.error(err);
    throw err;
  }
  
}

//for test
//get('../cert/aws/device1/device1.crt');

exports.get = get;