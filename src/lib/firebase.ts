import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC4agHwyA8TP4BHOJwsvSRHLSPRp504Bk0",
  authDomain: "fithub-a295f.firebaseapp.com",
  projectId: "fithub-a295f",
  storageBucket: "fithub-a295f.appspot.com",
  messagingSenderId: "866126014622",
  appId: "1:866126014622:web:753f873bfffd3e9684b38f",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export default storage;
