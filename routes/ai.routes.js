const express = require('express');
var router = express.Router();

const {
    sendPrompt,
} = require('../controllers/ai.controller');
const { authenticateToken } = require('../jwUtils');


router.route('/send-prompt', authenticateToken)
    .post(sendPrompt);

module.exports = router;