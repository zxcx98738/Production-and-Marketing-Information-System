var express = require('express');
var router = express.Router();
//產品存貨查詢
router.post('/', function (req, res) {
    var productid = req.body['productid'];
    var pool = req.connection;

    pool.getConnection(function (err, connection) {
        connection.query('SELECT productid FROM Product WHERE productid=?', [productid], function (err, rows) {
            if (err) {
                res.render('err', {
                    message: err.message,
                    error: err
                });
            }
            if (rows.length >= 1) {
                req.session.productid = req.body['productid'];
                req.session.aomunt = req.body['amount'];
                req.session.checktime = req.body['checktime'];
                res.redirect('/productstock');
            }
        });
    });
});
router.get('/', function (req, res) {
    var pool = req.connection;
    if (!req.session.productid) {
        res.render('operation/productstock', { warn: "Productid not found or no records!" })
    } else {
        pool.getConnection(function (err, connection) {
            connection.query('SELECT * FROM Product WHERE productid=? ORDER BY checktime ASC ', [req.session.productid, req.session.amount, req.session.checktime], function (err, rows) {

                if (err) {
                    res.render('err', {
                        message: err.message,
                        error: err
                    });

                }
                else {
                    var productid = rows[0].productid;
                    var amount = rows.amount;
                    var checktime = rows.checktime;
                    for (i = 0; i < rows.length; i++) {
                        var recentamount = 0;
                        recentamount += rows[i].amount;
                        
                    }
                    for(i=0;i<rows.length;i++){
                        var lastchecktime;
                        lastchecktime=rows[i].checktime;
                    }
                    res.render('operation/productstock', {
                        session: req.session.productid,
                        productid: productid,
                        amount: amount,
                        checktime: checktime,
                        recentamount:recentamount,
                        lastchecktime:lastchecktime
                    });


                }

            });

            connection.release();

        });
    }
});

module.exports = router;