import React, { createContext, useState } from 'react';
import * as firebase from 'firebase';

let database = null;
let storage = null;

const firebaseConfig = {
  apiKey: 'AIzaSyBxRZ3MW_gda65IAFbOvdNerGbNoAxzdTU',
  authDomain: 'testproject-dd0dd.firebaseapp.com',
  databaseURL: 'https://testproject-dd0dd.firebaseio.com',
  projectId: 'testproject-dd0dd',
  storageBucket: 'testproject-dd0dd.appspot.com',
  messagingSenderId: '708100004197',
  appId: '1:708100004197:web:a9fa5c9db703762f54698c',
  measurementId: 'G-0Z44QTL21P',
};

export const initializeFirebase = () => {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  // firebase
  //   .auth()
  //   .setPersistence(firebase.auth.Auth.Persistence.LOCAL);
};

export const fire = async () => {
  database = await firebase.database();
};

export const firestorage = () => {
  storage = firebase.storage();
};

export const getImageURL = async (fileName) => {
  const storageRef = await storage.ref();
  const imageRef = await storageRef.child('images');
  fileName = 'girl.jpg';
  const fileRef = await imageRef
    .child(fileName)
    .getDownloadURL();

  return fileRef;
};

export const getFireDB = () => {
  return database.ref('/').once('value');
};

export const setMemo = async (title, desc) => {
  const res = await getFireDB();

  database.ref('/memos/' + res.val().memos.length).set({
    desc,
    title,
  });
};

//////////////log in
export const addOnAuthChange = (setUser) => {
  firebase.auth().onAuthStateChanged((connectedUser) => {
    if (connectedUser != null) {
      setUser(connectedUser);
    }
  });
};

export const logIn = () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  provider.addScope(
    'https://www.googleapis.com/auth/contacts.readonly',
  );
  //firebase.auth().languageCode = 'pt';
  provider.setCustomParameters({
    login_hint: 'user@example.com',
  });

  try {
    firebase.auth().signInWithPopup(provider);
  } catch (error) {
    // Handle Errors here.
    // var errorCode = error.code;
    // var errorMessage = error.message;
    // The email of the user's account used.
    // var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    // var credential = error.credential;
    // ...

    return error;
  }
};
////////////////////

//////////////log out
export const logOut = () => {
  firebase
    .auth()
    .signOut()
    .then(function () {
      // Sign-out successful.
    })
    .catch(function (error) {
      // An error happened.
    });
};
/////////////////////

/////////////////context
export const FirebaseContext = createContext();

export const FirebaseProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const context = {
    user,
    setUser,
  };

  return (
    <FirebaseContext.Provider value={context}>
      {children}
    </FirebaseContext.Provider>
  );
};

////////////////////////
