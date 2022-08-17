/* yagton's Socket Pocket (version 1)
 * The purpose of this script allows you to use OWOT with multiple sockets
 * without the need for multiple tabs to be open.
 * 
 * Command list:
 *     * /socks         - lists sockets slots
 *     * /newsock       - make a new socket slot initialized with a new socket
 *     * /chsock <id>   - change to the provided socket slot
 *     * /delsock <id>  - remove the listed slot and close its socket
 * 
 * This is free and unencumbered software released into the public domain.
 * For more information, please refer to <http://unlicense.org/> */

let sslot_idx = 1;
let curr_slot = 0;
let sslots = {0: socket.socket};
const YG_SP_USER = ["[ Socket Pocket ]", "#3333ff"];

function inform(message, name, color, allow_html = false) {
    if (typeof name === "undefined")
        throw new Error("No name provided.");
    color = color ?? assignColor(name);

    addChat(
        null,
        0,
        "user",
        name,
        message,
        name,
        allow_html,
        false,
        false,
        color,
        getDate()
    );
}

client_commands.socks = () => {
    let out = ["Current socket slots:<pre style='margin-top:0px'>"];
    for (const i in sslots)
        if (i == curr_slot)
            out.push(`  - <b>*[${i}]</b>\n`);
        else
            out.push(`  - [${i}]\n`);
    out.push("</pre>");
    
    inform(out.join(""), ...YG_SP_USER, true);
}

client_commands.newsock = () => {
    sslots[sslot_idx++] = new WebSocket(ws_path);
    inform(`Added new slot #${sslot_idx-1}.`, ...YG_SP_USER);
}

client_commands.chsock = (args) => {
    if (!args.length) return;
    let id = parseInt(args[0]);
    if (Number.isNaN(id) || !sslots.hasOwnProperty(id))
        inform("Invalid ID.", ...YG_SP_USER);
    
    socket.socket = sslots[id];
    inform(`Changed to slot #${id}.`);
}

client_commands.delsock = (args) => {
    if (!args.length) return;
    let id = parseInt(args[0]);
    if (Number.isNaN(id) || !sslots.hasOwnProperty(id))
        inform("Invalid ID.", ...YG_SP_USER);
    
    sslots[id].close();
    delete sslots[id];
    inform(`Removed slot #${id}.`);
}
