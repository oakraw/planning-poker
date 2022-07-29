import { Center } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { RoomParticipantInfo } from "./room-participant-info";
import { RoomPokerTable } from "./room-poker-table";

export const Room = () => {
  const { roomId } = useParams();

  return (
    <>
      {roomId && (
        <>
          <Center h="calc(100vh)">
            <RoomPokerTable />
          </Center>
          <RoomParticipantInfo showDialog={true} roomId={roomId} />
        </>
      )}
    </>
  );
};
