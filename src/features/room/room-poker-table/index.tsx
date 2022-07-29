import * as React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
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
  HStack,
} from "@chakra-ui/react";
import { useParams } from "react-router";
import { Participant } from "../../../models/participant.model";
import { ParticipantVotedCard } from "../../../components/ParticipantVotedCard";
import { Card } from "../../../components/Card";
import { theme } from "@chakra-ui/react";

export const RoomPokerTable = () => {
  const [participants] = useState<Participant[]>([
    { userId: "1", name: "a" },
    { userId: "2", name: "b" },
    { userId: "3", name: "c" },
    { userId: "4", name: "d" },
    { userId: "5", name: "e" },
    { userId: "6", name: "f" },
    { userId: "7", name: "g" },
    { userId: "8", name: "h" },
    { userId: "9", name: "i" },
    { userId: "10", name: "j" },
    { userId: "11", name: "k" },
    { userId: "12", name: "l" },
    { userId: "13", name: "m" },
    { userId: "14", name: "n" },
  ]);

  const seating = (participants: Participant[]): JSX.Element => {
    let topSeat: Participant[] = [];
    let leftSeat: Participant[] = [];
    let rightSeat: Participant[] = [];
    let bottomSeat: Participant[] = [];

    let count = 0;
    participants.forEach((participant: Participant, index: number) => {
      if (count === 4) count = 0;

      switch (count) {
        case 0:
          bottomSeat.push(participant);
          break;
        case 1:
          topSeat.push(participant);
          break;
        default: {
          if (leftSeat.length >= 3 && rightSeat.length >= 3) {
            index % 2 === 0
              ? topSeat.push(participant)
              : bottomSeat.push(participant);
          } else {
            switch (count) {
              case 2:
                leftSeat.push(participant);
                break;
              case 3:
                rightSeat.push(participant);
                break;
            }
          }
        }
      }

      count += 1;
    });

    console.log("topSeat", topSeat);
    console.log("leftSeat", leftSeat);
    console.log("rightSeat", rightSeat);
    console.log("bottomSeat", bottomSeat);

    return (
      <VStack>
        <HStack spacing={8}>
          {topSeat.map((participant) => (
            <ParticipantVotedCard
              name={participant.name}
              point={participant.point}
            />
          ))}
        </HStack>
        <HStack spacing={8}>
          <VStack>
            {leftSeat.map((participant) => (
              <ParticipantVotedCard
                name={participant.name}
                point={participant.point}
              />
            ))}
          </VStack>
          <Card
            style={{
              width: "100%",
              height: "100%",
              minWidth: "25rem",
              minHeight: "15rem",
            }}
            background={theme.colors.blue[100]}
          ></Card>
          <VStack>
            {rightSeat.map((participant) => (
              <ParticipantVotedCard
                name={participant.name}
                point={participant.point}
              />
            ))}
          </VStack>
        </HStack>
        <HStack spacing={8}>
          {bottomSeat.map((participant) => (
            <ParticipantVotedCard
              name={participant.name}
              point={participant.point}
            />
          ))}
        </HStack>
      </VStack>
    );
  };

  return <>{seating(participants)}</>;
};
