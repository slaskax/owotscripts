/* yagton's "Chat Sounds" script (version 1)
 * This script plays an audible tone when a message is recieved in chat.
 *
 * ACKNOWLEDGEMENT: The user "salt" came up with the idea for this script.
 *                  Thanks salt!
 *
 * This is free and unencumbered software released into the public domain.
 * For more information, please refer to <http://unlicense.org/> */

/* The audio file that is played when a chat message is recieved.
 * By default it's set to some mp3 I found on a royalty-free audio site.
 * Consider to changing this to something else if you don't like it. */
var aud = new Audio("https://files.catbox.moe/vz8x24.mp3");

w.on("chatmod", function (msg) {
    if (!msg.hide) {
        aud.fastSeek(0);
        aud.play();
    }
});
