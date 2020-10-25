// with thanks to https://github.com/Urigo/graphql-modules/blob/8cb2fd7d9938a856f83e4eee2081384533771904/website/lambda/contact.js
const sendMail = require('sendmail')()
const { validateEmail, validateLength } = require('./validations')

exports.handler = (event, context, callback) => {

  const body = JSON.parse(event.body)

  sendMail({
    from: 'davidludemann0@gmail.com',
    to: 'codebytesfl@gmail.com',
    subject: 'test sendmail',
    html: 'Mail of test sendmail ',
  }, function (err, reply) {
    console.log(err && err.stack);
    console.dir(reply);
  });
}
