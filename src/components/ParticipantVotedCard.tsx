import { Box, Heading, Text, VStack } from "@chakra-ui/react";
import { title } from "process";

interface Props {
  name: string;
  point?: number;
}

export const ParticipantVotedCard = ({ point, name }: Props) => {
  return (
    <VStack justifyContent="center">
      <Box p={4} shadow="md" borderWidth="1px" borderRadius={8}>
        <Heading fontSize="xl">{point ?? 0}</Heading>
      </Box>
      <Text mt={4}>{name}</Text>
    </VStack>
  );
};
