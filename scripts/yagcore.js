/* yagcore (v1.0.0): a bunch of somewhat-useful things
 * I noticed that a lot of my projects shared very similar, or sometimes
 * even identical pieces of code; so, I put them  here so I don't have to
 * repeat myself. Feel free to use this if you want, though it is first and
 * foremost for my projects, so don't expect a whole ton of fancy features.
 * 
 * yagcore can be included using the code found here:
 *     
 * 
 * This is free and unencumbered software released into the public domain.
 * For more information, please refer to <http://unlicense.org/> */

window.YAGCORE_VERSION = "1.1.2";
window.yagcore = window.yagcore ?? (() => {
    // So we can keep track of any user's last seen ID.
    let user2id = {};

    /* The intercept system is based on how setTimeout works; that is, you
     * call setIntercept, get a number, and disable it with clearIntercept.
     * 
     * format (based on TS syntax):
     * {
     *     "id": number
     *     "kind": string?
     *     "func": Function
     * }
     */
    let intercepts = [
        { // To update user2id with useful data.
            "id": -1,
            "kind": "chat",
            "func": e => {
                if (e.registered)
                    user2id[e.realUsername] = e.id;
            }
        }
    ];
    let intercept_count = 0;

    // Replace the default socket data handler with our own.
    socket.onmessage = (msg) => {
        // Parse the message's data.
        let data = JSON.parse(msg.data);

        // Check if there's any intercepts listening for this.
        for (const handler of intercepts)
            if (!handler.kind || handler.kind === data.kind)
                handler.func(data);

        // Replacement for default OWOT socket handler.
        if (ws_functions[data.kind])
            ws_functions[data.kind](data);
    }

    console.log("[yagcore] loaded");
    return {
        // Load an external script.
        getScript: (url, callback) => {
            var tag = document.createElement("script");
            tag.type = "text/javascript";
            tag.src = url;
            tag.async = false;

            tag.onreadystatechange = callback;
            tag.onload = callback;

            document.head.appendChild(tag);
        },

        // Set kind to null to run on any message.
        setIntercept: (kind, func) => {
            intercepts.unshift({
                "id": intercept_count++,
                "kind": kind,
                "func": func
            });
        },

        clearIntercept: (n) => {
            for (let i = 0; i < intercepts.length; ++i)
                if (intercepts[i].id === n)
                    delete intercepts[i];

            throw `Could not find intercept with ID ${n}!`;
        },

        /* Adds a client-side command; will throw if command already exists.
         * To prevent this when needed, set overwrite to true. */
        addCommand: (cmd, func, overwrite = false) => {
            if (typeof client_commands[cmd] !== "undefined" && !overwrite) {
                throw new Error("This command is already defined!");
            }
        
            client_commands[cmd] = func;
        },

        /* Attempts to figure out a user's ID from observed chat messages.
         * Will return undefined if it cannot be found. */
        getIDFromUser: (user) => {
            return user2id[user];
        },

        // Simplier alternative to addChat.
        textOut: (message, nick, color) => {
            color = color || assignColor(user);
        
            addChat(
                null,
                0,
                "user",
                nick,
                message,
                nick,
                false,
                false,
                false,
                color,
                getDate()
            );
        },

        /* Same thing as textOut(), but it supports HTML output.
         * If you use this, make sure to call html_tag_escape() on anything
         * you don't want rendered as HTML to prevent XSS attacks. */
        htmlOut: (message, nick, color) => {
            color = color || assignColor(user);
        
            addChat(
                null,
                0,
                "user",
                nick,
                message,
                nick,
                true,
                false,
                false,
                color,
                getDate()
            );
        },
    };
})();

// short alias for yagcore
window.yc = window.yagcore;
