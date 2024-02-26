import {
  Box, Button, Center, Divider,
  Flex, Heading, IconButton, Popover, PopoverContent, PopoverTrigger, SimpleGrid, Text, theme, useDisclosure, useMediaQuery
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { BiWinkSmile } from "react-icons/bi";
import { RiCoupon2Line } from "react-icons/ri";
import { useParams } from "react-router-dom";
import { emojis, recommendEmojis } from "../../config/emoji";
import { useObserveRoom, useSendEmoji, useVote } from "../../hooks/useApiCall";
import { useCookie } from "../../hooks/useCookie";
import { RoomState } from "../../models/enum";
import { RoomCardDeck } from "./room-card-deck";
import { RoomCardResult } from "./room-card-result";
import { RoomIssue } from "./room-issue";
import { RoomParticipantInfo } from "./room-participant-info";
import { RoomPokerTable } from "./room-poker-table";

export const Room = () => {
  const { onOpen, onClose, isOpen } = useDisclosure();
  const {
    onOpen: onIssueOpen,
    onClose: onIssueClose,
    isOpen: isIssueOpen,
  } = useDisclosure();
  const [participantId, setParticipantId] = useState<string>();
  const [maximumVotedPoint, setMaximumVotedPoint] = useState<
    string | undefined
  >();
  const { roomId } = useParams();
  const room = useObserveRoom(roomId);
  const { vote } = useVote();
  const { sendEmoji } = useSendEmoji();

  const { getSavedSession } = useCookie();
  const { savedParticipantId, savedRoomId } = getSavedSession();
  const [isLargerThan800] = useMediaQuery('(min-width: 800px)')

  useEffect(() => {
    if (savedParticipantId) {
      setParticipantId(savedParticipantId);
    }
  }, [savedParticipantId]);

  useEffect(() => {
    // Reset voted point when room is not in end state
    if (room?.state !== RoomState.END) {
      setMaximumVotedPoint(undefined);
    }
  }, [room?.state]);

  useEffect(() => {
    if (isLargerThan800) {
      onIssueOpen();
    } else {
      onIssueClose();
    }
  }, [isLargerThan800, onIssueClose, onIssueOpen]);

  return (
    <>
      {roomId && (
        <>
          <Flex direction="row" w="100vw" h="100vh">
            <Flex
              direction="column"
              flex={1}
              background={theme.colors.gray[50]}
            >
              <Flex
                direction="row"
                justify="space-between"
                p={4}
                width={{ base: "100%" }}
              >
                <Heading fontSize="xl" mr={2}>
                  ♠️ {room?.roomName}
                </Heading>
                <IconButton
                  variant="solid"
                  icon={<RiCoupon2Line />}
                  aria-label=""
                  onClick={isIssueOpen ? onIssueClose : onIssueOpen}
                />
              </Flex>
              <Center alignItems="stretch" flex={1}>
                {room && (
                  <RoomPokerTable room={room} participantId={participantId} />
                )}
              </Center>

              <Flex
                direction="row"
                maxW="100%"
                justify="center"
                alignItems="center"
                overflowX="auto"
              >
                {room?.state === RoomState.END ? (
                  <RoomCardResult
                    roomId={roomId}
                    onResultCalculated={(votedPoint: string) => {
                      setMaximumVotedPoint(votedPoint);
                    }}
                  />
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
            </Flex>

            {isIssueOpen && (
              <RoomIssue
                roomId={roomId}
                votedPoint={maximumVotedPoint}
              ></RoomIssue>
            )}
            <RoomParticipantInfo
              showDialog={savedRoomId !== roomId || !savedParticipantId}
              roomId={roomId}
              onParticipantCreated={setParticipantId}
            />
          </Flex>
        </>
      )}
    </>
  );
};
