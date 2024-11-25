const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue,  collection, getDoc, doc } = require('firebase-admin/firestore');
var admin = require("firebase-admin");
require('dotenv').config();
var serviceAccount = {
  type: process.env.TYPE,
  project_id: process.env.PROJECT_ID,
  private_key_id: process.env.PRIVATE_KEY_ID,
  private_key: process.env.PRIVATE_KEY,
  client_email: process.env.CLIENT_EMAIL,
  client_id:  process.env.CLIENT_ID,
  auth_uri:  process.env.AUTH_URI,
  token_uri: process.env.TOKEN_URI,
  auth_provider_x509_cert_url:  process.env.AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url:  process.env.CLIENT_X509_CERT_URL,
  universe_domain: process.env.UNIVERSE_DOMAIN
};


initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

const db = getFirestore();

module.exports = {db};