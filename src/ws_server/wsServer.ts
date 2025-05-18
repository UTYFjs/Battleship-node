import { WebSocketServer } from "ws";
import { handle } from "./handle.ts";
import { WsResponse } from '../types/types.ts';


export const wss = new WebSocketServer({port: 3000});

wss.on("connection", function connection(ws) {
	console.log("there are connection websocket");
	// ws - одно подключение
	ws.on("error", console.error);

	ws.on("message",  (message) =>  {
		const messageParsed = JSON.parse(message.toString()) as WsResponse;
	console.log('message got', messageParsed);
		handle(messageParsed, ws, wss);
	});

	ws.on("close", () => {
	
		console.log("Client disconnected");
	});
});