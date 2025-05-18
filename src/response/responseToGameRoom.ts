// import { typesResponseToGameRoom } from '../const/constants';
// import { gameDb, roomDb, winnersDb } from '../db/db';
// import { wss } from '../websocket_server';

import { gameDb } from '../db/db.ts';
import { typesResponseToGameRoom } from '../types/types.ts';

export const responseToGameRoom = (
  type: typesResponseToGameRoom,
  currentIdGame: number,
  dataAttack?: { x: number; y: number; gameId: number; indexPlayer: number },
) => {
  let dataResponse;
  const response = { type: type, data: JSON.stringify(dataResponse), id: 0 };
  if (type === typesResponseToGameRoom.create_game) {
    const currentGame = gameDb.find((game) => game.idGame === currentIdGame);
    if (currentGame) {
      currentGame.currentRoom.roomUsers.forEach((user) => {
        if (user.userId) {
          dataResponse = { idGame: currentIdGame, idPlayer: user.index };
          response.data = JSON.stringify(dataResponse);
          user.userId.send(JSON.stringify(response));
        }
      });
    }

    return;
  }
 
};

