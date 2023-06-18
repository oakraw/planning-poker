import {
  Center,
  Box,
  theme,
  VStack,
  Heading,
  HStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useObserveRoom, useVote } from "../../hooks/useApiCall";
import { RoomState } from "../../models/enum";
import { RoomCardDeck } from "./room-card-deck";
import { RoomCardResult } from "./room-card-result";
import { RoomParticipantInfo } from "./room-participant-info";
import { RoomPokerTable } from "./room-poker-table";
import { useCookie } from "../../hooks/useCookie";

export const Room = () => {
  const [participantId, setParticipantId] = useState<string>();
  const { roomId } = useParams();
  const room = useObserveRoom(roomId);
  const { vote } = useVote();

  const { getSavedSession } = useCookie();
  const { savedParticipantId, savedRoomId } = getSavedSession();

  useEffect(() => {
    if (savedParticipantId) {
      setParticipantId(savedParticipantId)
    }
  }, [savedParticipantId])

  return (
    <>
      {roomId && (
        <>
          <VStack
            w="calc(100vw)"
            h="calc(100vh)"
            background={theme.colors.gray[50]}
          >
            <HStack p={4} width={{ base: "100%" }}>
              <Heading fontSize="xl" mr={2}>
                ♠️ {room?.roomName}
              </Heading>
            </HStack>
            <Center alignItems="stretch" flexGrow={1}>
              {room && (
                <RoomPokerTable room={room} participantId={participantId} />
              )}
            </Center>

            {room?.state === RoomState.END ? (
              <RoomCardResult roomId={roomId} />
            ) : (
              <Box
                style={{
                  visibility:
                    room?.state === RoomState.VOTING ? "visible" : "hidden",
                }}
              >
                <RoomCardDeck
                  onSelectedCard={(card) => {
                    console.log(roomId, participantId, card);
                    if (roomId && participantId) {
                      vote(roomId, participantId, card);
                    }
                  }}
                />
              </Box>
            )}
          </VStack>
          <RoomParticipantInfo
            showDialog={savedRoomId !== roomId || !savedParticipantId}
            roomId={roomId}
            onParticipantCreated={setParticipantId}
          />
        </>
      )}
    </>
  );
};
