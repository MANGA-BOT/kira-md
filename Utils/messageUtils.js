export function getMessageInfo(m, hexaBot) {
    // Récupération de l'expéditeur
    const sender = m.key.fromMe ? 
        dvmsy.user.id.split(":")[0] + "@s.whatsapp.net" || dvmsy.user.id.split : 
        m.key.participant || m.key.remoteJid;
    
    // Récupération du texte du message
    let body = (
        m.mtype === 'conversation' ? m.message.conversation :
        m.mtype === 'imageMessage' ? m.message.imageMessage?.caption || '' :
        m.mtype === 'videoMessage' ? m.message.videoMessage?.caption || '' :
        m.mtype === 'extendedTextMessage' ? m.message.extendedTextMessage?.text || '' :
        m.mtype === 'buttonsResponseMessage' ? m.message.buttonsResponseMessage?.selectedButtonId || '' :
        m.mtype === 'listResponseMessage' ? m.message.listResponseMessage?.singleSelectReply?.selectedRowId || '' :
        m.mtype === 'interactiveResponseMessage' ? 
            (m.message.interactiveResponseMessage?.nativeFlowResponseMessage?.paramsJson ? 
                JSON.parse(m.message.interactiveResponseMessage.nativeFlowResponseMessage.paramsJson).id : '') :
        m.mtype === 'templateButtonReplyMessage' ? m.message.templateButtonReplyMessage?.selectedId || '' :
        m.mtype === 'messageContextInfo' ?
            m.message.buttonsResponseMessage?.selectedButtonId ||
            m.message.listResponseMessage?.singleSelectReply?.selectedRowId ||
            m.text || '' :
        ''
    );
    if (body == undefined) body = '';
    
    // Informations de base
    const botNumber = dvmsy.user.id.split(':')[0] + '@s.whatsapp.net';
    const senderNumber = sender.split('@')[0];
    const chatId = m.key.remoteJid;
    
    // Vérifications
    const isGroup = chatId.endsWith('@g.us');
    const isBot = m.key.fromMe;
    
    return {
        sender,
        body,
        chatId,
        botNumber,
        senderNumber,
        isGroup,
        isBot
    };
}

export async function getGroupInfo(m, hexaBot) {
    const chatId = m.key.remoteJid;
    const isGroup = chatId.endsWith('@g.us');
    
    if (!isGroup) {
        return {
            isGroup: false,
            isBotAdmin: false,
            isGroupAdmin: false,
            groupMetadata: null
        };
    }
    
    try {
        const groupMetadata = await hexaBot.groupMetadata(chatId).catch(e => ({}));
        const groupMembers = groupMetadata.participants || [];
        const groupAdmins = groupMembers.filter(p => p.admin).map(p => p.id);
        
        const botNumber = dvmsy.user.id.split(':')[0] + '@s.whatsapp.net';
        const sender = m.key.fromMe ? 
            dvmsy.user.id.split(":")[0] + "@s.whatsapp.net" || dvmsy.user.id : 
            m.key.participant || m.key.remoteJid;
        
        return {
            isGroup: true,
            isBotAdmin: groupAdmins.includes(botNumber),
            isGroupAdmin: groupAdmins.includes(sender),
            groupMetadata
        };
    } catch (error) {
        return {
            isGroup: true,
            isBotAdmin: false,
            isGroupAdmin: false,
            groupMetadata: null
        };
    }
}

export function getUserPermissions(sender) {
    const ownerNumber = "24177474264@s.whatsapp.net";
    const isOwner = sender === ownerNumber;    
    return {
        isOwner,
    };
}