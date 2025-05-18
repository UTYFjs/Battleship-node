export interface WsResponse {
  type: string;
  data: string /*Record<string, number | boolean> | string*/;
  id: number;
}

export type UserType = {
  userId: WebSocket;
  name: string;
  password: string;
};

export type RoomType = {
  roomId: number;
  roomUsers: Array<PlayerType>;
};

type PlayerType = {
  userId: WebSocket | null;
  name: string;
  index: 0 | 1;
};

export type WinnersType = {
  name: string;
  wins: number;
};