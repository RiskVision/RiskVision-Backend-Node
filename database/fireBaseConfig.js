import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp, FieldValue } from 'firebase-admin/firestore';
import admin from 'firebase-admin';
import serviceAccount from './creds.json' assert { type: 'json' };

initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = getFirestore();

export default db;
