var express = require('express');
var router = express.Router();
//var schedule = "排程";
router.get('/', function (req, res) {
    res.render('Marketing/Orderpredict', { title: "Prediction" });
});
module.exports = router;