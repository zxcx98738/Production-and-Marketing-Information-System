var express = require('express');
var router = express.Router();

router.post('/', function (req, res) {
    var customerid = req.body['customerid'];
    var pool = req.connection;

    pool.getConnection(function (err, connection) {
        //從資料庫查詢某productid相關資料
        connection.query('SELECT customerid FROM customerinfo WHERE customerid=?', [customerid], function (err, rows) {
            if (err) {
                res.render('err', {
                    message: err.message,
                    error: err
                });
            }
            if (rows.length >= 1) {
                req.session.customerid = req.body['customerid'];
                req.session.customerName = req.body['customerName']
                req.session.lastcost = req.body['lastcost'];
                req.session.lastprofit = req.body['lastprofit'];
                req.session.inputyear = req.body['inputyear']
                res.redirect('/customerpredict');
            }
        });
    });
});

router.get('/', function (req, res) {
   
    var pool = req.connection;
    //var data="";
    //確認產品代碼是否存在
    if (!req.session.customerid) {
        res.render('Marketing/customerpredict', { warn: "Customerid not found or no records!" });
    } else {
        pool.getConnection(function (err, connection) {
            //連到資料庫搜尋該customerid的訂購量
            connection.query('SELECT * FROM customerinfo WHERE customerid=? ', [req.session.customerid, req.session.customerName, req.session.lastcost, req.session.lastprofit, req.session.inputyear], function (err, rows) {
                if (err) {
                    res.render('err', {
                        message: err.message,
                        error: err
                    });
                }

                else {
                    var customerid = rows[0].customerid;
                    var customerName = rows[0].customerName;
                    var lastcost = rows.lastcost;
                    var lastprofit = rows.lastprofit;
                    var lastsales =rows.lastsales;
                    var inputyear = rows.inputyear;

                    var totalcost = 0;
                    for (i = 0; i < rows.length; i++) {
                        totalcost += rows[i].lastcost;
                         for(x=i;x>=3;x--){
                             totalcost=totalcost-rows[i-3].lastcost
                         }
                        var averagecost = totalcost / 3;
                    }
                    var totalprofit = 0;
                    for (i = 0; i < rows.length; i++) {
                        totalprofit += rows[i].lastprofit;
                        for (x = i; x >= 3; x--) {
                            totalprofit = totalprofit - rows[i - 3].lastprofit
                        }
                        var averageprofit = totalprofit / 3;
                    }
                    var totalsales = 0;
                    for (i = 0; i < rows.length; i++) {
                        totalsales += rows[i].lastsales;
                        for (x = i; x >= 3; x--) {
                            totalsales = totalsales - rows[i - 3].lastsales
                        }
                        var averagesales = totalsales / 3;
                    }
                    
                    
                    /*
                    var totalprofit = 0;
                    for (i = 0; i < rows.length; i++) {
                        totalprofit += rows[i].lastprofit;
                        var averageprofit = totalprofit/ 3;
                    }
                    var totalsales = 0;
                    for(i=0;i<rows.length;i++){
                        totalsales += rows[i].lastsales;
                        var averagesales = totalsales/3;
                    }
                    */
                    var costperproduct = averagecost/averagesales;
                    var profitperproduct = averageprofit/averagesales;
                    res.render('Marketing/customerpredict', {
                        session: req.session.customerid,
                        customerid: customerid,
                        customerName: customerName,
                        lastcost: lastcost,
                        lastprofit: lastprofit,
                        inputyear: inputyear,
                        costperproduct:costperproduct,
                        profitperproduct:profitperproduct
                    });
                }

            });

            connection.release();

        });
    }
});
module.exports = router;