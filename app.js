const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();

const Config = require('./config.js');

// View engine setup
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Static folder
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
    res.render('contact', { layout: false });
    // res.send("")
});

app.post('/send', (req, res) => {
    console.log(req.body);
    const output = `
    <p>You have a new contact request</p>
    <h3>Contact Details</h3>
    <ul>  
      <li>Name: ${req.body.name}</li>
      <li>Company: ${req.body.company}</li>
      <li>Email: ${req.body.email}</li>
      <li>Phone: ${req.body.phone}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>
  `;


  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: Config.EMAIL,
        pass: Config.PASSWORD // naturally, replace both with your real credentials or an application-specific password
    }
  });


   // setup email data with unicode symbols
   let mailOptions = {
    from: `"Nodemailer Contact" <${Config.EMAIL}>`, // sender address
    to: `${req.body.email}`, // list of receivers
    subject: 'Node Contact Request', // Subject line
    text: 'Hello world?', // plain text body
    html: output // html body
 };

  // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);   
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        res.render('contact', {layout: false, msg:'Email has been sent'});
    });
});

const PORT = process.env.PORT || 7000;

app.listen(PORT, () => console.log(`Server up at ${PORT}...`));