/* yagton's "Dark Chat" script (version 1)
 * This script makes the chatox dark themed (specifically Gruvbox Dark).
 *
 * This is free and unencumbered software released into the public domain.
 * For more information, please refer to <http://unlicense.org/> */

(() => {
    const changes = [
        ["#chat_window", "backgroundColor", "#3c3836"],
        ["#chat_close", "backgroundColor", "#cc241d"],
        ["#chat_upper", "color", "#fbf1c7"],
        ["#chatbar", "backgroundColor", "#282828"],
        ["#chatbar", "color", "#fbf1c7"],
        ["#chatbar", "border", "1px solid #1d2021"],
        ["#chatsend", "backgroundColor", "#282828"],
        ["#chatsend", "color", "#fbf1c7"],
        ["#chatsend", "border", "1px solid #1d2021"],
        [".unread", "color", "#fb4934"],
        [".chatfield", "backgroundColor", "#282828"],
        [".chatfield", "color", "#fbf1c7"],
    ];

    for (let i of changes)
        for (let e of document.querySelectorAll(i[0]))
            e.style[i[1]] = i[2];

    // because .chat_tab_selected has to be done differently :ohno:
    let head  = document.getElementsByTagName('head')[0];
    let st = document.createElement('style');
    st.innerHTML = ".chat_tab_selected { background-color: #504945; }";
    head.appendChild(st);
})();
