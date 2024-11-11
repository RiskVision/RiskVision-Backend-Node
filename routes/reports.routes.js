const express = require('express');
var router = express.Router();

const {
    getReport,
} = require('../controllers/report.controller');

router.route('/getReport')
    .get(getReport);

module.exports = router;