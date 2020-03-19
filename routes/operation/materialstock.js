var express = require('express');
var router = express.Router();
//產品存貨查詢
router.post('/', function (req, res) {
    var materialid = req.body['materialid'];
    var pool = req.connection;

    pool.getConnection(function (err, connection) {
        connection.query('SELECT materialid FROM material_table WHERE materialid=?', [materialid], function (err, rows) {
            if (err) {
                res.render('err', {
                    message: err.message,
                    error: err
                });
            }
            if (rows.length >= 1) {
                req.session.materialid = req.body['materialid'];
                req.session.stockaomunt = req.body['stockamount'];
                req.session.orderamount = req.body['orderamount'];
                req.session.checkday = req.body['checkday'];
                req.session.lastorderday =req.body['lastorderday'];
                res.redirect('/materialstock');
            }
        });
    });
});
router.get('/', function (req, res) {
    var pool = req.connection;
    if (!req.session.materialid) {
        res.render('operation/materialstock', { warn: "Materialid not found or no records!" })
    } else {
        pool.getConnection(function (err, connection) {
            connection.query('SELECT * FROM material_table WHERE materialid=? ORDER BY checkday ASC ', [req.session.materialid, req.session.stockamount,req.session.orderamount,req.session.checkday,req.session.lastorderday], function (err, rows) {

                if (err) {
                    res.render('err', {
                        message: err.message,
                        error: err
                    });

                }
                else {
                    var materialid = rows[0].materialid;
                    var stockamount = rows.stockamount;
                    var checkday = rows.checkday;
                    for (i = 0; i < rows.length; i++) {
                        var recentmaterial = 0;
                        recentmaterial += rows[i].stockamount;

                    }
                    for (i = 0; i < rows.length; i++) {
                        var lastcheckday;
                        lastcheckday = rows[i].checkday;
                    }
                    for (i = 0; i < rows.length; i++) {
                        var lasttimeorder;
                        lasttimeorder = rows[i].lastorderday;
                    }
                    res.render('operation/materialstock', {
                        session: req.session.materialid,
                        materialid: materialid,
                        stockamount: stockamount,
                        checkday: checkday,
                        recentmaterial: recentmaterial,
                        lastcheckday: lastcheckday,
                        lasttimeorder:lasttimeorder
                    });


                }

            });

            connection.release();

        });
    }
});

module.exports = router;