import {
  AbsoluteCenter,
  Box,
  Fade,
  Flex,
  Heading,
  IconButton,
  Modal,
  ModalContent,
  ModalOverlay,
  Text,
  theme,
  useDisclosure,
  ModalHeader,
  VStack,
  ModalBody,
  Button,
  ModalFooter,
} from "@chakra-ui/react";
import { RoomRole, RoomState } from "../../models/enum";
import { Emoji } from "../../models/participant.model";
import { useEffect, useRef, useState } from "react";
import { Card } from "../Card";
import { BiHomeAlt } from "react-icons/bi";
import { GiFootprint } from "react-icons/gi";

interface Props {
  name: string;
  point?: string;
  emoji?: Emoji;
  state?: RoomState;
  role?: RoomRole;
  isOwner: boolean;
  isHost: boolean;
  onRemoveParticipant: () => void;
}

const TIME_TO_HIDE_EMOJI_IN_MILLIS = 8000;

export const ParticipantVotedCard = ({
  point,
  name,
  emoji,
  state,
  role,
  isOwner,
  isHost,
  onRemoveParticipant,
}: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [isHovering, setIsHovering] = useState(false);

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
    <>
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

        <VStack
          justifyContent="center"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <Box position="relative">
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
            {isHost && !isOwner && (
              <Fade in={isHovering}>
                <AbsoluteCenter>
                  <IconButton
                    isRound={true}
                    variant="solid"
                    colorScheme="blackAlpha"
                    icon={<GiFootprint />}
                    aria-label=""
                    onClick={onOpen}
                  />
                </AbsoluteCenter>
              </Fade>
            )}
          </Box>
          <Flex direction="row" align="center" mt={4}>
            {role === RoomRole.HOST && <BiHomeAlt />}
            {isOwner ? (
              <Heading
                fontSize="lg"
                maxW="8rem"
                ml={1}
                style={{
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                }}
              >
                {name}
              </Heading>
            ) : (
              <Text
                maxW="8rem"
                ml={1}
                style={{
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                }}
              >
                {name}
              </Text>
            )}
          </Flex>
        </VStack>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Participant Removal</ModalHeader>
          <ModalBody>
            Are you sure you want to remove this participant from the room? This
            action cannot be undone.
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button
              colorScheme="red"
              onClick={() => {
                onClose();
                onRemoveParticipant();
              }}
            >
              Kick 'em Out
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
