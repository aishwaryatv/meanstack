const mongoose = require('mongoose');

var { Contract } = require('../models/contract');


var Customer = mongoose.model('Customer', {
    customerID: { type: String, match: /^(?!0{6})\d{6}$/, description: 'Customer ID should be a 6-digit numeric except 00000' },
    customerName: { type: String, lowercase: true, match: /^[a-zA-Z ]*$/, trim: true },
    contract: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Contract' }]
});

module.exports = { Customer: Customer };