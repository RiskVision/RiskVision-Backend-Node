const express = require('express');
var router = express.Router();
const {authenticateToken} = require('../jwUtils')

const {
    getReport,
} = require('../controllers/report.controller');

router.route('/getReport', authenticateToken)
    .get(getReport);

module.exports = router;