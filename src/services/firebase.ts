import * as firebase from "firebase/app";
import "firebase/firestore";
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { firebaseConfig } from "../config/firebase";
import { Participant } from "../models/participant.model";
import { Room } from "../models/room.model";

const app = firebase.initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export const createRoom = (roomId: string, roomName: string) => {
  const ref = doc(firestore, `rooms/${roomId}`);
  return setDoc(ref, {
    roomId,
    roomName,
    state: null,
  });
};

export const addParticpantToRoom = (
  roomId: string,
  participantName: string,
  participantId: string
) => {
  const ref = doc(firestore, `rooms/${roomId}/participants/${participantId}`);
  return setDoc(ref, {
    participantName,
    participantId,
    point: null,
  });
};

export const updateRoomInfo = (room: Room) => {
  const { roomId, roomName, state } = room;
  const ref = doc(firestore, `rooms/${roomId}`);
  return updateDoc(ref, {
    roomName,
    state,
  });
};

export const observeRoom = (
  roomId: string,
  onUpdated: (room: Room) => void
) => {
  const ref = doc(firestore, `rooms/${roomId}`);
  onSnapshot(ref, (doc) => {
    if (doc.data()) {
      const { roomId, roomName, state } = doc.data()!;
      onUpdated({ roomId, roomName, state });
    }
  });
};

export const observeParticpants = (
  roomId: string,
  onUpdated: (participants: Participant[]) => void
) => {
  const ref = collection(firestore, `rooms/${roomId}/participants`);
  onSnapshot(ref, (snapshot) => {
    const participants = snapshot.docs.map((doc) => {
      const { participantId, participantName, point } = doc.data();
      return {
        participantId,
        participantName,
        point,
      };
    });
    onUpdated(participants);
  });
};
export default app;
