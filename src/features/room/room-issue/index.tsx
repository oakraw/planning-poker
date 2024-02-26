import {
  Button,
  CircularProgress, theme, VStack
} from "@chakra-ui/react";
import { useCallback, useState } from "react";
import { CreateIssueCard } from "../../../components/issue-card/CreateIssueCard";
import { IssueCard } from "../../../components/issue-card/IssueCard";
import {
  useAddIssueToRoom,
  useObserveIssues,
  useRemoveIssueFromRoom,
  useUpdateIssueInRoom
} from "../../../hooks/useApiCall";

interface Props {
  roomId: string;
  votedPoint?: string;
}

export const RoomIssue = ({ roomId, votedPoint }: Props) => {
  const [isCreating, setCreating] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const { addIssue } = useAddIssueToRoom();
  const { removeIssue } = useRemoveIssueFromRoom();
  const { updateIssue } = useUpdateIssueInRoom();
  const issues = useObserveIssues(roomId);

  const submitNewIssue = useCallback(
    async (title: string) => {
      setLoading(true);
      if (title) {
        await addIssue(roomId, title);
      }
      setCreating(false);
      setLoading(false);
    },
    [addIssue, roomId]
  );

  return (
    <VStack
      direction="column"
      spacing={4}
      p={4}
      minW="15rem"
      maxW="15rem"
      height="100vh"
      overflowY="auto"
    >
      {isLoading ? (
        <CircularProgress isIndeterminate color={theme.colors.blue[300]} />
      ) : (
        <>
          {isCreating ? (
            <CreateIssueCard
              onAddIssue={(title) => submitNewIssue(title)}
            ></CreateIssueCard>
          ) : (
            <Button
              variant="outline"
              size="sm"
              minH="2.5rem"
              onClick={() => {
                setCreating(true);
              }}
              width="100%"
            >
              Create Issue
            </Button>
          )}
        </>
      )}

      {issues.map((issue, index) => (
        <IssueCard
          key={index}
          issue={issue}
          onPinIssue={(issueId, isPin) => {
            updateIssue(roomId, issueId, isPin);
          }}
          onLockIssue={(issueId, isLock) => {
            updateIssue(roomId, issueId, undefined, isLock);
          }}
          onRemoveIssue={(issueId) => {
            removeIssue(roomId, issueId);
          }}
          onPointUpdate={(issueId) => {
            updateIssue(roomId, issueId, undefined, undefined, votedPoint);
          }}
        />
      ))}
    </VStack>
  );
};
