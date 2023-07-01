import {
  Center,
  Box,
  theme,
  VStack,
  Heading,
  HStack,
  Popover,
  PopoverTrigger,
  IconButton,
  PopoverContent,
  Text,
  SimpleGrid,
  Button,
  Divider,
  Flex,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useObserveRoom, useSendEmoji, useVote } from "../../hooks/useApiCall";
import { RoomState } from "../../models/enum";
import { RoomCardDeck } from "./room-card-deck";
import { RoomCardResult } from "./room-card-result";
import { RoomParticipantInfo } from "./room-participant-info";
import { RoomPokerTable } from "./room-poker-table";
import { useCookie } from "../../hooks/useCookie";
import { BiWinkSmile } from "react-icons/bi";
import { emojis, recommendEmojis } from "../../config/emoji";

export const Room = () => {
  const { onOpen, onClose, isOpen } = useDisclosure()
  const [participantId, setParticipantId] = useState<string>();
  const { roomId } = useParams();
  const room = useObserveRoom(roomId);
  const { vote } = useVote();
  const { sendEmoji } = useSendEmoji();

  const { getSavedSession } = useCookie();
  const { savedParticipantId, savedRoomId } = getSavedSession();

  useEffect(() => {
    if (savedParticipantId) {
      setParticipantId(savedParticipantId);
    }
  }, [savedParticipantId]);

  return (
    <>
      {roomId && (
        <>
          <VStack
            w="calc(100vw)"
            h="calc(100vh)"
            background={theme.colors.gray[50]}
          >
            <HStack p={4} width={{ base: "100%" }}>
              <Heading fontSize="xl" mr={2}>
                ♠️ {room?.roomName}
              </Heading>
            </HStack>
            <Center alignItems="stretch" flexGrow={1}>
              {room && (
                <RoomPokerTable room={room} participantId={participantId} />
              )}
            </Center>

            <Flex direction="row" alignItems="center">
              {room?.state === RoomState.END ? (
                <RoomCardResult roomId={roomId} />
              ) : (
                <Box
                  style={{
                    visibility:
                      room?.state === RoomState.VOTING ? "visible" : "hidden",
                  }}
                >
                  <RoomCardDeck
                    onSelectedCard={(card) => {
                      if (roomId && participantId) {
                        vote(roomId, participantId, card);
                      }
                    }}
                  />
                </Box>
              )}
              <Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
                <PopoverTrigger>
                  <IconButton
                    size="lg"
                    aria-label="emoji"
                    mx={4}
                    icon={<BiWinkSmile size={24} />}
                  />
                </PopoverTrigger>
                <PopoverContent p={2} overflowY="auto" maxH={300}>
                  <Text mx={2} fontSize="xs" color="gray.400">
                    Highlight emoji
                  </Text>
                  <SimpleGrid columns={8}>
                    {recommendEmojis.map((emoji, index) => (
                      <Button
                        key={index}
                        background="white"
                        fontSize="2xl"
                        onClick={() => {
                          onClose();
                          if (roomId && participantId) {
                            sendEmoji(roomId, participantId, emoji);
                          }
                        }}
                      >
                        {emoji}
                      </Button>
                    ))}
                  </SimpleGrid>
                  <Divider my={2} />
                  <Text mx={2} fontSize="xs" color="gray.400">
                    More emoji
                  </Text>
                  <SimpleGrid columns={8}>
                    {emojis.map((emoji, index) => (
                      <Button
                        key={index}
                        background="white"
                        fontSize="2xl"
                        onClick={() => {
                          onClose();
                          if (roomId && participantId) {
                            sendEmoji(roomId, participantId, emoji);
                          }
                        }}
                      >
                        {emoji}
                      </Button>
                    ))}
                  </SimpleGrid>
                </PopoverContent>
              </Popover>
            </Flex>
          </VStack>
          <RoomParticipantInfo
            showDialog={savedRoomId !== roomId || !savedParticipantId}
            roomId={roomId}
            onParticipantCreated={setParticipantId}
          />
        </>
      )}
    </>
  );
};
