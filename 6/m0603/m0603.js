const sendmail = require('sendmail')();

module.exports = (message) => {
  sendmail({
    from: 'lab6@ping.com',
    to: 'jelapax839@winemail.net',
    subject: 'Lab 6 test',
    html: message,
  }, function (err, reply) {
    console.log(err && err.stack);
    console.dir(reply);
  });
};
