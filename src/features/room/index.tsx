import { Center, Box, theme, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useObserveRoom, useVote } from "../../hooks/useApiCall";
import { RoomState } from "../../models/enum";
import { RoomCardDeck } from "./room-card-deck";
import { RoomCardResult } from "./room-card-result";
import { RoomParticipantInfo } from "./room-participant-info";
import { RoomPokerTable } from "./room-poker-table";

export const Room = () => {
  const [participantId, setParticipantId] = useState<string>();
  const { roomId } = useParams();
  const room = useObserveRoom(roomId);
  const { vote } = useVote();

  console.log(room);
  return (
    <>
      {roomId && (
        <>
          <VStack
            w="calc(100vw)"
            h="calc(100vh)"
            background={theme.colors.gray[50]}
          >
            <Center alignItems="stretch" flexGrow={1}>
              {room && <RoomPokerTable room={room} />}
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
            showDialog={true}
            roomId={roomId}
            onParticipantCreated={setParticipantId}
          />
        </>
      )}
    </>
  );
};
