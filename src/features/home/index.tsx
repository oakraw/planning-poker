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
import { useCreateRoom } from "../../hooks/useApiCall";

export const Home = () => {
  const [roomName, setRoomName] = useState<string>();
  const { createRoom } = useCreateRoom();

  const oncCreateRoomClicked = useCallback(async () => {
    if (roomName) {
      const roomId = await createRoom(roomName);
      console.log("roomId", roomId);
    } else {
      console.log("roomName is null");
    }
  }, [roomName]);

  return (
    <Container>
      <Box textAlign="center" fontSize="xl">
        <Grid minH="100vh" p={3}>
          <VStack spacing={8}>
            <Text>Choose a name and a voting system for your game.</Text>
            <Input
              placeholder="Room's name"
              size="lg"
              onChange={(e) => setRoomName(e.target.value)}
            />
            <Button colorScheme="teal" size="lg" onClick={oncCreateRoomClicked}>
              Create room
            </Button>
          </VStack>
        </Grid>
      </Box>
    </Container>
  );
};
