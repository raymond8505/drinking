import Rebase from 're-base';
import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyBqPifaPtgVVbc222q6U09NBRuHTn9ECr0",
    authDomain: "raymond-catch-of-the-day.firebaseapp.com",
    databaseURL: "https://raymond-catch-of-the-day.firebaseio.com",
    projectId: "raymond-catch-of-the-day",
    storageBucket: "raymond-catch-of-the-day.appspot.com",
    messagingSenderId: "425132188904",
    appId: "1:425132188904:web:04405d03ba6769cc5f555d",
    measurementId: "G-SJZ98PJSWE"
  });

const base = Rebase.createClass(firebaseApp.database());

export {firebaseApp};

export default base;