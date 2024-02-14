import firebase from 'firebase/app';
import 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyAzXGVyZu68mHuhtpo7RDGm97bHWdA-nqU",
    authDomain: "luiz-carvalho-blog.firebaseapp.com",
    databaseURL: "https://luiz-carvalho-blog-default-rtdb.firebaseio.com",
    projectId: "luiz-carvalho-blog",
    storageBucket: "luiz-carvalho-blog.appspot.com",
    messagingSenderId: "167575705072",
    appId: "1:167575705072:web:b057fc0903bd1720c9f935",
    measurementId: "G-4F13C3MMTL"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase.database();
