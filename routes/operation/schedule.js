var express = require('express');
var router = express.Router();
//var OrderList = require('../controllers/order/order_list_controller');
//var orderList = new OrderList();
//router.get('/orderList', orderList.getOrderList);
//router.get('/orderMonthList', orderList.getMonthList);
//var schedule = "排程";

router.post('/',function(req,res){
    var productid=req.body['productid'];
    var pool=req.connection;
    
    pool.getConnection(function(err,connection){
    //從資料庫查詢某productid相關資料
        connection.query('SELECT productid FROM order_table WHERE productid=?',[productid],function(err,rows){
            if (err) {
                res.render('err', {
                    message: err.message,
                    error: err
                });
            }
            if(rows.length>=1){
                //req.session.orderid=req.body['orderid'];
                req.session.productid=req.body['productid'];
                req.session.aomunt=req.body['amount'];
                req.session.orderday=req.body['orderday'];
                req.session.deadlineday=req.body['deadlinday'];
                res.redirect('/schedule');
            }
        });
    });
});
router.get('/',function(req,res){
    //res.render('operation/schedule',{title:schedule});
    var pool=req.connection;   
    //var data="";
        //確認產品代碼是否存在
        if(!req.session.productid){
            res.render('operation/schedule',{warn:"Productid not found or no records!"})
        }else{
            pool.getConnection(function(err,connection){
                //連到資料庫搜尋該productid的訂購量
                connection.query('SELECT * FROM order_table WHERE productid=? ORDER BY orderday ASC', [req.session.productid,req.session.amount,req.session.orderday,req.session.deadlineday],function(err,rows){
                    
                    if (err) {
                        res.render('err', {
                            message: err.message,
                            error: err
                    });
                        
                    }
                    //var data= rows;
                    //   res.render('operation/schedule',{title:'Order',data:data});
                                
                    else{
                        var productid =rows[0].productid;
                        var amount = rows.amount;
                        var orderday = rows.orderday;
                        var deadlineday = rows.deadlineday;
                            
                            var totalamount=0;
                            for(i=0;i<rows.length;i++){
                                totalamount+=rows[i].amount;
                                 
                            var averageamount=totalamount/4;
                            var produceamount=averageamount;
                            }
                                
                        res.render('operation/schedule', {
                            session: req.session.productid,
                            productid: productid,
                            amount: amount,
                            orderday: orderday,
                            deadlineday: deadlineday,
                            totalamount:totalamount,
                            produceamount:produceamount,
                            firstweek:produceamount,
                            secondweek: produceamount,
                            thirdweek: produceamount,
                            lastweek: produceamount


                            
                        });
                            
                    }
                  
                });
           
        connection.release();
            
        });
    }
});

module.exports=router;