import { roomDb, winnersDb } from '../db/db.ts';
import { UpdateType } from '../types/types.ts';

export const prepareDataForUpdateRoom = () =>{
  const dataResponse = roomDb
        .filter((room) => {
          if (room.roomUsers.length === 1) {
            return true;
          }
        })
        .map((room) => {
          return {
            roomId: room.roomId,
            roomUsers: [{ name: room.roomUsers[0].name, index: room.roomUsers[0].index }],
          };
        });
      const response = { type: UpdateType.UPDATE_ROOM, data: JSON.stringify(dataResponse), id: 0 };
      return JSON.stringify(response);
}

export const prepareDataForUpdateWinners = () =>{
      const dataResponse = winnersDb;
      const response = { type: UpdateType.UPDATE_WINNERS, data: JSON.stringify(dataResponse), id: 0 };
      return JSON.stringify(response);
}