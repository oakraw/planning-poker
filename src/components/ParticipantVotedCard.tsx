import { Box, Heading, Text, theme, VStack } from "@chakra-ui/react";
import { RoomState } from "../models/enum";

interface Props {
  name: string;
  point?: number;
  state?: RoomState;
}

export const ParticipantVotedCard = ({ point, name, state }: Props) => {
  console.log("state", state);

  return (
    <VStack justifyContent="center">
      <Box
        p={4}
        shadow="md"
        borderRadius={8}
        background={
          state === RoomState.END
            ? theme.colors.white[50]
            : state === RoomState.VOTING && point !== null
            ? theme.colors.blue[300]
            : theme.colors.gray[100]
        }
      >
        <Heading
          fontSize="xl"
          style={{ visibility: state === RoomState.END ? "visible" : "hidden" }}
        >
          {point ?? 0}
        </Heading>
      </Box>
      <Text mt={4}>{name}</Text>
    </VStack>
  );
};
