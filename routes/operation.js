var express = require('express');
var router = express.Router();
var operation = "作業管理";
router.get('/',function(req,res){
    res.render('operation',{title:operation});
});
module.exports = router;