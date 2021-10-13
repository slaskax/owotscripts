/* yagton's "Chat Filter" script (version 2)
 * 
 * This is free and unencumbered software released into the public domain.
 * For more information, please refer to <http://unlicense.org/> */
 
// Chat will be filtered based on these rules:
var filter_rules = {
    // Any message containing strings in this list will be hidden from chat.
    string: ["uwu", "owo", "yiff", "hacked", "hehe"],

    // Anybody with a nickname in this list will be hidden from chat.
    nick: ["hidemymessages"],

    // Any user in this list will be hidden from chat.
    user: [],

    /* Anybody with an ID in this list will be hidden from chat.
     * NOTE: This must be an integer; if you put a string, it won't work. */
    id: []
}

/* This purpose of this one should be pretty obvious given the name.
 * It looks at the currently defined rules to determine if a message
 * should be hidden. */
function shoudHide(event) {
    // Case-insensitive check for disallowed strings.
    for (const i in filter_rules.string) {
        if (event.message.toLowerCase().includes(
            filter_rules.string[i].toLowerCase())) {
            return true;
        }
    }

    // Case-sensitive check for disallowed nicknames.
    for (const i in filter_rules.nick) {
        if (event.nickname === filter_rules.nick[i]) {
            return true;
        }
    }

    // Check for disallowed users.
    for (const i in filter_rules.user) {
        if (event.realUsername === filter_rules.user[i]) {
            return true;
        }
    }

    // Check for disallowed IDs.
    for (const i in filter_rules.id) {
        if (event.id === filter_rules.id[i]) {
            return true;
        }
    }

    return false;
}

/* Adds an anonymous function as a chatmod event listener, which calls
 * shouldHide() to determine if a message should be hidden or not. */
w.on("chatmod", (chat_event) => {
  if (shoudHide(chat_event)) {
    chat_event.hide = true;
  }
});
