const { BlobServiceClient } = require('@azure/storage-blob');

const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
const CONTAINER_NAME = process.env.AZURE_STORAGE_CONTAINER_NAME_REPORT;

let blobServiceClient;
let containerClient;

try {
  blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
  containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);
  console.log('Connected to Azure Blob Storage successfully.');
} catch (error) {
  console.error('Failed to connect to Azure Blob Storage:', error.message);
  throw error;
}

exports.listFiles = async (path) => {
  console.log(`Listing files in path: ${path}`);
  const files = [];
  try {
    for await (const item of containerClient.listBlobsByHierarchy(path)) {
      files.push({
        name: item.name,
        type: item.kind === 'prefix' ? 'folder' : 'file',
        size: item.properties?.contentLength ? `${(item.properties.contentLength / 1024 / 1024).toFixed(2)} MB` : '-',
      });
    }
    console.log(`Successfully listed files in path: ${path}`);
  } catch (error) {
    console.error(`Failed to list files in path: ${path}`, error.message);
    throw error;
  }
  return files;
};

exports.uploadFile = async (path, file) => {
  const blobName = path ? `${path}/${file.originalname}` : file.originalname;
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  console.log(`Uploading file: ${blobName}`);
  try {
    await blockBlobClient.upload(file.buffer, file.size);
    console.log(`Successfully uploaded file: ${blobName}`);
  } catch (error) {
    console.error(`Failed to upload file: ${blobName}`, error.message);
    throw error;
  }
};

exports.deleteFile = async (path, fileName) => {
  const blobName = path ? `${path}/${fileName}` : fileName;
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  console.log(`Deleting file: ${blobName}`);
  try {
    await blockBlobClient.delete();
    console.log(`Successfully deleted file: ${blobName}`);
  } catch (error) {
    console.error(`Failed to delete file: ${blobName}`, error.message);
    throw error;
  }
};
