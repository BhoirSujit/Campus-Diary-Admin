//firebase
const admin = require('firebase-admin');
const credentials = require('./campus-diary-33019-firebase-adminsdk-xbfhv-29b6203fb5.json')

admin.initializeApp(
    {
        credential: admin.credential.cert(credentials)
    }
);

const db = admin.firestore();

module.exports=  db;
  