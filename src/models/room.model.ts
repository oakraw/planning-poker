import { RoomState } from "./enum";

export interface Room {
  roomId: string;
  roomName: string;
  state?: RoomState;
}
