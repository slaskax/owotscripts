/* yagton's "Chat Enabler" script (version 2)
 * This script re-enables chat on a world that had it disabled by the owner.
 *
 * This is free and unencumbered software released into the public domain.
 * For more information, please refer to <http://unlicense.org/> */

(() => {
    if (Permissions.can_chat(state.userModel, state.worldModel)) return;

    let w_url = `ws${window.location.protocol == "https:" ? "s" : ""}://${
        window.location.host
    }/w${state.worldModel.pathname}/ws/${window.location.search || ""}`;
    let sock = new WebSocket(w_url);

    sock.onopen = () => {
        window.selectedChatTab = 0;
        ws_functions.propUpdate({props: [{type: "chat", value: 0}]});
        w.showChat();
        elm.chat_open.style.backgroundColor = "#990000";

        sock.onmessage = msg => {
            let data = JSON.parse(msg.data);
            if (data.kind.startsWith("chat")
               || ["channel", "user_count"].includes(data.kind)) {
                ws_functions[data.kind](data);
            }
        };

        sock.send(JSON.stringify({ kind: "chathistory" }));
        w.on("chat", e => {
            w.emit("chatmod", e);
            if (e.hide) return;
            event_on_chat(e);
        });
        
        network.chat = (message, location, nickname, color) => {
            sock.send(JSON.stringify({
                kind: "chat",
                nickname,
                message,
                location,
                color,
            }));
        };
    };
})();
