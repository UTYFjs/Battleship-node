import { GameType, RoomType, UserType, WinnersType } from '../types/types.ts';

export const userDb: Array<UserType> = [];

export const roomDb: Array<RoomType> = [];

export const winnersDb: Array<WinnersType> = [];

export const gameDb: Array<GameType> = [];

export const createRoom = (data: Omit<UserType, 'password'>) => {
  const currentRoom: RoomType = {
    roomId: roomDb.length + 1,
    roomUsers: [{ userId: data.userId, name: data.name, index: 0 }],
  };
  roomDb.push(currentRoom);
  return currentRoom;
};

export const addUsersToRoom = (indexRoom: number, userId: WebSocket | 'bot', name: string) => {
  if (typeof userId === 'string') {
    console.log("hello, i'm bot");
    const currentRoom = roomDb.find((room) => room.roomId === indexRoom);
    if (currentRoom) {
      currentRoom.roomUsers.push({ userId: null, name: name, index: 1 });
      return { name: name, index: 1 };
    }
  } else {
    const currentRoom = roomDb.find((room) => room.roomId === indexRoom);
    if (currentRoom) {
      currentRoom.roomUsers.push({ userId: userId, name: name, index: 1 });
      return { name: name, index: 1 };
    }
  }
};

export const createGame = (currentRoom: RoomType): number => {
  const idGame = gameDb.length + 1;
  gameDb.push({
    idGame: idGame,
    currentPlayer: undefined,
    currentRoom: currentRoom,
    0: { ships: [], field: [], logShots: [], shipsXY: [{ XY: [], aroundShips: [], killedXY: [] }] },
    1: { ships: [], field: [], logShots: [], shipsXY: [{ XY: [], aroundShips: [], killedXY: [] }] },
  });
  return idGame;
};