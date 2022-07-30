import { Center } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
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
          <Center h="calc(100vh)">
            {room && <RoomPokerTable room={room} />}
          </Center>
          <RoomParticipantInfo showDialog={true} roomId={roomId} />
        </>
      )}
    </>
  );
};
