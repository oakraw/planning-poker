import * as React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  Button,
  Input,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { useAddParticipantToRoom } from "../../../hooks/useApiCall";

interface Props {
  showDialog: boolean;
  roomId: string;
  onParticipantCreated: (participantId: string) => void;
}

export const RoomParticipantInfo = ({ showDialog, roomId, onParticipantCreated }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [name, setName] = useState<string>();
  const { addParticipant } = useAddParticipantToRoom();

  useEffect(() => {
    if (showDialog) {
      onOpen();
    }
  }, [onOpen, showDialog]);

  const addParticipantToRoom = useCallback(async () => {
    if (name) {
      const participantId = await addParticipant(roomId, name);
      onParticipantCreated(participantId)
    }
  }, [addParticipant, name, onParticipantCreated, roomId]);

  const onSubmit = useCallback(async () => {
    addParticipantToRoom();
    onClose();
  }, [addParticipantToRoom, onClose]);

  const cancelRef = useRef() as React.MutableRefObject<HTMLInputElement>;

  return (
    <>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => {}}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Choose your display name
            </AlertDialogHeader>

            <AlertDialogBody>
              <Input
                placeholder="Your display name"
                size="lg"
                onChange={(e) => setName(e.target.value)}
              />
            </AlertDialogBody>

            <AlertDialogFooter mt={4}>
              <Button
                colorScheme="blue"
                size="lg"
                onClick={onSubmit}
                disabled={!name}
                width={{ base: "100%" }}
              >
                Enter room
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};
