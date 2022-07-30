import { useState, useEffect, useRef } from "react";
import { Participant } from "../models/participant.model";
import { Room } from "../models/room.model";
import { createRoom as firebaseCreateRoom, observeParticpants, observeRoom } from "../services/firebase";
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
  addParticpant: (roomId: string, participantName: string) => Promise<string>;
} => {
  const addParticpant = async (
    roomId: string,
    participantName: string
  ): Promise<string> => {
    const id = generateUUID();
    await addParticpantToRoom(roomId, participantName, id);
    return participantName;
  };

  return { addParticpant };
};

export const useObserveRoom = (roomId: string | undefined): Room | undefined => {
  const [room, setRoom] = useState<Room>();
  const isInitialRender = useRef(false);

  useEffect(() => {
    const execute = async () => {
      isInitialRender.current = true;

      await observeRoom(roomId!, (room: Room) => {
        setRoom(room)
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

      await observeParticpants(roomId, (response) => {
        setParticipants(response);
      });
    };

    if (!isInitialRender.current) {
      execute();
    }
  }, [roomId]);

  return participants;
};
