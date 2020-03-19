var express = require('express');
var router = express.Router();

router.post('/', function (req, res) {
    var customerid = req.body['customerid'];
    var pool = req.connection;

    pool.getConnection(function (err, connection) {
        //從資料庫查詢某productid相關資料
        connection.query('SELECT customerid FROM orderpredict WHERE customerid=?', [customerid], function (err, rows) {
            if (err) {
                res.render('err', {
                    message: err.message,
                    error: err
                });
            }
            if (rows.length >= 1) {
                req.session.customerid = req.body['customerid'];
                req.session.customerName = req.body['customerName']
                req.session.inputyear = req.body['inputyear']
                req.session.productid = req.body['productid'];
                req.session.amount = req.body['amount'];

                res.redirect('/Orderpredict');
            }
        });
    });
});
router.get('/', function (req, res) {
    var pool = req.connection;
    //確認產品代碼是否存在
    if (!req.session.customerid) {
        res.render('Marketing/Orderpredict', { warn: "Productid not found or no records!" })
    } else {
        pool.getConnection(function (err, connection) {
            //連到資料庫搜尋該customerid的訂購量
            connection.query('SELECT * FROM orderpredict WHERE customerid=? ', [req.session.customerid, req.session.customerName, req.session.productid, req.session.amount, req.session.inputyear], function (err, rows) {

                if (err) {
                    res.render('err', {
                        message: err.message,
                        error: err
                    });

                }

                else {
                    var customerid = rows[0].customerid;
                    var amount = rows.amount;
                    var productid = rows[0].productid;
                    var customerName = rows.customerName;
                    var inputyear = rows.inputyear;

                   
                    var total = 0;
                    for (i = 0; i < rows.length; i++) {
                        total += rows[i].amount;
                        for (x = i; x >= 3; x--) {
                            total = total - rows[i - 3].amount;
                        }
                        var predictamount = total / 3;
                    }
                    res.render('Marketing/Orderpredict', {
                        session: req.session.customerid,
                        customerid: customerid,
                        customerName: customerName,
                        productid: productid,
                        amount: amount,
                        inputyear: inputyear,
                        predictamount:predictamount
                    });
                }
                
            });

            connection.release();

        });
    }
});

module.exports = router;

