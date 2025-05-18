import WebSocket from "ws";
import { addUsersToRoom, createGame, createRoom, roomDb, userDb } from "../db/db.ts";
import { validation } from "../validation.ts/validation.ts";
import { responsePersonal } from "../response/responsePersonal.ts";
import { typesResponseToGameRoom, UserType, WsResponse } from '../types/types.ts';
import { responseAll } from '../response/responseAll.ts';
import { responseToGameRoom } from '../response/responseToGameRoom.ts';


export const handle = async (message: WsResponse, ws: WebSocket, wss: WebSocket.Server) => {
	const data = validation(message);
	if (data) {
		let currentUser: UserType | undefined;
		switch (message.type) {
      case 'reg':
        // eslint-disable-next-line no-case-declarations
        currentUser = userDb.find((user) => user.name === data.name);
        if (currentUser) {
          const currentPassword = userDb.find((user) => user.password === data.password);
          if (currentPassword) {
            const indexCurrentUser = userDb.findIndex((user) => user.name === data.name);
            if (indexCurrentUser !== -1) {
              userDb[indexCurrentUser].userId = ws;
            }
            responsePersonal(ws);
          } else {
            responsePersonal(ws, true);
          }
        } else {
          userDb.push({ userId: ws, name: data.name, password: data.password });
          responsePersonal(ws);
          responseAll('update_winners');
        }

        return;

      case 'create_room':
        console.log('create room');
        // eslint-disable-next-line no-case-declarations
        currentUser = userDb.find((user) => user.userId === ws);
        // eslint-disable-next-line no-case-declarations
        const roomsThisUser = roomDb.find((room) => room.roomUsers.find((user) => user.userId === ws));
        if (!roomsThisUser) {
          if (currentUser) {
            createRoom({ userId: ws, name: currentUser.name });
            responseAll('update_room');
          }
        }

        return;
      case 'add_user_to_room':
        console.log('add_user_to_room');
        // eslint-disable-next-line no-case-declarations
        const currentRoom = roomDb.find((room) => room.roomId === data.indexRoom);
        // eslint-disable-next-line no-case-declarations
        if (currentRoom) {
          const firstPlayer = currentRoom.roomUsers.find((user) => user.index === 0);
          // eslint-disable-next-line no-case-declarations
          const secondPlayer = userDb.find((user) => user.userId === ws);
          if (secondPlayer && firstPlayer && firstPlayer.userId !== secondPlayer.userId) {
            addUsersToRoom(data.indexRoom, ws, secondPlayer.name);

            const currentIdGame = createGame(currentRoom);
            responseToGameRoom(typesResponseToGameRoom.create_game, currentIdGame);

            responseAll('update_room');
          }
        } else {
          ws.send('some error, no currentRoom or secondPlayer');
        }

        return;
      case 'add_ships':
        console.log('add_ships');
        return;
      case 'attack':
        console.log('attack');
        return;
      case 'randomAttack':
        console.log('randomAttack');
        return;
      case 'single_play':
        console.log('single_play');

        return;
    }
	} else {
		wss.clients.forEach((client) => {
			client.send("error");
		});
	}
};
