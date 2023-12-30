import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import axios from "axios";

const firebaseConfig = {
  apiKey: "AIzaSyAGYInm2i6KE9TMMgAkdKrEkf2ieX_ZYKU",
  authDomain: "crypto-boar.firebaseapp.com",
  projectId: "crypto-boar",
  storageBucket: "crypto-boar.appspot.com",
  messagingSenderId: "972824804417",
  appId: "1:972824804417:web:0c40acc374f485e23adac0",
  measurementId: "G-M1XB8K36YH",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const uid = user.uid;

    // Include the uid in the request data
    const requestData = {
      uid: uid,
      // other data you want to send
    };

    // Make a POST request to your backend
    const response = await axios.post(
      "https://crypto-board-1-399420.uc.r.appspot.com//check_user",
      requestData
    );

    // Handle the response as needed
    console.log(response.data);

    return true; // Successful sign-in
  } catch (error) {
    console.error(error);
    return false; // Sign-in failed
  }
};

export const signOutUser = () => {
  try {
    signOut(auth);
    console.log("Sign-out successful");
  } catch (error) {
    console.error("Error signing out:", error);
  }
};
