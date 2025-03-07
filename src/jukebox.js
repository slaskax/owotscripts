/* fern's "Jukebox" script (version 3.1)
 * This is a script plays songs randomly from a list and adds some controls
 * to the menu. It's pretty simplistic right now and may be extended later.
 *
 * This is free and unencumbered software released into the public domain.
 * For more information, please refer to <http://unlicense.org/> */

let tunes = [
    /* put the url to the song files you want here; any file host should work
     * the defaults are just for example, replace them with whatever ya like */
    "https://files.catbox.moe/hkmis2.m4a",
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

let current_audio = null;
let autoplay = JSON.parse(localStorage.getItem("autoplay")) ?? true;
let volume = JSON.parse(localStorage.getItem("last_volume")) ?? 0.5;

function change_song() {
    if (current_audio !== null) {
        current_audio.pause();
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
    volume_bar.setAttribute("max", "1");
    volume_bar.setAttribute("step", "0.01");
    volume_bar.value = volume;
    volume_bar.style.width = "100%";
    volume_bar.addEventListener("input", () => {
        volume = volume_bar.value;
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
    () => {
        autoplay = true;
        localStorage.setItem("autoplay", true);
    },
    () => {
        autoplay = false;
        localStorage.setItem("autoplay", false);
    },
    autoplay
);
