import { initializeApp } from "firebase/app";
import firebase from "firebase/app"
import "firebase/database"

const firebaseConfig = {
    apiKey: "AIzaSyAZay7RneRKJGmH1FLd3bU-lOA-ynKKJgQ",
    authDomain: "captura-de-dados-e7b1f.firebaseapp.com",
    databaseURL: "https://captura-de-dados-e7b1f-default-rtdb.firebaseio.com",
    projectId: "captura-de-dados-e7b1f",
    storageBucket: "captura-de-dados-e7b1f.appspot.com",
    messagingSenderId: "1042983865370",
    appId: "1:1042983865370:web:3153317872b79eb10fd5a3",
    measurementId: "G-DTK3C2N9Y1"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
} else {
    firebase.app()
}

const database = firebase.database()

export {database, firebase}