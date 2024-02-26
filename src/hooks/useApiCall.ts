import { useState, useEffect, useRef } from "react";
import { Issue } from "../models/issue.model";
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
  removeParticipantFromRoom,
  addIssueToRoom,
  observeIssues,
  removeIssueFromRoom,
  updateIssueInRoom,
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

export const useRemoveParticipantFromRoom = (): {
  removeParticipant: (roomId: string, participantId: string) => Promise<string>;
} => {
  const removeParticipant = async (
    roomId: string,
    participantId: string
  ): Promise<string> => {
    await removeParticipantFromRoom(roomId, participantId);
    return participantId;
  };

  return { removeParticipant };
};

export const useAddIssueToRoom = (): {
  addIssue: (roomId: string, issueTitle: string) => Promise<string>;
} => {
  const addIssue = async (
    roomId: string,
    issueTitle: string
  ): Promise<string> => {
    const id = generateUUID();
    await addIssueToRoom(roomId, issueTitle, id);
    return id;
  };

  return { addIssue };
};

export const useUpdateIssueInRoom = (): {
  patchIssue: (
    roomId: string,
    issueId: string,
    isPin?: boolean,
    isLock?: boolean,
    point?: string
  ) => Promise<string>,
  updateIssue: (
    roomId: string,
    issue: Issue,
  ) => Promise<string>;
} => {
  const patchIssue = async (
    roomId: string,
    issueId: string,
    isPin?: boolean,
    isLock?: boolean,
    point?: string
  ): Promise<string> => {
    await updateIssueInRoom(roomId, issueId, isPin, isLock, point);
    return issueId;
  };

  const updateIssue = async (
    roomId: string,
    issue: Issue,
  ): Promise<string> => {
    await updateIssueInRoom(roomId, issue.issueId, issue.isPin, issue.isLock, issue.point, issue.issueTitle);
    return issue.issueId;
  };

  return { patchIssue, updateIssue };
};

export const useRemoveIssueFromRoom = (): {
  removeIssue: (roomId: string, issueId: string) => Promise<string>;
} => {
  const removeIssue = async (
    roomId: string,
    issueId: string
  ): Promise<string> => {
    await removeIssueFromRoom(roomId, issueId);
    return issueId;
  };

  return { removeIssue };
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

export const useObserveIssues = (roomId: string): Issue[] => {
  const [issues, seIssues] = useState<Issue[]>([]);
  const isInitialRender = useRef(false);

  useEffect(() => {
    const execute = async () => {
      isInitialRender.current = true;

      await observeIssues(roomId, (response) => {
        const sortedIssues = response
          .sort((a, b) => {
            const dateA = a.createdAt ?? new Date();
            const dateB = b.createdAt ?? new Date();

            return dateB.getTime() - dateA.getTime();
          })
          .sort((a, b) => (a.isPin === b.isPin ? 0 : a.isPin ? -1 : 1));

        seIssues(sortedIssues);
      });
    };

    if (!isInitialRender.current) {
      execute();
    }
  }, [roomId]);

  return issues;
};
