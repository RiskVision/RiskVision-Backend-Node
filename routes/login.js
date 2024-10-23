const express = require('express')
const router = express.Router();

const controller = require('../controllers/login')

router.post('/',controller.login)
router.post('/register', controller.addUser)
router.get('/',controller.getAllUsers)

module.exports = router