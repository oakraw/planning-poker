import { Box, Heading, Text, theme, VStack } from "@chakra-ui/react";
import { RoomState } from "../../models/enum";
import { Emoji } from "../../models/participant.model";
import { useEffect, useRef, useState } from "react";
import { Card } from "../Card";

interface Props {
  name: string;
  point?: string;
  emoji?: Emoji;
  state?: RoomState;
  isOwner: boolean;
}

const TIME_TO_HIDE_EMOJI_IN_MILLIS = 8000;

export const ParticipantVotedCard = ({
  point,
  name,
  emoji,
  state,
  isOwner,
}: Props) => {
  const [displayedEmoji, setDisplayedEmoji] = useState<string | null>(null);
  const keyUpTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (emoji?.timeStamp && emoji?.value) {
      const displayTime =
        TIME_TO_HIDE_EMOJI_IN_MILLIS - (Date.now() - emoji?.timeStamp);
      if (displayTime > 0) {
        setDisplayedEmoji(emoji.value);
      }

      keyUpTimer.current && clearTimeout(keyUpTimer.current);
      keyUpTimer.current = setTimeout(() => {
        setDisplayedEmoji(null);
      }, displayTime);
    }
  }, [emoji]);

  return (
    <Box position="relative">
      <Box position="absolute" left={0} right={0} top={-12} mx="auto">
        {displayedEmoji && (
          <Card
            textAlign="center"
            p={2}
            background={theme.colors.whiteAlpha[800]}
          >
            <Text align="center" fontSize="lg">
              {displayedEmoji}
            </Text>
          </Card>
        )}
      </Box>
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
            style={{
              visibility: state === RoomState.END ? "visible" : "hidden",
            }}
          >
            {point ?? 0}
          </Heading>
        </Box>
        {isOwner ? (
          <Heading fontSize="lg">{name}</Heading>
        ) : (
          <Text mt={4}>{name}</Text>
        )}
      </VStack>
    </Box>
  );
};
