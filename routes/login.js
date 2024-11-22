const express = require('express')
const router = express.Router();
const {authenticateToken} = require('../jwUtils')

const controller = require('../controllers/login');
const { from } = require('readable-stream');

router.post('/',controller.login)
router.post('/register', authenticateToken, controller.addUser)
router.get('/',authenticateToken, controller.getAllUsers)
router.put('/',authenticateToken, controller.updateUser)
router.delete('/',authenticateToken, controller.deleteUser)

module.exports = router