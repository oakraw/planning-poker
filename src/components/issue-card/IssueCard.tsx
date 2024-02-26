import {
  Button, Flex, Heading, IconButton, Menu,
  MenuButton, MenuItem, MenuList, Text,
  theme
} from "@chakra-ui/react";
import { IoMdMore } from "react-icons/io";
import {
  RiDeleteBinLine, RiLock2Fill, RiLock2Line, RiPushpinFill,
  RiPushpinLine
} from "react-icons/ri";
import { Issue } from "../../models/issue.model";
import { Card } from "../Card";

interface Props {
  issue: Issue;
  onPinIssue: (id: string, isPin: boolean) => void;
  onLockIssue: (id: string, isLock: boolean) => void;
  onRemoveIssue: (id: string) => void;
  onPointUpdate: (id: string) => void;
}

export const IssueCard = ({
  issue,
  onPinIssue,
  onLockIssue,
  onRemoveIssue,
  onPointUpdate,
}: Props) => {
  return (
    <Card
      p={2}
      background={issue.isPin ? theme.colors.blue[50] : theme.colors.gray[50]}
      width="100%"
      borderRadius={8}
    >
      <Flex direction="row">
        <Text fontSize="0.75rem" flex={1} minH="5rem" overflowWrap="anywhere">
          {issue.isPin && "📌 "}
          {issue.issueTitle}
        </Text>
        <Flex direction="column" justify="space-between">
          {issue.isLock ? (
            <IconButton
              colorScheme="blue"
              aria-label="Unlock"
              size="xs"
              onClick={() => onLockIssue(issue.issueId, false)}
              icon={<RiLock2Fill />}
            />
          ) : (
            <Menu>
              <MenuButton
                as={IconButton}
                variant="ghost"
                aria-label="Delete"
                fontSize="1.2rem"
                size="xs"
                icon={<IoMdMore />}
              />
              <MenuList>
                <MenuItem
                  icon={issue.isPin ? <RiPushpinFill /> : <RiPushpinLine />}
                  onClick={() => onPinIssue(issue.issueId, !issue.isPin)}
                >
                  {issue.isPin ? "Unpin" : "Pin"}
                </MenuItem>
                <MenuItem
                  icon={<RiLock2Line />}
                  onClick={() => onLockIssue(issue.issueId, true)}
                >
                  Lock
                </MenuItem>
                <MenuItem
                  icon={<RiDeleteBinLine />}
                  color={theme.colors.red[500]}
                  onClick={() => onRemoveIssue(issue.issueId)}
                >
                  Delete
                </MenuItem>
              </MenuList>
            </Menu>
          )}
          {issue.isLock ? (
            <Heading size="sm" textAlign="center" color={theme.colors.blue[500]}>{issue.point || "-"}</Heading>
          ) : (
            <Button
              size="xs"
              onClick={() => onPointUpdate(issue.issueId)}
              color={theme.colors.blue[500]}
            >
              {issue.point || "-"}
            </Button>
          )}
        </Flex>
      </Flex>
    </Card>
  );
};
