var express = require('express');
var router = express.Router();
router.get('/', function (req, res) {
    res.render('Marketing/customer', { title: 'Customer' });
});
router.post('/', function (req, res) {
    var customerid = req.body['customerid'];
    var customerName = req.body['customerName'];
    var lastcost= req.body['lastcost'];
    var lastprofit = req.body['lastprofit'];
    var lastsales =req.body['lastsales'];
    var inputyear =req.body['inputyear'];
    var pool = req.connection;
    pool.getConnection(function (err, connection) {
        connection.query('SELECT customerid FROM customerInfo WHERE customerid=?', [customerid,customerName,lastcost,lastprofit,lastsales,inputyear], function (err, rows) {
            if (err) {
                res.render('error', {
                    message: err.message,
                    error: err
                });
            }

            
                var cmd = "INSERT INTO customerInfo(customerid,customerName,lastcost,lastprofit,lastsales,inputyear) VALUES(?,?,?,?,?,?)";
                connection.query(cmd, [customerid, customerName, lastcost,lastprofit,lastsales,inputyear], function (err, result) {
                    if (err) {
                        res.redirect('/customer');
                        console.log(err)
                    } else {
                        res.render('Marketing/customer_redirect');
                    }
                });
            
        });


        connection.release();
    });
});
module.exports=router;