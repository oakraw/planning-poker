import { Box, Heading, Text, theme, VStack } from "@chakra-ui/react";
import { RoomState } from "../models/enum";

interface Props {
  name: string;
  point?: string;
  state?: RoomState;
  isOwner: boolean;
}

export const ParticipantVotedCard = ({
  point,
  name,
  state,
  isOwner,
}: Props) => {
  return (
    <VStack justifyContent="center">
      <Box
        p={4}
        shadow="md"
        minW="60px"
        minH="64px"
        borderRadius={8}
        background={
          state === RoomState.END
            ? theme.colors.white
            : state === RoomState.VOTING && point !== null
            ? theme.colors.blue[300]
            : theme.colors.gray[200]
        }
      >
        <Heading
          textAlign="center"
          fontSize="xl"
          style={{ visibility: state === RoomState.END ? "visible" : "hidden" }}
        >
          {point ?? 0}
        </Heading>
      </Box>
      {isOwner ? <Heading fontSize="lg">{name}</Heading> : <Text mt={4}>{name}</Text>}
    </VStack>
  );
};
