/* yagton's "Image Eraser" script (version 2)
 * Easy to use: just press Ctrl+E, click the image, and it's gone!
 *
 * ACKNOWLEDGEMENT: Setting flush interval to 0 in order to improve
 *                  speed was Nitsua's idea. Thanks for your contribution!
 *
 * This is free and unencumbered software released into the public domain.
 * For more information, please refer to <http://unlicense.org/> */

const ERASE_KB = "CTRL+E";
let erase_mode = false;

function flood(x, y) {
    let nodes = [[x, y]];
    while (nodes.length) {
        let loc = nodes.pop();
        let info = getCharInfoXY(...loc);
        if (info.char === "█" && info.protection === 0) {
            writeCharToXY(" ", "#FFFFFF", ...loc);
            nodes.push([loc[0], loc[1] - 1]);
            nodes.push([loc[0], loc[1] + 1]);
            nodes.push([loc[0] - 1, loc[1]]);
            nodes.push([loc[0] + 1, loc[1]]);
        }
    }
}

w.on("keyDown", e => {
    if (!checkKeyPress(e, ERASE_KB)) return;
    erase_mode = !erase_mode;
    owot.style.cursor = defaultCursor = erase_mode ? "crosshair" : "text";
});

w.on("mouseDown", e => {
    if (!erase_mode) return;
    let x = (e.tileX * tileC) + e.charX,
        y = (e.tileY * tileR) + e.charY;

    erase_mode = false;
    owot.style.cursor = defaultCursor = "text";
    flood(x, y);
});

w.setFlushInterval(0);
