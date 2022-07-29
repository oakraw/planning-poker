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

export const Room = () => {
  const { roomId } = useParams();
  // todo read params roomId
  return (
    <>
      <Container>{roomId}</Container>
      <RoomParticipantInfo showDialog={true}/>
    </>
  );
};
