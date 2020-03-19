var express = require('express');
var router = express.Router();
router.get('/', function (req, res) {
    res.render('marketing', { title: 'Marketing' });
});
module.exports = router;