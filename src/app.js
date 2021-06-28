const express =require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const { extname } = require('path');

const app = express();

//settings
app.set('port', process.env.PORT || 3300);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs'
}));

app.set('view engine', '.hbs');

// middlewares

app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));

//routers
//app.use();

// static files
app.use(express.static(path.join(__dirname, 'public')));

module.exports = app;