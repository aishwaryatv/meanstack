const mongoose = require('mongoose');


var { Contract } = require('../models/contract');

var Contract = mongoose.model('Contract', {
    customerID: { type: String, match: /^(?!0{6})\d{6}$/, description: 'Customer ID should be a 6-digit numeric except 00000' },
    startDate: { type: Date },
    endDate: { type: Date },
    conditions: { type: String, lowercase: true },
    price: { type: Number },
    author: { type: String, lowercase: true, match: /^[a-zA-Z ]*$/, trim: true, description: 'Name of the last modified Person'  },
    version: { type: Number, default: 1 },
    lastModifiedDate: { type: Date, default: Date.now }

});


module.exports = { Contract: Contract };


