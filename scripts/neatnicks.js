/* yagton's "Neat Nicknames" scritps (version 1)
 * 
 * This is free and unencumbered software released into the public domain.
 * For more information, please refer to <http://unlicense.org/> */

// ---[ Customize your nick here: ]------------------------------------
let nick_left = null;
let nick_right = `]${state.userModel.username}[`;
let colon_on_left = true;
// --------------------------------------------------------------------

function gen_nick(left, right, left_colon) {
    let result = "";

    if (left !== null) result += `${left}${left_colon?"":" "}`;
    if (right !== null) result += `\u202e${right.split("").reverse().join("")}${left_colon?" ":""}`
    if (left_colon) result += "\u202d";

    return result;
}

api_chat_send = new Proxy(api_chat_send, {
    apply: (func, _, args) => {
        if (!args[0].startsWith("/") && !colon_on_left)
            args[0] = "\u202d" + args[0];
        
        let custom_nick = gen_nick(nick_left, nick_right, colon_on_left);
        func(args[0], {nick: custom_nick});
    }
});
