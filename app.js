const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();

// View engine setup
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Static folder
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(express.json());

app.get('/', (req, res) => {
    res.render('contact', { layout: false });
    // res.send("")
});

const PORT = process.env.PORT || 7000;

app.listen(PORT, () => console.log(`Server up at ${PORT}...`));