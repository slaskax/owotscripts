/* yagton's "ID Grinder" script (version 3.2)
 * NOTICE: While running this script, your OWOT tab will be effectively frozen
 *         until it's finished, and any chat messages/edits made during this
 *         time may not be received/sent by your client.
 * 
 * This is free and unencumbered software released into the public domain.
 * For more information, please refer to <http://unlicense.org/> */

// Set this variable to true to stop the script prematurely.
var IDG_KILL = false;

// Used by the isGood() function; more info there.
var COOL_IDS = [420, 6969, 666, 1337, 2021];

// This function is used to determine if an ID is to be kept. For most people,
// it's the only part of the script you should need to modify. By default, it
// returns true if the ID is in the COOL_IDS array or is less than 100.
function isGood(a) {
    return COOL_IDS.includes(a) || a < 100;
}

// Proxies ws_functions.channel() to intercept when a new ID is received from
// the server. If the ID is approved by isGood(), the proxy is removed and
// the original function then runs normally; but if it's not approved, it will
// run socket.refresh() again and again until it eventually is.
var old_function = ws_functions.channel;

ws_functions.channel = new Proxy(ws_functions.channel, {
    apply: function(target, _, args) {
        if (isGood(args[0].id) || IDG_KILL) {
            console.log(`Stopping! Your new ID is: ${args[0].id}`);
            ws_functions.channel = old_function;
            return target(...args);
        } else {
            socket.refresh();
        }
    }
});

// Generates a new ID, and due to the code above, it will keep rerunning until
// you get your desired ID.
socket.refresh();
