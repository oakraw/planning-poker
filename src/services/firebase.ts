import * as firebase from "firebase/app";
import * as firestoreUtils from "firebase/firestore";
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
import { Issue } from "../models/issue.model";
import { Participant } from "../models/participant.model";
import { Room } from "../models/room.model";
import { removeUndefined } from "../utils/object";

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

export const addIssueToRoom = async (
  roomId: string,
  issueTitle: string,
  issueId: string
) => {
  const ref = doc(firestore, `rooms/${roomId}/issues/${issueId}`);
  return setDoc(ref, {
    issueTitle,
    issueId,
    createdAt: firestoreUtils.Timestamp.fromDate(new Date()),
  });
};

export const updateIssueInRoom = async (
  roomId: string,
  issueId: string,
  isPin?: boolean,
  isLock?: boolean,
  point?: string
) => {
  const ref = doc(firestore, `rooms/${roomId}/issues/${issueId}`);

  const payload = removeUndefined({
    isPin,
    isLock,
    point,
  });

  return updateDoc(ref, payload);
};

export const removeIssueFromRoom = async (roomId: string, issueId: string) => {
  const ref = doc(firestore, `rooms/${roomId}/issues/${issueId}`);
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

export const observeIssues = (
  roomId: string,
  onUpdated: (issues: Issue[]) => void
) => {
  const ref = collection(firestore, `rooms/${roomId}/issues`);
  onSnapshot(ref, (snapshot) => {
    const issues = snapshot.docs.map((doc) => {
      const { issueId, issueTitle, point, isLock, isPin, createdAt } =
        doc.data();
      return {
        issueId,
        issueTitle,
        point,
        isPin,
        isLock,
        createdAt,
      };
    });
    onUpdated(issues);
  });
};
export default app;
