import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import "firebase/compat/analytics";
import "firebase/compat/messaging";
import "firebase/compat/storage";
//import { enableIndexedDbPersistence } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCquQX8Cu5ehE8HeH57MvdYr69RCY5qpMI",
    authDomain: "degreebarrestaurant.firebaseapp.com",
    projectId: "degreebarrestaurant",
    storageBucket: "degreebarrestaurant.appspot.com",
    messagingSenderId: "826305625368",
    appId: "1:826305625368:web:2bc9d4c4211eb65741726d",
    measurementId: "G-RX1PGKFV1N"
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();

const messaging = firebase.messaging();
const db = firebase.firestore();
db.settings({
    cacheSizeBytes:firebase.firestore.CACHE_SIZE_UNLIMITED
})
db.enablePersistence().catch((err)=>{
    if (err.code == 'failed-precondition') {
        console.log('failed')
    } else if (err.code == 'unimplemented'){
        console.log('unimplemented')
    }
})

const storage = firebase.storage();
const timestamp = firebase.firestore.FieldValue.serverTimestamp();
// enableIndexedDbPersistence(db)
//     .catch((err) => {
//         if (err.code == 'failed-precondition') {
//             console.log('failed')
//         } else if (err.code == 'unimplemented'){
//             console.log('unimplemented')
//         }
//});
export {timestamp, firebase, storage, messaging};
export  default db;