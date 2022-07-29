import * as React from "react";
import { useCallback, useState } from "react";
import {
  Box,
  Text,
  VStack,
  Grid,
  Button,
  Input,
  Container,
} from "@chakra-ui/react";
import { useParams } from "react-router";
import { RoomParticipantInfo } from "./room-participant-info";
import { useAddParticipantToRoom } from "../../hooks/useApiCall";

export const Room = () => {
  const { roomId } = useParams();
  const { addParticpant } = useAddParticipantToRoom();
  const [participantName] = useState<string>();

  const addParticpantToRoom = useCallback(async () => {
    if (participantName) {
      const participants = await addParticpant(`${roomId}`, participantName);
      console.log("roomId", participants);
    } else {
      console.log("roomName is null");
    }
  }, [participantName]);
  // todo read params roomId
  return (
    <>
      <Container>{roomId}</Container>
      <RoomParticipantInfo showDialog={true}/>
    </>
  );
};
