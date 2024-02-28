import { useCallback } from "react";
import Cookies from "js-cookie";
import { Session } from "../models/session.model";

const deprecatedParticipantIdKey = "participantId";
const deprecatedRoomIdKey = "roomId";

const sessionKey = "sessions";

export const useCookie = () => {
  const getSavedSession = useCallback((roomId: string | undefined) => {
    // migrate logic
    let savedParticipantId = Cookies.get(deprecatedParticipantIdKey);
    let savedRoomId = Cookies.get(deprecatedRoomIdKey);
    if (savedRoomId && savedParticipantId) {
      doSaveSession(savedParticipantId, savedRoomId)
      Cookies.remove(deprecatedParticipantIdKey)
      Cookies.remove(deprecatedRoomIdKey)
    }

    const cookies = Cookies.get(sessionKey);

    if (cookies) {
      const sessions = JSON.parse(cookies) as Session[];
      const savedSession = sessions.find((item) => item.roomId === roomId);
      if (savedSession) {
        savedParticipantId = savedSession.participantId;
        savedRoomId = savedSession.roomId;
      }
    }

    return {
      savedParticipantId: savedParticipantId,
      savedRoomId: savedRoomId,
    };
  }, []);

  const doSaveSession = (participantId: string, roomId: string) => {
      const cookies = Cookies.get(sessionKey);

      const newSession = {
        participantId,
        roomId,
      };

      if (cookies) {
        const sessions = JSON.parse(cookies) as Session[];
        sessions.push(newSession);
        Cookies.set(sessionKey, JSON.stringify(sessions));
      } else {
        Cookies.set(sessionKey, JSON.stringify([newSession]));
      }
    }

  const saveSession = useCallback(
   (participantId: string, roomId: string) => {
      doSaveSession(participantId, roomId)
    },
    []
  );

  return { getSavedSession, saveSession };
};
