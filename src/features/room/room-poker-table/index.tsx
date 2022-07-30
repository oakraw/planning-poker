import { useState } from "react";
import { VStack, HStack } from "@chakra-ui/react";
import { Participant } from "../../../models/participant.model";
import { ParticipantVotedCard } from "../../../components/ParticipantVotedCard";
import { Card } from "../../../components/Card";
import { theme } from "@chakra-ui/react";
import { useObserveParticipants } from "../../../hooks/useApiCall";
import { Room } from "../../../models/room.model";

interface Props {
  room: Room;
}

export const RoomPokerTable = ({ room }: Props) => {
  const participants = useObserveParticipants(room.roomId);

  const renderSeat = (participants: Participant[]): JSX.Element => {
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

    return (
      <VStack spacing={8}>
        <HStack spacing={8}>
          {topSeat.map((participant, index) => (
            <ParticipantVotedCard
              key={index}
              name={participant.participantName}
              point={participant.point}
              state={room.state}
            />
          ))}
        </HStack>
        <HStack spacing={8}>
          <VStack>
            {leftSeat.map((participant, index) => (
              <ParticipantVotedCard
                key={index}
                name={participant.participantName}
                point={participant.point}
                state={room.state}
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
            {rightSeat.map((participant, index) => (
              <ParticipantVotedCard
                key={index}
                name={participant.participantName}
                point={participant.point}
                state={room.state}
              />
            ))}
          </VStack>
        </HStack>
        <HStack spacing={8}>
          {bottomSeat.map((participant, index) => (
            <ParticipantVotedCard
              key={index}
              name={participant.participantName}
              point={participant.point}
              state={room.state}
            />
          ))}
        </HStack>
      </VStack>
    );
  };

  return <>{renderSeat(participants)}</>;
};
