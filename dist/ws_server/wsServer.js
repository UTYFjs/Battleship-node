import { WebSocketServer } from "ws";
import { handle } from "./handle.ts";
import { typesResponseToGameRoom, UpdateType } from '../types/types.ts';
import { responseAll } from '../response/responseAll.ts';
import { gameDb, roomDb, winnersDb } from '../db/db.ts';
import { validation } from '../validation.ts/validation.ts';
export const wss = new WebSocketServer({ port: 3000 });
wss.on("connection", function connection(ws) {
    console.log("there are connection websocket");
    ws.on("error", console.error);
    ws.on("message", (message) => {
        const messageParsed = JSON.parse(message.toString());
        if (messageParsed.type === "attack") {
            const data = validation(messageParsed);
            const currentGame = gameDb.find((game) => game.idGame === data.gameId);
            currentGame?.currentPlayer === data.indexPlayer && handle(messageParsed, ws, wss);
        }
        else {
            handle(messageParsed, ws, wss);
        }
    });
    ws.on("close", () => {
        const room = roomDb.find((room) => room.roomUsers.find((user) => {
            return user.userId === ws;
        }));
        if (room) {
            const i = room.roomUsers.find((user) => user.userId === ws);
            const enemy = room.roomUsers.find((user) => user.userId !== ws);
            if (enemy) {
                const winnerIndexPlayer = enemy.index;
                const enemyName = enemy.name;
                const winner = winnersDb.find((winner) => winner.name === enemyName);
                if (winner) {
                    winner.wins += 1;
                }
                else {
                    winnersDb.push({
                        name: enemyName,
                        wins: 1,
                    });
                }
                const response = {
                    type: typesResponseToGameRoom.finish,
                    data: JSON.stringify({ winPlayer: winnerIndexPlayer }),
                    id: 0,
                };
                if (enemy.userId && i?.userId) {
                    enemy.userId.send(JSON.stringify(response));
                    i?.userId.send(JSON.stringify(response));
                }
            }
            const currentGameIndex = gameDb.findIndex((game) => game.currentRoom.roomId === room.roomId);
            const roomIndex = roomDb.findIndex((room1) => room1.roomId === room.roomId);
            roomDb.splice(roomIndex, 1);
            gameDb.splice(currentGameIndex, 1);
            responseAll(UpdateType.UPDATE_WINNERS);
            responseAll(UpdateType.UPDATE_ROOM);
        }
        console.log("Client disconnected");
    });
});
