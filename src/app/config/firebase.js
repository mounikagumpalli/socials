import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/database'
import 'firebase/auth'
import 'firebase/storage'

const firebaseConfig = {
    apiKey: "AIzaSyC3z0zZeABeYIWohhNyiiO75RymiSc0FsM",
    authDomain: "socials-e539f.firebaseapp.com",
    databaseURL: "https://socials-e539f.firebaseio.com",
    projectId: "socials-e539f",
    storageBucket: "socials-e539f.appspot.com",
    messagingSenderId: "323637149012",
    appId: "1:323637149012:web:fca63572b976874c91dcc1"
  };

  firebase.initializeApp(firebaseConfig)
  firebase.firestore();

  export default firebase

