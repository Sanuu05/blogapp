


// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
const { getAnalytics } = require("firebase/analytics");
// const {GoogleAuthProvider} = 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyD8JjD5XdEAhEmJtNza2CM_01gcj8RjaZY",
    authDomain: "twitter-238a1.firebaseapp.com",
    projectId: "twitter-238a1",
    storageBucket: "twitter-238a1.appspot.com",
    messagingSenderId: "897548042095",
    appId: "1:897548042095:web:4bc5d577fc3c52afc7729a",
    measurementId: "G-MS0EHN344E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
module.exports = app



// export const provider = new GoogleAuthProvider()

// const analytics = getAnalytics(app);