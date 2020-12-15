import { UserDoc } from "../models/User";

export interface SocketWithUser extends SocketIO.Socket {
  user?: UserDoc
}

interface Event {
  // username of action taker
  to: string;
  // username of origin
  from: string;
}
export interface TypingEvent extends Event {
  isTyping: boolean;
}
export interface MessageEvent extends Event {
  timestamp: number;
  data: string;
}

export interface Store {
  [username: string]: string;
}
