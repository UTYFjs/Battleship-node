import WebSocket from "ws";
import { userDb } from "../db/db.ts";
import { validation } from "../validation.ts/validation.ts";
import { responsePersonal } from "../response/responsePersonal.ts";
import { WsResponse } from '../types/types.ts';
import { responseAll } from '../response/responseAll.ts';


export const handle = async (message: WsResponse, ws: WebSocket, wss: WebSocket.Server) => {
	const data = validation(message);
	if (data) {
		switch (message.type) {
		case "reg":
			// eslint-disable-next-line no-case-declarations
			const currentUser = userDb.find((user) => user.name === data.name);
			if (currentUser) {
				const currentPassword = userDb.find((user) => user.password === data.password);
				if (currentPassword) {
					const indexCurrentUser = userDb.findIndex((user) => user.name === data.name);
					if(indexCurrentUser !== -1){
						userDb[indexCurrentUser].userId = ws;
					}
					responsePersonal(ws);
				} else {
					responsePersonal(ws, true);
				}
			} else {
				userDb.push({ userId: ws, name: data.name, password: data.password });
				responsePersonal(ws);
				responseAll("update_winners");
			}

			return;

		case "create_room":
					console.log("create room")

			return;
		case "add_user_to_room":
			console.log('add_user_to_room');
			return;
		case "add_ships":
			console.log('add_ships');
			return;
		case "attack":
			console.log('attack');
			return;
		case "randomAttack":
			console.log('randomAttack');
			return;
		case "single_play":
			console.log('single_play');

			return;
		}
	} else {
		wss.clients.forEach((client) => {
			client.send("error");
		});
	}
};
