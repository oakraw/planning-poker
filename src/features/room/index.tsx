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
  Center,
} from "@chakra-ui/react";
import { useParams } from "react-router";
import { RoomParticipantInfo } from "./room-participant-info";
import { RoomPokerTable } from "./room-poker-table";

export const Room = () => {
  const { roomId } = useParams();
  // todo read params roomId

  return (
    <>
      <Center h="calc(100vh)">
        <RoomPokerTable />
      </Center>
      <RoomParticipantInfo showDialog={true} />
    </>
  );
};
