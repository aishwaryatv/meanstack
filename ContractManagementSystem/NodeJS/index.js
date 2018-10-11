//Package imports
const express = require('express');
const bodyParser = require('body-parser');
const cors=require('cors');

//Local imports
const { mongoose } = require('./db.js');
var contractController = require('./controllers/contractController.js');


var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors({origin:'http://localhost:4200'}));



app.listen(3000, () => console.log('Server started at port : 3000'));
app.use('/customers', contractController);



