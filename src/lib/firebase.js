import firebaseAdmin from 'firebase-admin';

const firebase = {
  init(databaseUrl, serviceAccount) {
    const firebaseConfig = {
      databaseURL: databaseUrl,
      credential: firebaseAdmin.credential.cert(serviceAccount),
    };
    firebaseAdmin.initializeApp(firebaseConfig);
  },
  ref(databasePath) {
    return firebaseAdmin.database().ref(databasePath);
  },
};

export default firebase;
