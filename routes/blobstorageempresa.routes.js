const express = require('express');
const router = express.Router();
const multer = require('multer');
const blobStorageController = require("../controllers/blobStorageEmpresa.controller")
const upload = multer({ storage: multer.memoryStorage() });

router.get('/list', blobStorageController.listFiles);
router.post('/upload', upload.single('file'), blobStorageController.uploadFile);
router.delete('/delete', blobStorageController.deleteFile);
router.get('/test-connection', blobStorageController.testConnection);

module.exports = router;


module.exports = router;

