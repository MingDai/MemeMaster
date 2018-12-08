import firebase from 'firebase'

const config = {
  apiKey: "AIzaSyAlyX8V0U3ub5_vjCFjS4w6ewUbf5YCqYY",
  authDomain: "meme-master-a0d52.firebaseapp.com",
  databaseURL: "https://meme-master-a0d52.firebaseio.com",
  projectId: "meme-master-a0d52",
  storageBucket: "meme-master-a0d52.appspot.com",
  messagingSenderId: "859907644023"
};
firebase.initializeApp(config);
export default firebase;