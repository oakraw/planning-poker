import { RoomRole } from "./enum";

export interface Participant {
  participantId: string;
  participantName: string;
  point?: string;
  emoji?: Emoji;
  role?: RoomRole;
}

export interface Emoji {
  value?: string;
  timeStamp?: number;
}


