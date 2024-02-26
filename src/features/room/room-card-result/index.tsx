import { HStack, Heading, theme, Box, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Card } from "../../../components/Card";
import { useObserveParticipants } from "../../../hooks/useApiCall";

interface Props {
  roomId: string;
  onResultCalculated: (votedPoint: string) => void;
}

export const RoomCardResult = ({ roomId, onResultCalculated }: Props) => {
  const [result, setResult] = useState<Map<string, number>>(new Map());
  const [votedPoint, setVotedPoint] = useState<string | undefined>(undefined);
  const participants = useObserveParticipants(roomId);

  useEffect(() => {
    let tempResult: Map<string, number> = new Map();

    participants?.forEach((participant) => {
      const point = participant.point;
      if (point !== null && point !== undefined) {
        tempResult.set(point, (tempResult.get(point) ?? 0) + 1);
      }
    });
    setResult(tempResult);

    let maxPoint: string = "-";
    let maxValue: number = -Infinity;
    tempResult.forEach((value, key) => {
      if (value > maxValue) {
        maxValue = value;
        maxPoint = key;
      }
    });
    setVotedPoint(maxPoint)
  }, [participants]);

  useEffect(() => {
    if (votedPoint) {
      onResultCalculated(votedPoint);
    }
  }, [onResultCalculated, votedPoint]);

  return (
    <HStack p={4}>
      <Heading fontSize="xl" mr={8}>
        Voting Result
      </Heading>
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
