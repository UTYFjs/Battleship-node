import { RoomType, UserType, WinnersType } from '../types/types.ts';

export const userDb: Array<UserType> = [];

export const roomDb: Array<RoomType> = [];

export const winnersDb: Array<WinnersType> = [];

export const createRoom = (data: Omit<UserType, 'password'>) => {
  const currentRoom: RoomType = {
    roomId: roomDb.length + 1,
    roomUsers: [{ userId: data.userId, name: data.name, index: 0 }],
  };
  roomDb.push(currentRoom);
  return currentRoom;
};