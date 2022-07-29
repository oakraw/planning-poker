import * as React from "react";
import { useState, useEffect, useRef } from "react";
import {
  Box,
  Text,
  VStack,
  Grid,
  Button,
  Input,
  Container,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { useParams } from "react-router";

interface Props {
  showDialog: boolean;
}

export const RoomParticipantInfo = ({ showDialog }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [name, setName] = useState<string>();

  useEffect(() => {
    if (showDialog) {
      onOpen();
    }
  }, [onOpen, showDialog]);

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

            <AlertDialogFooter>
              <Button colorScheme="blue"  size="lg" onClick={onClose} width={{ base: '100%', }} >
                Enter room
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};
