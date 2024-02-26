import {
  Button, Flex, Textarea, theme
} from "@chakra-ui/react";
import { useState } from "react";
import { Card } from "../Card";

interface Props {
  onAddIssue: (title: string) => void;
}

export const CreateIssueCard = ({ onAddIssue }: Props) => {
  const [title, setTitle] = useState("");

  return (
    <Card
      p={2}
      background={theme.colors.gray[50]}
      width="100%"
      borderRadius={8}
    >
      <Flex direction="column">
        <Textarea
          variant="unstyled"
          placeholder="Enter some text"
          size="sm"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Button
          variant="ghost"
          size="xs"
          mt={2}
          colorScheme="blue"
          alignSelf="end"
          onClick={() => onAddIssue(title)}
        >
          Done
        </Button>
      </Flex>
    </Card>
  );
};
