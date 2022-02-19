/* yagton's "Chat Filter" script (version 3.3)
 * This is free and unencumbered software released into the public domain.
 * For more information, please refer to <http://unlicense.org/> */

// Load yagcore library.
await (async () => {
    if (typeof yagcore === "undefined") {
        // change 2e163c0 here to the specific commit you need/want.
        const r = await fetch("https://cdn.jsdelivr.net/gh/tlras/owotscripts@2e163c0/scripts/yagcore.js");
        Function(await r.text())();
    }
})();

// If this flag is set to true, your block list will persist between runs.
const CF_PERSIST = true;

// How the chatfilter response will look.
const CF_USER = ["[ ChatFilter ]", "#333"];

/* Internally used variable for keeping track of filter rules.
 * These are the default values for it. They can (and should) be changed
 * using client commands, not directly. */
const filter_rules_defaults = "{\"string\":[],\"nick\":[],\"user\":[],\"id\":[]}";
var filter_rules = JSON.parse(filter_rules_defaults);

/**********************************************************
 * PERSISTENCE AND TAB SYNCHRONIZATION
 *********************************************************/

if (CF_PERSIST) {
    // Load existing settings from localStorage, if they exist.
    filter_rules = Object.assign(
        filter_rules,
        JSON.parse(localStorage.getItem("cf_rules"))
    );
}

/* Saves the contents of filter_rules to localStorage.
 * Note that IDs are excluded, since they frequently change. */
function saveRules() {
    var copy = Object.assign({}, filter_rules);
    delete copy.id;

    localStorage.setItem("cf_rules", JSON.stringify(copy));
}

/**********************************************************
 * CLIENT COMMANDS:
 *     * /block list
 *           lists all enabled blocks      
 *     * /block (string|nick|user|id) [value]
 *           block according to provided type and value
 *     * /unblock (string|nick|user|id) [value]
 *           same syntax as /block, but it removes it
 *     * /unblock all
 *           removes all blocks
 *********************************************************/
const CF_RETURNS = {
    ALREADY_EXISTS: 0,
    RULES_CHANGED: 1,
    DOES_NOT_EXIST: 2,
    CUSTOM_OUTPUT: 3
}

var block_subcommands = {
    string: (args) => {
        var str = args.join(" ");
        if (filter_rules.string.indexOf(str) === -1) {
            filter_rules.string.push(str);
            return CF_RETURNS.RULES_CHANGED;
        } else {
            return CF_RETURNS.ALREADY_EXISTS;
        }
    },
    nick: (args) => {
        var name = args.join(" ");
        if (filter_rules.nick.indexOf(name) === -1) {
            filter_rules.nick.push(name);
            return CF_RETURNS.RULES_CHANGED;
        } else {
            return CF_RETURNS.ALREADY_EXISTS;
        }
    },
    user: (args) => {
        var usr = args.join(" ");
        if (filter_rules.user.indexOf(usr) === -1) {
            filter_rules.user.push(usr);
            return CF_RETURNS.RULES_CHANGED;
        } else {
            return CF_RETURNS.ALREADY_EXISTS;
        }
    },
    id: (args) => {
        var id = parseInt(args[0]);
        if (Number.isNaN(id)) {
            yc.textOut("Invalid ID.", ...CF_USER);
            return CF_RETURNS.CUSTOM_OUTPUT;
        }

        if (filter_rules.id.indexOf(id) === -1) {
            filter_rules.id.push(id);
            return CF_RETURNS.RULES_CHANGED;
        } else {
            return CF_RETURNS.ALREADY_EXISTS;
        }
    },
    list: (_) => {
        var out = "Your block list:<br>";

        out += `=== Strings (${filter_rules.string.length})<br>`;
        for (const i of filter_rules.string) {
            out += `&nbsp;&nbsp;* ${html_tag_esc(i)}<br>`;
        }

        out += `=== Nicknames (${filter_rules.nick.length})<br>`;
        for (const i of filter_rules.nick) {
            out += `&nbsp;&nbsp;* ${html_tag_esc(i)}<br>`;
        }

        out += `=== Users (${filter_rules.user.length})<br>`;
        for (const i of filter_rules.user) {
            out += `&nbsp;&nbsp;* ${html_tag_esc(i)}<br>`;
        }

        out += `=== IDs (${filter_rules.id.length})<br>`;
        for (const i of filter_rules.id) {
            out += `&nbsp;&nbsp;* ${html_tag_esc(i.toString())}<br>`;
        }

        yc.htmlOut(out, ...CF_USER);
        return CF_RETURNS.CUSTOM_OUTPUT;
    }
};

var unblock_subcommands = {
    string: (args) => {
        var str = args.join(" ");
        var idx = filter_rules.string.indexOf(str);
        if (idx === -1) return CF_RETURNS.DOES_NOT_EXIST;

        filter_rules.string.splice(idx, 1);
        return CF_RETURNS.RULES_CHANGED;
    },
    nick: (args) => {
        var name = args.join(" ");
        var idx = filter_rules.nick.indexOf(name);
        if (idx === -1) return CF_RETURNS.DOES_NOT_EXIST;

        filter_rules.nick.splice(idx, 1);
        return CF_RETURNS.RULES_CHANGED;
    },
    user: (args) => {
        var usr = args.join(" ");
        var idx = filter_rules.user.indexOf(usr);
        if (idx === -1) return CF_RETURNS.DOES_NOT_EXIST;

        filter_rules.user.splice(idx, 1);
        return CF_RETURNS.RULES_CHANGED;
    },
    id: (args) => {
        var id = parseInt(args[0]);
        if (Number.isNaN(id)) {
            yc.textOut("Invalid ID.", ...CF_USER);
            return CF_RETURNS.CUSTOM_OUTPUT;
        }

        var idx = filter_rules.id.indexOf(id);
        if (idx === -1) return CF_RETURNS.DOES_NOT_EXIST;

        filter_rules.id.splice(idx, 1);
        return CF_RETURNS.RULES_CHANGED;
    },
    all: (_) => {
        filter_rules = JSON.parse(filter_rules_defaults);
        saveRules();
        yc.textOut("Block list has been cleared.", ...CF_USER);
        return CF_RETURNS.CUSTOM_OUTPUT;
    }
};

// Add the extented /block command to chat.
yc.addCommand("block", (args) => {
    if (args.length < 1) {
        yc.textOut("No subcommand provided.", ...CF_USER);
        return;
    }

    if (block_subcommands[args[0]] !== undefined) {
        var ret = block_subcommands[args[0]](args.slice(1));
        switch (ret) {
            case CF_RETURNS.RULES_CHANGED:
                if (CF_PERSIST) saveRules();
                yc.textOut("Rule has been added.", ...CF_USER)
                break;
            case CF_RETURNS.ALREADY_EXISTS:
                yc.textOut("Rule already exists.", ...CF_USER);
                break;
        }
    } else {
        yc.textOut("Unknown subcommand.", ...CF_USER)
    }
});

// Add the /unblock command.
yc.addCommand("unblock", (args) => {
    if (args.length < 1) {
        yc.textOut("No subcommand provided.", ...CF_USER);
        return;
    }

    if (unblock_subcommands[args[0]] !== undefined) {
        var ret = unblock_subcommands[args[0]](args.slice(1));
        switch (ret) {
            case CF_RETURNS.RULES_CHANGED:
                if (CF_PERSIST) saveRules();
                yc.textOut("Rule has been removed.", ...CF_USER);
                break;
            case CF_RETURNS.DOES_NOT_EXIST:
                textOut("Rule does not exist.");
                break;
        }
    } else {
        yc.textOut("Unknown subcommand.", ...CF_USER);
    }
});

/**********************************************************
 * MAIN CHAT FILTERING CODE
 *********************************************************/

/* This purpose of this one should be pretty obvious given the name.
 * It looks at the currently defined rules to determine if a message
 * should be hidden. */
function shoudHide(event) {
    // Case-insensitive check for disallowed strings.
    for (const i of filter_rules.string) {
        if (event.message.toLowerCase().includes(i.toLowerCase())) {
            return true;
        }
    }

    // Case-sensitive check for disallowed nicknames.
    for (const i of filter_rules.nick) {
        if (event.nickname === i) {
            return true;
        }
    }

    // Check for disallowed users.
    for (const i of filter_rules.user) {
        if (event.realUsername === i) {
            return true;
        }
    }

    // Check for disallowed IDs.
    for (const i of filter_rules.id) {
        if (event.id === i) {
            return true;
        }
    }

    return false;
}

/* Adds an anonymous function as a chatmod event listener, which calls
 * shouldHide() to determine if a message should be hidden or not. */
w.events["chatmod"] = w.events["chatmod"] || [];
w.events["chatmod"].unshift((chat_event) => {
    if (shoudHide(chat_event)) {
        chat_event.hide = true;
    }
});
