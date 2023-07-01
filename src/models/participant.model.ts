export interface Participant {
  participantId: string;
  participantName: string;
  point?: string;
  emoji?: Emoji;
}

export interface Emoji {
  value?: string;
  timeStamp?: number;
}
