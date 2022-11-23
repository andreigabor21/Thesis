// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
import {getFirestore} from "firebase/firestore";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAP_9n_HB7-M2MYQKGCQLsVWhW470lPz7k",
    authDomain: "house-marketplace-app-610bf.firebaseapp.com",
    projectId: "house-marketplace-app-610bf",
    storageBucket: "house-marketplace-app-610bf.appspot.com",
    messagingSenderId: "401735810476",
    appId: "1:401735810476:web:ecfbdc8199d5fdb3944e09"
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore()