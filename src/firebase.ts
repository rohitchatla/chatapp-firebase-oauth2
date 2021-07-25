import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/database";
import "firebase/auth";

var firebaseConfig = {
  apiKey: "AIzaSyAx0h2EBovgjozRCqgAQFs94vhbs0Q1K1M",
  authDomain: "oauthchatapp2.firebaseapp.com",
  databaseURL: "https://oauthchatapp2.firebaseio.com",
  projectId: "oauthchatapp2",
  storageBucket: "oauthchatapp2.appspot.com",
  messagingSenderId: "151299949125",
  appId: "1:151299949125:web:d316086a3dee2d2dc4992c",
  measurementId: "G-FZ7XBP2J5K",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const rtdb = firebase.database();

const setupPresence = (user: any) => {
  const isOfflineForRTDB = {
    state: "offline",
    lastChanged: firebase.database.ServerValue.TIMESTAMP,
  };
  const isOnlineForRTDB = {
    state: "online",
    lastChanged: firebase.database.ServerValue.TIMESTAMP,
  };
  const isOfflineForFirestore = {
    state: "offline",
    lastChanged: firebase.firestore.FieldValue.serverTimestamp(),
  };
  const isOnlineForFirestore = {
    state: "online",
    lastChanged: firebase.firestore.FieldValue.serverTimestamp(),
  };
  const rtdbRef = rtdb.ref(`/status/${user.uid}`);
  const userDoc = db.doc(`/users/${user.uid}`);

  rtdb.ref(".info/connected").on("value", async (snapshot: any) => {
    if (snapshot.val() === false) {
      userDoc.update({
        status: isOfflineForFirestore,
      });
      return;
    }

    await rtdbRef.onDisconnect().set(isOfflineForRTDB);
    rtdbRef.set(isOnlineForRTDB);
    userDoc.update({
      status: isOnlineForFirestore,
    });
  });
};

export { db, firebase, setupPresence };
