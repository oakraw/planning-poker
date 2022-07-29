import {
  Center,
} from "@chakra-ui/react";
import { RoomParticipantInfo } from "./room-participant-info";
import { RoomPokerTable } from "./room-poker-table";

export const Room = () => {
  return (
    <>
      <Center h="calc(100vh)">
        <RoomPokerTable />
      </Center>
      <RoomParticipantInfo showDialog={true} />
    </>
  );
};
