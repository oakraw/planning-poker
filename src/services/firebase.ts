import * as firebase from "firebase/app";
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  onSnapshot,
  updateDoc,
  deleteDoc,
  getDocs,
  writeBatch,
  getCountFromServer,
} from "firebase/firestore";
import { firebaseConfig } from "../config/firebase";
import { RoomRole } from "../models/enum";
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

export const addParticpantToRoom = async (
  roomId: string,
  participantName: string,
  participantId: string
) => {
  const participants = collection(firestore, `rooms/${roomId}/participants`);
  const snapshot = getCountFromServer(participants);
  
  const count = (await snapshot).data().count;

  const ref = doc(firestore, `rooms/${roomId}/participants/${participantId}`);
  return setDoc(ref, {
    participantName,
    participantId,
    point: null,
    role: count > 0 ? RoomRole.MEMBER : RoomRole.HOST,
  });
};

export const removeParticipantFromRoom = async (
  roomId: string,
  participantId: string
) => {
  const ref = doc(firestore, `rooms/${roomId}/participants/${participantId}`);
  return deleteDoc(ref);
};

export const updateRoomInfo = (room: Room) => {
  const { roomId, roomName, state } = room;
  const ref = doc(firestore, `rooms/${roomId}`);
  return updateDoc(ref, {
    roomName,
    state,
  });
};

export const vote = (roomId: string, participantId: string, point?: string) => {
  const ref = doc(firestore, `rooms/${roomId}/participants/${participantId}`);
  return updateDoc(ref, {
    point,
  });
};

export const sendEmoji = (
  roomId: string,
  participantId: string,
  emoji?: string
) => {
  const ref = doc(firestore, `rooms/${roomId}/participants/${participantId}`);
  return updateDoc(ref, {
    emoji: {
      value: emoji,
      timeStamp: Date.now(),
    },
  });
};

export const clearPreviousSelectedPoint = async (roomId: string) => {
  const ref = collection(firestore, `rooms/${roomId}/participants`);
  const querySnapshot = await getDocs(ref);

  const batch = writeBatch(firestore);

  querySnapshot.forEach((data) => {
    const dataRef = doc(firestore, `rooms/${roomId}/participants/${data.id}`);
    batch.update(dataRef, { point: null });
  });

  return batch.commit();
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

export const observeParticipants = (
  roomId: string,
  onUpdated: (participants: Participant[]) => void
) => {
  const ref = collection(firestore, `rooms/${roomId}/participants`);
  onSnapshot(ref, (snapshot) => {
    const participants = snapshot.docs.map((doc) => {
      const { participantId, participantName, point, emoji, role } = doc.data();
      return {
        participantId,
        participantName,
        point,
        emoji,
        role,
      };
    });
    onUpdated(participants);
  });
};
export default app;
