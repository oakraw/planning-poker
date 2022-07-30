import { Center, Container, HStack, Text, VStack } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { Card } from "../../components/Card";
import { useObserveRoom } from "../../hooks/useApiCall";
import { RoomParticipantInfo } from "./room-participant-info";
import { RoomPokerTable } from "./room-poker-table";

export const Room = () => {
  const { roomId } = useParams();
  const room = useObserveRoom(roomId);
  console.log(room);
  return (
    <>
      {roomId && (
        <>
          <VStack h="calc(100vh)">
            <Center alignItems="stretch" flexGrow={1}>{room && <RoomPokerTable room={room} />}</Center>
            <HStack justify="center">
              <Card>
                <Text>Hi</Text>
              </Card>
            </HStack>
          </VStack>
          {/* <RoomParticipantInfo showDialog={true} roomId={roomId} /> */}
        </>
      )}
    </>
  );
};
