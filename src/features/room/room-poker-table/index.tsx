import { VStack, HStack, Button, Center, Heading, Flex } from "@chakra-ui/react";
import { Participant } from "../../../models/participant.model";
import { ParticipantVotedCard } from "../../../components/participant-voted-card";
import { Card } from "../../../components/Card";
import { theme } from "@chakra-ui/react";
import {
  useClearVote,
  useObserveParticipants,
  useRemoveParticipantFromRoom,
  useUpdateRoomInfo,
} from "../../../hooks/useApiCall";
import { Room } from "../../../models/room.model";
import { useCallback, useState } from "react";
import { RoomRole, RoomState } from "../../../models/enum";

interface Props {
  room: Room;
  participantId?: string;
}

const COUNT_DOWN_TIME = 3000;

export const RoomPokerTable = ({ room, participantId }: Props) => {
  const [countDownTimer, setCountDownTimer] = useState<number>(0);
  const participants = useObserveParticipants(room.roomId);
  const { updateRoomInfo } = useUpdateRoomInfo();
  const { clearVote } = useClearVote();

  const { removeParticipant } = useRemoveParticipantFromRoom();

  const isHost =
    participants.find((item) => item.participantId === participantId)?.role ===
    RoomRole.HOST;

  const onUpdateRoomState = useCallback(
    async (state: RoomState) => {
      const votingRoom = { ...room, state };
      await updateRoomInfo(votingRoom);
    },
    [room, updateRoomInfo]
  );

  const removeParticipantFromRoom = useCallback(
    async (removeParticipantId: string) => {
      await removeParticipant(room.roomId, removeParticipantId);
    },
    [removeParticipant, room.roomId]
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
        <HStack spacing={8} alignSelf="center">
          {topSeat.map((participant, index) => (
            <ParticipantVotedCard
              key={index}
              name={participant.participantName}
              point={participant.point}
              state={room.state}
              role={participant.role}
              emoji={participant.emoji}
              isOwner={participantId === participant.participantId}
              isHost={isHost}
              onRemoveParticipant={() =>
                removeParticipantFromRoom(participant.participantId)
              }
            />
          ))}
        </HStack>
        <Flex direction="row" justify="space-between" alignItems="center" width="100%">
          <VStack>
            {leftSeat.map((participant, index) => (
              <ParticipantVotedCard
                key={index}
                name={participant.participantName}
                point={participant.point}
                state={room.state}
                role={participant.role}
                emoji={participant.emoji}
                isOwner={participantId === participant.participantId}
                isHost={isHost}
                onRemoveParticipant={() =>
                  removeParticipantFromRoom(participant.participantId)
                }
              />
            ))}
          </VStack>
          <Card
            height="100%"
            maxWidth="50rem"
            minWidth="20rem"
            minHeight="10rem"
            flex={1}
            m={8}
            background={theme.colors.blue[100]}
          >
            <Center h={{ base: "100%" }}>
              {countDownTimer !== 0 ? (
                <Heading fontSize="2xl" color={theme.colors.blue[500]}>
                  {countDownTimer / 1000}
                </Heading>
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
                  onClick={() => {
                    clearVote(room.roomId);
                    onUpdateRoomState(RoomState.VOTING);
                  }}
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
                emoji={participant.emoji}
                role={participant.role}
                isOwner={participantId === participant.participantId}
                isHost={isHost}
                onRemoveParticipant={() =>
                  removeParticipantFromRoom(participant.participantId)
                }
              />
            ))}
          </VStack>
        </Flex>
        <HStack spacing={8}>
          {bottomSeat.map((participant, index) => (
            <ParticipantVotedCard
              key={index}
              name={participant.participantName}
              point={participant.point}
              state={room.state}
              emoji={participant.emoji}
              role={participant.role}
              isOwner={participantId === participant.participantId}
              isHost={isHost}
              onRemoveParticipant={() =>
                removeParticipantFromRoom(participant.participantId)
              }
            />
          ))}
        </HStack>
      </VStack>
    );
  };

  return <>{renderSeat(participants)}</>;
};
