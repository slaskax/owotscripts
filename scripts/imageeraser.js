/* yagton's "Image Eraser" script (version 1)
 * Easy to use: just press Ctrl+E, click the image, and it's gone!
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
    console.log(e, erase_mode);
    if (!erase_mode) return;
    let x = (e.tileX * tileC) + e.charX,
        y = (e.tileY * tileR) + e.charY;

    erase_mode = false;
    owot.style.cursor = defaultCursor = "text";
    flood(x, y);
});
