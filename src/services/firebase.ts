import * as firebase from "firebase/app";
import "firebase/firestore";
import {
  getFirestore,
  doc,
  setDoc,
} from "firebase/firestore";
import { firebaseConfig } from "../config/firebase";

const app = firebase.initializeApp(firebaseConfig);

export const createRoom = async (roomId: string, roomName: string) => {
  const firestore = getFirestore(app);
    const ref = doc(firestore, `rooms/${roomId}`);
    return setDoc(ref, {
      roomId,
      roomName,
      state: null,
    });
};

export default app;
