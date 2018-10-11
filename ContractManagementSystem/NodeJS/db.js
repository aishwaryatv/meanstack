//Requires Mongoose package
var mongoose = require('mongoose');

//Establish connection to mongoDB with a callback function to notify error/successful connection on console
var dbUri = 'mongodb://localhost:27017/myDB';
mongoose.connect(dbUri, (err) => {
    if (!err)
        console.log('MongoDB Connection Successful .........');
    else
        console.log('Error in DB Connection ...........' + JSON.stringify(err, undefined, 2));
});

module.exports = mongoose;