import ping from './commands/ping.js';

import { getMessageInfo, getGroupInfo, getUserPermissions } from './Utils/messageUtils.js';

export default async function handlerCommand(dvmsy, hexaBot) {
    // Récupérer les infos du message
    const messageInfo = getMessageInfo(m, hexaBot);
    const { body, sender } = messageInfo;
    
    // Vérification préfixe
    const PREFIX = "👾";
    if (!body.startsWith(PREFIX)) return;
    
    const command = body.slice(PREFIX.length).trim().split(' ').shift().toLowerCase();
    
    // Récupérer les infos supplémentaires si besoin
    const groupInfo = await getGroupInfo(m, hexaBot);
    const userPerms = getUserPermissions(sender);
    
    // Combiner toutes les infos
    const fullMessage = {
        ...m,
        ...messageInfo,
        ...groupInfo,
        ...userPerms,
        command,
        args: body.trim().split(/ +/).slice(1)
    };
    
    // Handler des commandes
    switch(command) {
        case 'ping':
            await ping(fullMessage, dvmsy);
            break;
    }
}