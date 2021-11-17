/* yagton's "Reply" script (version 1)
 * This script adds an /r command to quickly reply to the last PM recieved.
 *
 * This is free and unencumbered software released into the public domain.
 * For more information, please refer to <http://unlicense.org/> */

var last_pm = undefined;

w.on("chatmod", (e) => {
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
