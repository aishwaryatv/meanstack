// Package imports
const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');

//Local imports
var { Customer } = require('../models/customer');
var { Contract } = require('../models/contract');


/* HTTP GET Operation : Retrieves all customers with the latest version 
*  of contract stored against each customer from DB

* URI: GET => http://localhost:3000/customers/
*/
router.get('/', (req, res) => {

    console.log("GET => http://localhost:3000/customers/" + ':  Input  ::::::' + req);

    //query DB and return the latest version on contract for each customer
    Customer.find().populate({ path: 'contract', options: { sort: '-lastModifiedDate', limit: 1 } }).exec((err, docs) => {

        if (!err) {
            if (null == docs || docs.length == 0) {
                res.status(204).send('No Data Found!');
            }
            else {
                console.log("GET => http://localhost:3000/customers/" + ':  Output  ::::::' + docs);
                res.send(docs).status(200);
            }
        } else {
            console.log('Error in retrieving customer details:' + JSON.stringify(err, undefined, 2));
            res.status(500).send('Internal Server Error!');
        }
    });

});


/* HTTP GET Operation : Retrieves all customers with all versions of contracts stored
*  against each customer from DB

* URI: GET => http://localhost:3000/customers/contracts/
*/
router.get('/contracts', (req, res) => {

    console.log("GET => http://localhost:3000/customers/contracts/" + ': Input  ::::::' + req);

    //Query DB and return all contract details for all customers
    Customer.find().populate({ path: 'contract' }).exec((err, docs) => {

        if (!err) {
            if (null == docs || docs.length == 0) {
                res.status(204).send('No Data Found!');
            }
            else {
                console.log("GET => http://localhost:3000/customers/contracts/" + ': output  ::::::' + docs);
                res.send(docs).status(200);
            }
        } else {
            console.log('Error in retrieving customer details:' + JSON.stringify(err, undefined, 2));
            res.status(500).send('Internal Server Error!');
        }
    });

});


/* HTTP GET Operation : Retrieves only the requested customer details from DB,
*   with all versions of contracts stored against the customer

* URI: GET => http://localhost:3000/customers/:cid , where cid is the Customer ID

* Example: http://localhost:3000/customers/123456
*/
router.get('/:cid', (req, res) => {

    var cid = req.params.cid;

    console.log("GET => http://localhost:3000/customers/" + cid + '/' + ': Input  ::::::' + req);

    if (validateCustomerId(cid)) {

        Customer.findOne({ customerID: cid }).populate({ path: 'contract' }).exec((err, doc) => {
            if (!err) {
                console.log('test++' + doc);
                if (null == doc || doc.length == 0) {
                    res.status(204).send('No Data Found!');
                }
                else {
                    console.log("GET => http://localhost:3000/customers/" + cid + '/' + ': Output  ::::::' + doc);
                    res.send(doc).status(200);
                }
            }
            else {
                console.log('Error in Retriving Employee :' + JSON.stringify(err, undefined, 2));
                res.status(500).send('Internal Server Error!');

            }
        });
    } else {
        res.status(400).send('Bad Request - Invalid input!');
    }



});


/* HTTP POST Operation : Add a new customer to DB
*
* URI: POST => http://localhost:3000/customers/ 
*
*/
router.post('/', (req, res) => {

    console.log("POST => http://localhost:3000/customers/" + ': Input  ::::::' + req);

    if (null != req.body && null != req.body.contract) {

        //Construct the contract object
        var contract;

        req.body.contract.forEach((item) => {
            contract = new Contract({
                customerID: req.body.customerID,
                startDate: item.startDate,
                endDate: item.endDate,
                conditions: item.conditions,
                price: item.price,
                author: item.author
            });

        });

        //Construct the customer Object
        var customer = new Customer({
            customerID: req.body.customerID,
            customerName: req.body.customerName
        });

        //Insert the new customer to DB
        contract.save((err, docs) => {

            if (contract != null && !err) {

                customer.contract.push(contract);

                customer.save((err1, docs1) => {
                    if (!err1) {
                        res.send(docs1).status(201);
                    } else {
                        console.log('Error is adding a new contract:' + JSON.stringify(err1, undefined, 2));
                        res.send('Error in adding contract details for customer: ' + req.body.customerID).status(500);
                    }
                });
            } else {
                console.log('Error is adding a new customer:' + JSON.stringify(err, undefined, 2));
                res.send('Error in adding customer: ' + req.body.customerID).status(500);
            }

        });
    } else {
        res.status(400).send('Bad Request - Invalid input!');
    }
});



/* HTTP PUT Operation : Updates existing customer's with the latest contract, with no changes
 to previous contract versions. 
 Here version control is achived by the 'lastModifiedDate' field of each contract entry.

*NOTE: The native APIs of Mongoose $Inc and Express auto-increment, does not
 work in auto incrementing sub-document fields, hence the work around

* URI: PUT => http://localhost:3000/customers/:cid/contracts/ , where cid is the Customer ID
*
* Example: http://localhost:3000/customers/123456/contracts/
*/

router.put('/:cid/contracts', (req, res) => {

    var cid = req.params.cid;

    console.log("PUT => http://localhost:3000/customers/" + cid + '/contracts/' + ': Input  ::::::' + req);


    if (validateCustomerId(cid) && null != req.body && null != req.body.contract) {

        var contract;

        //construct the object for latest contract
        req.body.contract.forEach((item) => {
            contract = new Contract({
                customerID: cid,
                startDate: item.startDate,
                endDate: item.endDate,
                conditions: item.conditions,
                price: item.price,
                author: item.author,
            });

        });

        contract.save((err, docs) => {

            //Update a new contract against the given customer ID
            if (!err) {
                Customer.findOneAndUpdate({ customerID: cid }, { $push: { contract: contract } },
                    { safe: true, upsert: true, new: true }).populate({ path: 'contract' }).exec((err1, docs1) => {

                        if (!err1) {
                            //console.log("PUT => http://localhost:3000/customers/" + cid + '/contracts/' + ': Input  ::::::' + doc1);
                            res.send(docs1).status(201);
                        } else {
                            console.log('Error is adding a new contract:' + JSON.stringify(err1, undefined, 2));
                            res.send("Internal Server Error!").status(500);
                        }
                    });
            } else {
                console.log('Error is updating customer with new contract:' + JSON.stringify(err, undefined, 2));
                res.send("Internal Server Error!").status(500);
            }

        });
    } else {
        res.status(400).send('Bad Request - Invalid input!')
    }

});

/* HTTP PUT Operation : Update existing customer details, with no changes to contract
*
* URI: PUT => http://localhost:3000/customers/:cid/ , where cid is the Customer ID
*
* Example: http://localhost:3000/customers/123456/
*/
router.put('/:cid/', (req, res) => {

    var cid = req.params.cid;

    console.log("PUT => http://localhost:3000/customers/" + cid + '/' + ': Input  ::::::' + req);

    if (validateCustomerId(cid) && null != req.body) {

        var custName = req.body.customerName;

        //Update customer details for the given customer ID
        Customer.findOneAndUpdate({ customerID: cid },
            { "$set": { "customerName": custName } }, { new: true }).populate({ path: 'contract' }).exec((err, docs) => {
                if (!err) {
                    res.send(docs).status(201);
                } else {
                    console.log('Error is updating customer details :' + JSON.stringify(err, undefined, 2));
                    res.send('Internal server error!!!').status(500);
                }
            });
    } else {
        res.status(400).send('Bad Request - Invalid input!');
    }

});


/* HTTP DELETE Operation : Delete an existing customer for a given customer ID
*
* URI: DELETE => http://localhost:3000/customers/:cid/ , where cid is the Customer ID
*
* Example: http://localhost:3000/customers/123456/
*/
router.delete('/:cid', (req, res) => {

    var cid = req.params.cid;
    console.log("DELETE => http://localhost:3000/customers/" + cid + '/');

    if (validateCustomerId(cid)) {

        //Firstly delete customer details from the parent Mongo collection called 'customers'
        Customer.remove({ customerID: cid }, (err, doc) => {
            if (!err) {
                //Next delete customer details from the child Mongo collection: 'contracts'
                Contract.remove({ customerID: cid }, (err, doc) => {
                    if (!err) {
                        res.send(doc).status(202);
                    }
                    else {
                        console.log('Error in deleting customer details :' + JSON.stringify(err, undefined, 2));
                        res.send("Internal Server Error!").status(500);
                    }
                });
            }
            else {
                console.log('Error in Employee Delete :' + JSON.stringify(err, undefined, 2));
                res.send("Internal Server Error!").status(500);
            }
        });
    } else {
        res.status(400).send('Bad Request - Invalid input!');
    }

});


/* Function to check if the input customer id is a 6 digit numeric
 *  Example: 123455 is valid ; 123, 00000 are invalid IDs
 */
function validateCustomerId(cid) {
    return /^(?!0{6})\d{6}$/g.test(cid);
}

/* Functions to determine the latest version of contract
 * 
 * Note:  Mongoose native functions $inc or express auto-increment does not work for incrementing
 * subdocuments fields.Hence these functions were a work around to determine the latest version of contract
 * 
 * Failure Reason: Though the logic works, function invocation within fails due to clash 
 * in asynchronous and synchronous function execution
 *  
 *  */


function getNextContractVersion(cid) {

    var nextVersion = 1;

    //Query DB to return the number of contracts stored against a customer id, which is equal to the current version of contract
    Contract.findOne({ customerID: cid }).sort({ version: 'descending' }).exec((err, doc) => {
        if (!err && doc != null) {
            var currentVersion = parseInt(doc.version);
            nextVersion = currentVersion + 1;
        }
    });
    return nextVersion;
}

function getCount(cid) {
    var count;
    Contract.find({ customerID: cid }).count((err, count) => {
        count = count;
    });
    return parseInt(count);
}


module.exports = router;