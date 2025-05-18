import { UpdateType } from '../types/types.ts';
import { wss } from '../ws_server/wsServer.ts';
import { prepareDataForUpdateRoom, prepareDataForUpdateWinners } from './utils.ts';
export const responseAll = (type) => wss.clients.forEach((client) => {
    client.send(type === UpdateType.UPDATE_ROOM ? prepareDataForUpdateRoom() : prepareDataForUpdateWinners());
});
