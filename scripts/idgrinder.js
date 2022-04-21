/* yagton's ID Grinder (version 6)
 * 
 * I completely rewrote this from scratch because the original was so bad.
 * Here's a list of changes from the original version:
 *    - No longer freezes the whole tab until done.
 *    - Informs you in chat when it is done.
 *    - Has functions to easily stop and restart the grinder.
 *        - idg.stop() and idg.grind()
 * 
 * This is free and unencumbered software released into the public domain.
 * For more information, please refer to <http://unlicense.org/> */

/* This is the part of the code that determines whether or not an ID
 * should be kept or not. Overwrite this with the logic you want.
 * The example code below will simply keep any ID below 100.
 * 
 * If true is returned, it is kept; otherwise it is discarded. */
function isGood(id) {
    return id < 100;
}

/* The idg namespace that all the primary logic is stored inside of.
 *
 * The casual user does not need to worry about how any of this works,
 * but feel free to take a peek anyway if you're curious. */
let idg = (() => {
    let state_t = makeEnum(['running', 'halt', 'off']);
    let state = state_t.off;
    let sock = null;  // hehe sock

    // A function that starts the ID grinding process.
    function startGrinding() {
        // If the grinder has been halted, respond accordingly.
        if (state === state_t.halt) {
            state = state_t.off;
            sock = null;
            return;
        }

        // Create a new socket;
        if (sock !== null) sock.close();
        sock = new WebSocket(ws_path);

        // Add some methods to it.
        sock.onmessage = (e) => {
            let data = JSON.parse(e.data);

            // If it worked, then inform the user and halt.
            if (data.kind === "channel" && isGood(data.id)) {
                clientChatResponse(`Got ID ${data.id}, stopping!`);

                // Make the socket "usable" and replace the default socket with it.
                [sock.onmessage, sock.onerror] = [undefined, undefined];
                socket.socket = sock;
                state = state_t.halt;
            }

            // Call this function again to replace itself.
            startGrinding();
        };

        sock.onerror = startGrinding;
    }

    // The idg.stop() and idg.grind() functions; pretty self-explanatory.
    return {
        stop: () => {
            if (state !== "running")
                throw "IDG is not running, cannot halt!";
            
            clientChatResponse("Halting due to user request.");
            state = state_t.halt;
        },
        grind: () => {
            if (state !== state_t.off)
                throw "Cannot start if already running!";
            
            startGrinding();
        }
    }
})();

// Start the process; omit this line if you don't want it to start instantly.
idg.grind();
