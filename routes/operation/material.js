var express = require('express');
var router = express.Router();
var Material = "原料存貨";
router.get('/', function (req, res) {
    res.render('operation/material', { title: Material });
});
router.post('/', function (req, res) {
    var materialid = req.body['materialid'];
    var stockamount = req.body['stockamount'];
    var orderamount = req.body['orderamount'];
    var checkday = req.body['checkday'];
    var lastorderday = req.body['lastorderday'];
    var pool = req.connection;
    pool.getConnection(function (err, connection) {
        connection.query('SELECT materialid FROM material_table WHERE materialid=?', [materialid, stockamount, orderamount, checkday,lastorderday], function (err, rows) {
            if (err) {
                res.render('error', {
                    message: err.message,
                    error: err
                });
            }

            

                var cmd = "INSERT INTO material_table(materialid,stockamount,orderamount,checkday,lastorderday) VALUES(?,?,?,?,?)";
                connection.query(cmd, [materialid, stockamount, orderamount,checkday,lastorderday], function (err, result) {
                    if (err) {
                        res.redirect('/material');
                        console.log(err)
                    } else {
                        res.render('operation/material_redirect');
                    }
                });
        });


        connection.release();
    });
});
module.exports = router;