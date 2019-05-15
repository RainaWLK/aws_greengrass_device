const tls = require('tls');
const fs = require('fs');
var mqtt = require('mqtt')

const options = {
  // Necessary only if the server requires client certificate authentication.
  key: fs.readFileSync('../cert/aws/device4/deviceCert.key'),
  cert: fs.readFileSync('../cert/aws/device4/deviceCertAndCACert.crt'),

  // Necessary only if the server uses a self-signed certificate.
  ca: fs.readFileSync('../cert/intermediate.crt'),

  // Necessary only if the server's cert isn't for "localhost".
  //checkServerIdentity: () => { return null; },
  rejectUnauthorized: false,

  //mqtt
  clientId: 'ecc985ccc9b1ede68e1c8e446f7b4ee2b08df9078de140b47e9d5e06f6815572'// + Math.random().toString(16).substr(2, 8),

};

console.log(options);
var client  = mqtt.connect('mqtts://adw9mfri5w1h2-ats.iot.us-west-2.amazonaws.com', options);
 

client.on('connect', function (connack) {
  console.log('connected');
  client.subscribe('foo/bar/ecc985ccc9b1ede68e1c8e446f7b4ee2b08df9078de140b47e9d5e06f6815572/zzz', function (err) {
    if (!err) {
      console.log('publish');
      client.publish('foo/bar/ecc985ccc9b1ede68e1c8e446f7b4ee2b08df9078de140b47e9d5e06f6815572/zzz', 'Hello mqtt')
    }
    else {
      console.error('subscribe error');
      console.error(err);
    }
  })
})
 
client.on('message', function (topic, message) {
  // message is Buffer
  console.log('message');
  console.log(message.toString())
  client.end()
})

client.on('reconnect', function () {
  console.log('reconnect');
})

client.on('close', function () {
  console.log('close');
})

client.on('error', function (error) {
  console.error(error);
})

client.on('end', function () {
  console.log('end');
})