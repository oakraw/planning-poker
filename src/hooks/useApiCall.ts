import { useState, useEffect, useRef } from "react";
import { Participant } from "../models/participant.model";
import { Room } from "../models/room.model";
import {
  createRoom as firebaseCreateRoom,
  updateRoomInfo as firebaseUpdateRoomInfo,
  vote as firebaseVote,
  sendEmoji as firebaseSendEmoji,
  observeParticipants,
  observeRoom,
  clearPreviousSelectedPoint,
} from "../services/firebase";
import { addParticpantToRoom } from "../services/firebase";
import { generateUUID } from "../utils/uuid";

export const useCreateRoom = (): {
  createRoom: (roomName: string) => Promise<string>;
} => {
  const createRoom = async (roomName: string): Promise<string> => {
    const id = generateUUID();
    await firebaseCreateRoom(id, roomName);
    return id;
  };

  return { createRoom };
};

export const useAddParticipantToRoom = (): {
  addParticipant: (roomId: string, participantName: string) => Promise<string>;
} => {
  const addParticipant = async (
    roomId: string,
    participantName: string
  ): Promise<string> => {
    const id = generateUUID();
    await addParticpantToRoom(roomId, participantName, id);
    return id;
  };

  return { addParticipant };
};

export const useVote = (): {
  vote: (
    roomId: string,
    participantId: string,
    point?: string
  ) => Promise<void>;
} => {
  const vote = async (
    roomId: string,
    participantId: string,
    point?: string
  ): Promise<void> => {
    await firebaseVote(roomId, participantId, point);
  };

  return { vote };
};

export const useSendEmoji = (): {
  sendEmoji: (
    roomId: string,
    participantId: string,
    emoji?: string
  ) => Promise<void>;
} => {
  const sendEmoji = async (
    roomId: string,
    participantId: string,
    emoji?: string
  ): Promise<void> => {
    await firebaseSendEmoji(roomId, participantId, emoji);
  };

  return { sendEmoji };
};

export const useClearVote = (): {
  clearVote: (roomId: string) => Promise<void>;
} => {
  const clearVote = async (roomId: string): Promise<void> => {
    await clearPreviousSelectedPoint(roomId);
  };

  return { clearVote };
};

export const useUpdateRoomInfo = (): {
  updateRoomInfo: (room: Room) => Promise<Room>;
} => {
  const updateRoomInfo = async (room: Room): Promise<Room> => {
    await firebaseUpdateRoomInfo(room);
    return room;
  };

  return { updateRoomInfo };
};

export const useObserveRoom = (
  roomId: string | undefined
): Room | undefined => {
  const [room, setRoom] = useState<Room>();
  const isInitialRender = useRef(false);

  useEffect(() => {
    const execute = async () => {
      isInitialRender.current = true;

      await observeRoom(roomId!, (room: Room) => {
        setRoom(room);
      });
    };

    if (!isInitialRender.current && roomId) {
      execute();
    }
  }, [roomId]);

  return room;
};

export const useObserveParticipants = (roomId: string): Participant[] => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const isInitialRender = useRef(false);

  useEffect(() => {
    const execute = async () => {
      isInitialRender.current = true;

      await observeParticipants(roomId, (response) => {
        setParticipants(response);
      });
    };

    if (!isInitialRender.current) {
      execute();
    }
  }, [roomId]);

  return participants;
};
