import { Box, BoxProps } from "@chakra-ui/react";

interface Props extends BoxProps {}

export const Card = ({ children, ...rest }: Props) => {
  return (
    <Box p={4} shadow="md" borderRadius={16} {...rest} />
  );
};
