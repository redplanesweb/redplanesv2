import firebase from "firebase";
import "firebase/analytics";

const firebaseConfig = {
  // apiKey: "AIzaSyCAZCDWo6V-j7j-l4U4PYksRGZQ6VOPmAI",
  // authDomain: "red-planes-66ada.firebaseapp.com",
  // databaseURL: "https://red-planes-66ada.firebaseio.com",
  // projectId: "red-planes-66ada",
  // storageBucket: "red-planes-66ada.appspot.com",
  // messagingSenderId: "492770377202",
  // appId: "1:492770377202:web:2cb73ea96877e356e7bf6b",
  // measurementId: "G-84M9G5E8QK"
  apiKey: "AIzaSyCsSKnOLZSWNxqobn_MejmIZgesOArnLzs",
  authDomain: "planesredproject.firebaseapp.com",
  databaseURL: "https://planesredproject-default-rtdb.firebaseio.com",
  projectId: "planesredproject",
  storageBucket: "planesredproject.appspot.com",
  messagingSenderId: "318219840684",
  appId: "1:318219840684:web:6eabbaaaf640d34b9e0309",
  measurementId: "G-K386MXSKHW",
};

// Make sure we are not initializing before window object loads
if (typeof window !== "undefined" && !firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  if ("measurementId" in firebaseConfig) firebase.analytics();
}

export default firebase;
