import { HStack, Heading, theme } from "@chakra-ui/react";
import { useState } from "react";
import { Card } from "../../../components/Card";
import "./roomCardDeck.css";

interface Props {
  onSelectedCard: (selectCard?: string) => void;
}

export const RoomCardDeck = ({ onSelectedCard }: Props) => {
  const [selectedCard, selectCard] = useState<string | null>(null);
  const [decks] = useState<string[]>([
    "0.5",
    "1",
    "2",
    "3",
    "5",
    "8",
    "13",
    "20",
    "40",
    "?",
  ]);

  return (
    <HStack p={4}>
      {decks.map((card, index) =>
        card === selectedCard ? (
          <Card
            key={index}
            py={8}
            minW={16}
            textAlign="center"
            borderWidth="2px"
            borderColor={theme.colors.blue[500]}
            background={theme.colors.blue[100]}
            className="VotingCard"
            onClick={() => selectCard(null)}
          >
            <Heading fontSize="xl" color={theme.colors.blue[500]}>
              {card}
            </Heading>
          </Card>
        ) : (
          <Card
            key={index}
            py={8}
            minW={16}
            textAlign="center"
            className="VotingCard"
            onClick={() => {
              onSelectedCard(card);
              selectCard(card);
            }}
          >
            <Heading fontSize="xl">{card}</Heading>
          </Card>
        )
      )}
    </HStack>
  );
};
