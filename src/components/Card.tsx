import { Box, BoxProps, Heading, Text, VStack } from "@chakra-ui/react";
import { title } from "process";

interface Props extends BoxProps {}

export const Card = ({ children, ...rest }: Props) => {
  return (
    <Box p={4} shadow="md" borderRadius={16} {...rest} />
  );
};
