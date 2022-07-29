import { createRoom as firebaseCreateRoom } from "../services/firebase";
import { addParticpantToRoom } from "../services/firebase";
import { generateUUID } from "../utils/uuid";

export const useCreateRoom = (): {
  createRoom: (roomName: string) => Promise<string>;
} => {
  const createRoom = async (roomName: string): Promise<string> => {
    const id = generateUUID();
    await firebaseCreateRoom(id, roomName).then(() => {});
    return id;
  };

  return { createRoom };
};

export const useAddParticipantToRoom = (): {
  addParticpant: (roomId: string, participantName: string) => Promise<string>;
  } => {
    const addParticpant = async (roomId: string, participantName: string): Promise<string> => {
      const id = generateUUID();
      await addParticpantToRoom(roomId, participantName, id).then(() => {});
      return participantName
    };
  
    return { addParticpant };
};

export const s = () => {};
