/* yagton's "ID Grinder" script (version 5)
 * NOTICE: While running this script, your OWOT tab will be effectively frozen
 *         until it's finished, and any chat messages/edits made during this
 *         time may not be received/sent by your client.
 * 
 * This is free and unencumbered software released into the public domain.
 * For more information, please refer to <http://unlicense.org/> */

// Keeps track of program state to prevent two copies from running at the
// same time. Set idg_state to -1 to stop the script prematurely.
var idg_state = idg_state || 0;

// This function is used to determine if an ID is to be kept. For most people,
// it's the only part of the script you should need to modify. By default, it
// returns true if the ID is in the COOL_IDS array or is less than 100.
var COOL_IDS = [420, 6969, 666, 1337, 2021];
function isGood(a) {
    return COOL_IDS.includes(a) || a < 100;
}

// Tip: If you want to start the script again after you've loaded it once,
// you can just rerun this function; no need to load the whole script again.
function grindID() {
    // Set reconnectTimeout to 0 to improve speed.
    var oldTimeout = socket.reconnectTimeout;
    socket.reconnectTimeout = 0;
    
    // Make sure there aren't any other instances.
    if (idg_state != 0) {
        console.log("An instance of this script is already running! Refusing to start.");
        return;
    }
    idg_state = 1;

    // Proxies ws_functions.channel() to intercept when a new ID is received from
    // the server. If the ID is approved by isGood(), the proxy is removed and
    // the original function then runs normally; but if it's not approved, it will
    // run socket.refresh() again and again until it eventually is.
    var old_function = ws_functions.channel;

    ws_functions.channel = new Proxy(ws_functions.channel, {
        apply: function(target, _, args) {
            if (isGood(args[0].id) || idg_state == -1) {
                console.log(`Stopping! Your new ID is: ${args[0].id}`);
                idg_state = 0;
                
                // Restore environment to what it was previously set to.
                ws_functions.channel = old_function;
                socket.reconnectTimeout = oldTimeout;
                
                return target(...args);
            } else {
                socket.refresh();
            }
        }
    });

    // Generates a new ID, and due to the code above, it will keep rerunning until
    // you get your desired ID.
    socket.refresh();
}

// Begin grinding a new ID.
grindID();
