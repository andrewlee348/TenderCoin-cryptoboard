import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import axios from "axios";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
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
      "http://localhost:5001/check_user",
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
