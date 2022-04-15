/* yagton's "Reply" script (version 1.1)
 * This script adds an /r command to quickly reply to the last PM recieved.
 *
 * NOTE: The functionality of the script has been moved to Chat++,
 *       and no more updates will occur for this reason.
 *       Go to [https://github.com/tlras/chatpp] for updates.
 *
 * This is free and unencumbered software released into the public domain.
 * For more information, please refer to <http://unlicense.org/> */

var last_pm = undefined;

w.on("chatmod", (e) => {
    if (e.hide) return;
    
    if (e.dataObj.privateMessage && e.dataObj.privateMessage == "to_me") {
        last_pm = e.id;
    }
});

client_commands = Object.assign(client_commands, {
    r: (args) => {
        if (last_pm === undefined) {
            clientChatResponse("You have not recived any PMs yet!");
            return;
        }

        api_chat_send(`/tell ${last_pm} ${args.join(" ")}`);
    }
});
