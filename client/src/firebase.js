import firebase from 'firebase/app'
require('firebase/auth');

const firebaseConfig = {
    apiKey: "AIzaSyBILdLjlx2thhAYAGbVR-yaDNw5BCnZJIg",
    authDomain: "ecommerce-c2327.firebaseapp.com",
    projectId: "ecommerce-c2327",
    storageBucket: "ecommerce-c2327.appspot.com",
    messagingSenderId: "750027304681",
    appId: "1:750027304681:web:42e116dceae0c537b90a78"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();