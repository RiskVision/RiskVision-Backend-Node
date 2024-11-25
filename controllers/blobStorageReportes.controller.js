const blobStorageService = require('../services/bloblStorageReportes.service');

exports.listFiles = async (req, res) => {
  try {
    const path = req.query.path || ':1';
    const files = await blobStorageService.listFiles(path);
    res.json(files);
  } catch (error) {
    console.error('Error in listFiles controller:', error);
    res.status(500).json({ error: 'Failed to list files' });
  }
};

exports.uploadFile = async (req, res) => {
  try {
    const { path } = req.body;
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    await blobStorageService.uploadFile(path, file);
    res.json({ message: 'File uploaded successfully' });
  } catch (error) {
    console.error('Error in uploadFile controller:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
};

exports.deleteFile = async (req, res) => {
  try {
    const { path, fileName } = req.body;
    await blobStorageService.deleteFile(path, fileName);
    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Error in deleteFile controller:', error);
    res.status(500).json({ error: 'Failed to delete file' });
  }
};

exports.testConnection = async (req, res) => {
  try {
    const result = await containerClient.getProperties();
    res.json({ success: true, message: 'Connection successful', properties: result });
  } catch (error) {
    console.error('Error testing connection:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};