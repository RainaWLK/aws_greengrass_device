const things = require('./things.js');
const fs = require('fs');



test('register device', async () => {
  expect.assertions(2);
  let cert = fs.readFileSync('cert/aws/device1/device1.crt');

  const data = await things.register('device3', cert);
  expect(data.resourceArns.certificate).toMatch(/^arn:aws:iot:.*:cert/);
  expect(data.resourceArns.thing).toMatch(/^arn:aws:iot:.*:thing/);
});

test('delete device', async () => {
  expect.assertions(1);

  const data = await things.deleteThing('device3');
  expect(data).not.toBeNull();
});