import { addShips, addUsersToRoom, createGame, createRoom, gameDb, roomDb, userDb } from '../db/db.ts';
import { validation } from '../validation.ts/validation.ts';
import { responsePersonal } from '../response/responsePersonal.ts';
import { typesResponseToGameRoom, UpdateType } from '../types/types.ts';
import { responseAll } from '../response/responseAll.ts';
import { responseToGameRoom } from '../response/responseToGameRoom.ts';
import { bot_ships } from '../bot_ships/bot_ships.ts';
export const handle = async (message, ws, wss) => {
    const data = validation(message);
    if (data) {
        let currentUser;
        switch (message.type) {
            case 'reg':
                currentUser = userDb.find((user) => user.name === data.name);
                if (currentUser) {
                    const currentPassword = userDb.find((user) => user.password === data.password);
                    if (currentPassword) {
                        const indexCurrentUser = userDb.findIndex((user) => user.name === data.name);
                        if (indexCurrentUser !== -1) {
                            userDb[indexCurrentUser].userId = ws;
                        }
                        responsePersonal(ws);
                    }
                    else {
                        responsePersonal(ws, true);
                    }
                }
                else {
                    userDb.push({ userId: ws, name: data.name, password: data.password });
                    responsePersonal(ws);
                }
                return;
            case 'create_room':
                console.log('create room');
                currentUser = userDb.find((user) => user.userId === ws);
                const roomsThisUser = roomDb.find((room) => room.roomUsers.find((user) => user.userId === ws));
                if (!roomsThisUser) {
                    if (currentUser) {
                        createRoom({ userId: ws, name: currentUser.name });
                        responseAll(UpdateType.UPDATE_ROOM);
                    }
                }
                return;
            case 'add_user_to_room':
                console.log('add_user_to_room');
                const currentRoom = roomDb.find((room) => room.roomId === data.indexRoom);
                if (currentRoom) {
                    const firstPlayer = currentRoom.roomUsers.find((user) => user.index === 0);
                    const secondPlayer = userDb.find((user) => user.userId === ws);
                    if (secondPlayer && firstPlayer && firstPlayer.userId !== secondPlayer.userId) {
                        addUsersToRoom(data.indexRoom, ws, secondPlayer.name);
                        const currentIdGame = createGame(currentRoom);
                        responseToGameRoom(typesResponseToGameRoom.create_game, currentIdGame);
                        responseAll(UpdateType.UPDATE_ROOM);
                    }
                }
                else {
                    ws.send('some error, no currentRoom or secondPlayer');
                }
                return;
            case 'add_ships':
                console.log('add_ships');
                addShips(data);
                responseToGameRoom(typesResponseToGameRoom.start_game, data.gameId);
                responseToGameRoom(typesResponseToGameRoom.turn, data.gameId);
                return;
            case 'attack':
                const currentGame = gameDb.find((game) => game.idGame === data.gameId);
                if (currentGame) {
                    const bot = !currentGame.currentRoom.roomUsers[1].userId;
                    if (bot) {
                        console.log('атака c ботом currentGame data.indexPlayer', currentGame.currentPlayer, data.indexPlayer);
                        if (data.indexPlayer === currentGame.currentPlayer && typeof currentGame.currentPlayer === 'number') {
                            if (currentGame[currentGame.currentPlayer].logShots.findIndex((item) => item.x === data.x && item.y === data.y) === -1) {
                                currentGame[currentGame.currentPlayer].logShots.push({ x: data.x, y: data.y });
                                responseToGameRoom(typesResponseToGameRoom.attack, data.gameId, data);
                                responseToGameRoom(typesResponseToGameRoom.turn, data.gameId);
                            }
                            else {
                                const dataResponse = { currentPlayer: currentGame.currentPlayer };
                                const response = {
                                    type: typesResponseToGameRoom.turn,
                                    data: JSON.stringify(dataResponse),
                                    id: 0,
                                };
                                const currentPlayerID = currentGame.currentRoom.roomUsers[currentGame.currentPlayer].userId;
                                if (currentPlayerID) {
                                    currentPlayerID.send(JSON.stringify(response));
                                }
                            }
                            console.log("заканчиваем атаку игрока с ботом");
                        }
                        console.log('data.indexPlayer', data.indexPlayer, "currentGame.currentPlayer", currentGame.currentPlayer);
                        if (currentGame.currentPlayer === 1) {
                            console.log('должен стрелять бот data.indexPlayer', data.indexPlayer);
                            if (data.indexPlayer !== currentGame.currentPlayer) {
                                console.log("I'm bot, and I'll win you");
                                while (currentGame.currentPlayer === 1) {
                                    const randomCoordinates = getRandomAttackData(data.gameId);
                                    const dataForRandomAttack = {
                                        gameId: data.gameId,
                                        x: randomCoordinates.x,
                                        y: randomCoordinates.y,
                                        indexPlayer: 1,
                                    };
                                    const botAttack = async () => {
                                        return new Promise((resolve) => {
                                            setTimeout(() => {
                                                console.log('атака бота');
                                                resolve(undefined);
                                            }, 2000);
                                        });
                                    };
                                    await botAttack();
                                    responseToGameRoom(typesResponseToGameRoom.attack, data.gameId, dataForRandomAttack);
                                    responseToGameRoom(typesResponseToGameRoom.turn, data.gameId);
                                }
                            }
                        }
                    }
                    else {
                        if (data.indexPlayer === currentGame.currentPlayer && typeof currentGame.currentPlayer === 'number') {
                            console.log('Атака без бота стреляет currentPlayer', currentGame.currentPlayer);
                            if (currentGame[currentGame.currentPlayer].logShots.findIndex((item) => item.x === data.x && item.y === data.y) === -1) {
                                currentGame[currentGame.currentPlayer].logShots.push({ x: data.x, y: data.y });
                                responseToGameRoom(typesResponseToGameRoom.attack, data.gameId, data);
                                responseToGameRoom(typesResponseToGameRoom.turn, data.gameId);
                            }
                            else {
                                const dataResponse = { currentPlayer: currentGame.currentPlayer };
                                const response = { type: typesResponseToGameRoom.turn, data: JSON.stringify(dataResponse), id: 0 };
                                const currentPlayerID = currentGame.currentRoom.roomUsers[currentGame.currentPlayer].userId;
                                if (currentPlayerID) {
                                    currentPlayerID.send(JSON.stringify(response));
                                }
                            }
                        }
                    }
                }
                return;
            case 'randomAttack':
                console.log('randomAttack');
                const randomCoordinates = getRandomAttackData(data.gameId);
                const dataForRandomAttack = {
                    gameId: data.gameId,
                    x: randomCoordinates.x,
                    y: randomCoordinates.y,
                    indexPlayer: data.indexPlayer,
                };
                responseToGameRoom(typesResponseToGameRoom.attack, data.gameId, dataForRandomAttack);
                responseToGameRoom(typesResponseToGameRoom.turn, data.gameId);
                return;
            case 'single_play':
                console.log('single_play');
                const currentUserSingle = userDb.find((user) => user.userId === ws);
                if (currentUserSingle) {
                    const currentRoom = createRoom({ userId: ws, name: currentUserSingle?.name });
                    addUsersToRoom(currentRoom.roomId, 'bot', 'bot');
                    const randomBotShipsIndex = Math.floor(Math.random() * 4);
                    const currentIdGame = createGame(currentRoom);
                    addShips({ gameId: currentIdGame, ships: bot_ships[randomBotShipsIndex], indexPlayer: 1 });
                    responseToGameRoom(typesResponseToGameRoom.create_game, currentIdGame);
                    responseToGameRoom(typesResponseToGameRoom.start_game, currentIdGame);
                    responseToGameRoom(typesResponseToGameRoom.turn, data.gameId);
                }
                return;
        }
    }
    else {
        wss.clients.forEach((client) => {
            client.send('error');
        });
    }
};
export const getRandomAttackData = (gameId) => {
    const currentGame = gameDb.find((game) => game.idGame == gameId);
    let position = { x: 0, y: 0 };
    if (currentGame) {
        const currentPlayer = currentGame.currentPlayer;
        if (typeof currentPlayer === 'number') {
            const logShots = currentGame[currentPlayer].logShots;
            let isFalse = true;
            while (isFalse) {
                position = getRandomCoordinates();
                const samePosition = logShots.find((shot) => shot.x === position.x && shot.y === position.y);
                if (!samePosition) {
                    isFalse = false;
                }
            }
        }
    }
    return position;
};
const getRandomCoordinates = () => {
    const x = Math.floor(Math.random() * 10);
    const y = Math.floor(Math.random() * 10);
    return { x: x, y: y };
};
