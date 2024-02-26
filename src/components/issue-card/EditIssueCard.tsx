import { Box, Button, Flex, Input, Textarea, theme } from "@chakra-ui/react";
import { useState } from "react";
import { Issue } from "../../models/issue.model";
import { Card } from "../Card";

interface Props {
  issue: Issue;
  onEditIssue: (issue: Issue) => void;
}

export const EditIssueCard = ({ issue, onEditIssue }: Props) => {
  const [editIssue, setEditIssue] = useState<Issue>({ ...issue });

  return (
    <Card
      p={2}
      background={theme.colors.gray[50]}
      width="100%"
      borderRadius={8}
    >
      <Flex direction="column">
        <Textarea
          variant="outline"
          placeholder="Enter some text"
          size="sm"
          p={1}
          value={editIssue.issueTitle}
          fontSize="0.75rem"
          onChange={(e) =>
            setEditIssue({ ...editIssue, issueTitle: e.target.value })
          }
        />
        <Box background={theme.colors.gray[100]} mt={4} alignSelf="end" borderRadius={4}>
          <Input
            variant="unstyled"
            type="number"
            placeholder="-"
            color={theme.colors.blue[500]}
            fontWeight={600}
            fontSize="0.75rem"
            width="1.5rem"
            textAlign="center"
            mt="-2px"
            value={editIssue.point}
            onChange={(e) =>
              setEditIssue({ ...editIssue, point: e.target.value })
            }
          />
        </Box>
        <Button
          variant="ghost"
          size="xs"
          mt={2}
          colorScheme="blue"
          alignSelf="end"
          onClick={() => onEditIssue(editIssue)}
        >
          Done
        </Button>
      </Flex>
    </Card>
  );
};
