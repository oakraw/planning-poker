import { HStack, Heading, theme, Box, Text } from "@chakra-ui/react";
import { Card } from "../../../components/Card";
import { useObserveParticipants } from "../../../hooks/useApiCall";

interface Props {
  roomId: string;
}

export const RoomCardResult = ({ roomId }: Props) => {
  const participants = useObserveParticipants(roomId);

  let result: Map<string, number> = new Map<string, number>();
  participants?.forEach((participant) => {
    const point = participant.point;
    if (point !== null && point !== undefined) {
      result.set(point, (result.get(point) ?? 0) + 1);
    }
  });


  return (
    <HStack py={4}>
      <Heading fontSize="xl" mr={8}>Voting Result</Heading>
      {Array.from(result.keys()).map((card, index) => (
        <Card
          key={index}
          py={8}
          minW={16}
          position="relative"
          textAlign="center"
        >
          <Heading fontSize="xl">{card}</Heading>
          <Box
            position="absolute"
            right={0}
            top={0}
            borderRadius={56}
            px={2}
            m={1}
            background={theme.colors.blue[500]}
          >
            <Text color="white">{result.get(card) ?? 0}</Text>
          </Box>
        </Card>
      ))}
    </HStack>
  );
};
