const startupDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');
const config = require('config');
const morgan = require('morgan');
const helmet = require('helmet');
const Joi = require('@hapi/joi');
const logger = require('./middleware/logger');
const courses = require('./routes/courses');
const home = require('./routes/home');
const authentication=require('./middleware/authentication')
const express = require('express');
const app = express();
const cors = require('cors');

app.set('view engine', 'pug');
app.set('views','./views');

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));
app.use(cors());

app.use(helmet());
app.use('/api/courses',courses);
app.use('/',home);

//Configuration
console.log('Application Name:' +config.get('name'));
console.log('Mail Server:' +config.get('mail.host'));
// console.log('Mail Password:' +config.get('mail.password'));

if(app.get('env') === 'development'){
    app.use(morgan('tiny'));
    startupDebugger('Morgan enabled...');
}

dbDebugger('Connected to the database...');

app.use(logger);
app.use(authentication);
 

var port =process.env.PORT || '3000';

app.listen(port,function() { console.log(`Listening on port ${port}...`)
});