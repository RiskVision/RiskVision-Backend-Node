const express = require('express');
var router = express.Router();

const {
    sendPrompt,
} = require('../controllers/ai.controller');


router.route('/send-prompt')
    .post(sendPrompt);

module.exports = router;