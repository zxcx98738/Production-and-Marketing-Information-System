var express = require('express');
var router = express.Router();
router.get('/',function(req,res){
    res.render('operation/order',{title:'Order'});
});
router.post('/',function(req,res){
    var orderid = req.body['orderid']; 
    var customerid = req.body['customerid'];
    var customerName = req.body['customerName'];
    var phonenumber = req.body['phonenumber'];
    var productid = req.body['productid'];
    var amount = req.body['amount'];
    var pay =req.body['pay'];
    var deadlineday = req.body['deadlineday'];
    var pool = req.connection;
    const onTime = () => {
        const date = new Date();
        const mm = date.getMonth() + 1;
        const dd = date.getDate();
        return [date.getFullYear(), "-" +
            (mm > 9 ? '' : '0') + mm, "-" +
            (dd > 9 ? '' : '0') + dd
        ].join('');
    }
    var orderday = onTime();
        pool.getConnection(function (err, connection) {
            connection.query('SELECT customerid FROM order_table WHERE orderid =?', [orderid,customerid], function (err, rows) {
                if (err) {
                    res.render('error', {
                    message: err.message,
                    error: err
                }); 
                }
                if (rows.length >= 1) {
                    res.render('operation/order', { warn: "The material has been checked!" });
                   
                } else {

                    var cmd = "INSERT INTO order_table(orderid,customerid,customerName,phonenumber,productid,amount,pay,orderday,deadlineday) VALUES(?,?,?,?,?,?,?,?,?)";
                        connection.query(cmd, [orderid,customerid, customerName, phonenumber, productid, amount, pay,orderday, deadlineday], function (err, result){
                            if (err) {
                                console.log(err);
                                res.redirect('/order');
                            }else{
                                res.render('operation/order_redirect');
                            }
                        });
                }
           
                
            });
        
        connection.release();
        });
});
module.exports=router;