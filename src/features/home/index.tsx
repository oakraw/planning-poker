import * as React from "react";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { useCreateRoom } from "../../hooks/useApiCall";

export const Home = () => {
  const navigate = useNavigate();

  const [roomName, setRoomName] = useState<string>();
  const { createRoom } = useCreateRoom();

  const oncCreateRoomClicked = useCallback(async () => {
    if (roomName) {
      const roomId = await createRoom(roomName);
      navigate(`room/${roomId}`);
    } else {
      console.log("roomName is null");
    }
  }, [createRoom, navigate, roomName]);

  return (
    <Container>
      <Center h="calc(100vh)">
        <Box textAlign="center" fontSize="xl">
          <Grid p={3}>
            <VStack spacing={8}  width={{ base: "100%", md:"24em" }}>
              <Text>Choose a name for your game.</Text>
              <Input
                placeholder="Room's name"
                size="lg"
                onChange={(e) => setRoomName(e.target.value)}
              />
              <Button
                colorScheme="blue"
                size="lg"
                width={{ base: "100%" }}
                onClick={oncCreateRoomClicked}
              >
                Create room
              </Button>
            </VStack>
          </Grid>
        </Box>
      </Center>
    </Container>
  );
};
