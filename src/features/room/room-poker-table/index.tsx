import { VStack, HStack, Button, Center, Heading } from "@chakra-ui/react";
import { Participant } from "../../../models/participant.model";
import { ParticipantVotedCard } from "../../../components/ParticipantVotedCard";
import { Card } from "../../../components/Card";
import { theme } from "@chakra-ui/react";
import {
  useObserveParticipants,
  useUpdateRoomInfo,
} from "../../../hooks/useApiCall";
import { Room } from "../../../models/room.model";
import { useCallback, useState } from "react";
import { RoomState } from "../../../models/enum";

interface Props {
  room: Room;
}

const COUNT_DOWN_TIME = 3000;

export const RoomPokerTable = ({ room }: Props) => {
  const [countDownTimer, setCountDownTimer] = useState<number>(0);
  const participants = useObserveParticipants(room.roomId);
  const { updateRoomInfo } = useUpdateRoomInfo();

  const onUpdateRoomState = useCallback(
    async (state: RoomState) => {
      const votingRoom = { ...room, state };
      await updateRoomInfo(votingRoom);
    },
    [room, updateRoomInfo]
  );

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
      <VStack spacing={8} justifyContent="center">
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
          >
            <Center h={{ base: "100%" }}>
              {countDownTimer !== 0 ? (
                <Heading fontSize="2xl" color={theme.colors.blue[500]}>{countDownTimer / 1000}</Heading>
              ) : room.state === RoomState.VOTING ? (
                <Button
                  colorScheme="gray"
                  size="lg"
                  onClick={() => {
                    let countDownTime = COUNT_DOWN_TIME;

                    setCountDownTimer(countDownTime);
                    const downloadTimer = setInterval(() => {
                      countDownTime -= 1000;
                      
                      setCountDownTimer(countDownTime);
                      if (countDownTime <= 0) {
                        setCountDownTimer(0);
                        onUpdateRoomState(RoomState.END);

                        clearInterval(downloadTimer);
                      }
                    }, 1000);
                  }}
                >
                  Reveal cards
                </Button>
              ) : (
                <Button
                  colorScheme="blue"
                  size="lg"
                  onClick={() => onUpdateRoomState(RoomState.VOTING)}
                >
                  Start voting
                </Button>
              )}
            </Center>
          </Card>
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
