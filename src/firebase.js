import { initializeApp } from "firebase/app";
import {
  confirmPasswordReset,
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

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

export const signInWithGoogle = () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      const name = result.user.displayName;
      const email = result.user.email;
    })
    .catch((error) => {
      console.log(error);
    });
};
