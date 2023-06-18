import { useCallback } from "react";
import Cookies from "js-cookie";

const participantIdKey = "participantId"
const roomIdKey = "roomId"

export const useCookie = () => {
  const getSavedSession = useCallback(() => {
    const participantId = Cookies.get(participantIdKey);
    const roomId = Cookies.get(roomIdKey);
    return {
      savedParticipantId: participantId,
      savedRoomId: roomId,
    };
  }, []);

  const saveSession = useCallback(
    async (participantId: string, roomId: string) => {
      Cookies.set(participantIdKey, participantId);
      Cookies.set(roomIdKey, roomId);
    },
    []
  );

  return { getSavedSession, saveSession };
};
