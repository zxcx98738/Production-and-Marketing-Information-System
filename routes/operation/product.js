var express = require('express');
var router = express.Router();
router.get('/',function(req,res){
    res.render('operation/product',{title:"Product"});
});
router.post('/',function(req,res){
    var productid=req.body['productid'];
    var amount=req.body['amount'];
    var checktime=req.body['checktime'];
    var pool =req.connection;
    pool.getConnection(function(err,connection){
        connection.query('SELECT productid FROM Product where productid=?',[productid],function(err,rows){
            if (err) {
                res.render('error', {
                    message: err.message,
                    error: err
                });
            }
            var cmd="INSERT INTO Product(productid,amount,checktime) VALUES(?,?,?)";
            connection.query(cmd,[productid,amount,checktime],function(err,result){
                if(err){
                    console.log(err);
                    res.redirect('/product');
                }else{
                    res.render('operation/product_redirect');
                }
            });
        });
    connection.release();
    });
});

module.exports=router;