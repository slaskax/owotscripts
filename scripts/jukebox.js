/* yagton's "Jukebox" script (version 1)
 * This is a script plays songs randomly from a list and adds some controls
 * to the menu. It's pretty simplistic right now and may be extended later.
 *
 * This is free and unencumbered software released into the public domain.
 * For more information, please refer to <http://unlicense.org/> */

 let tunes = [
    /* put the url to the song files you want here; the file host must allow CORS
     * the defaults are just for example, replace them with whatever ya like */
    "https://files.catbox.moe/sqb10t.m4a",
    "https://files.catbox.moe/e9tesm.m4a",
    "https://files.catbox.moe/hxabbj.m4a",
    "https://files.catbox.moe/y0423x.m4a",
    "https://files.catbox.moe/izkjwn.m4a",
    "https://files.catbox.moe/in91r2.m4a",
    "https://files.catbox.moe/p42s5n.m4a",
    "https://files.catbox.moe/e0wze0.m4a",
    "https://files.catbox.moe/1jpjfr.m4a",
    "https://files.catbox.moe/2728vv.m4a",
    "https://files.catbox.moe/xjgmig.m4a",
];

let autoplay = true;
let current_audio = null;
let volume = localStorage.getItem("last_volume") ?? 0.5;

function change_song() {
    if (current_audio !== null) {
        current_audio.pause();
        current_audio = null;
    }

    current_audio = new Audio(tunes[Math.floor(Math.random() * tunes.length)]);
    current_audio.volume = volume;

    current_audio.addEventListener("canplaythrough", () => {
        current_audio.play();
    });

    current_audio.addEventListener("ended", () => {
        if (autoplay) {
            change_song();
        } else {
            current_audio = null;
        }
    });
}

function toggle_playback() {
    if (current_audio === null) {
        return change_song();
    }

    if (current_audio.paused) {
        current_audio.play();
    } else {
        current_audio.pause();
    }
}

menu.addOption("Play/pause audio", toggle_playback);
menu.addOption("Change song", change_song);

menu.addEntry((() => {
    let container = document.createElement("div");

    let header_text = document.createElement("p");
    header_text.innerHTML = "<b>Volume:</b>";
    container.appendChild(header_text);

    let volume_bar = document.createElement("input");
    volume_bar.setAttribute("type", "range");
    volume_bar.setAttribute("min", "0");
    volume_bar.setAttribute("max", "100");
    volume_bar.value = volume * 100;
    volume_bar.style.width = "100%";
    volume_bar.addEventListener("change", () => {
        volume = volume_bar.value / 100;
        localStorage.setItem("last_volume", volume);
        if (current_audio !== null) {
            current_audio.volume = volume;
        }
    });
    container.appendChild(volume_bar);

    return container;
})());

menu.addCheckboxOption(
    "Autoplay",
    () => (autoplay = true),
    () => (autoplay = false),
    false
);
