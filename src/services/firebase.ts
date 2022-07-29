import * as firebase from "firebase/app";
import "firebase/firestore";
import {
  getFirestore,
  doc,
  setDoc,
} from "firebase/firestore";
import { firebaseConfig } from "../config/firebase";

const app = firebase.initializeApp(firebaseConfig);

export const createRoom = (roomId: string, roomName: string) => {
  const firestore = getFirestore(app);
    const ref = doc(firestore, `rooms/${roomId}`);
    return setDoc(ref, {
      roomId,
      roomName,
      state: null,
    });
};

export const addParticpantToRoom = (roomId: string, particpantName: string) => {
    // TODO
}

export default app;
