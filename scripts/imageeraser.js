/* yagton's "Image Eraser" script (version 4)
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
    let already_checked = new Set();
    while (nodes.length) {
        let loc = nodes.shift();
        let info = getCharInfoXY(...loc);
        if (info.char === "█" && info.protection === 0) {
            writeCharToXY(" ", "#FFFFFF", ...loc);
            let neighbors = [[loc[0], loc[1] + 1],
                              [loc[0] + 1, loc[1]],
                              [loc[0], loc[1] - 1],
                              [loc[0] - 1, loc[1]]];
            
            for (let i of neighbors) {
                if (already_checked.has(i)) continue;
                already_checked.add(i);
                nodes.push(i);
            }
        }
    }
}

w.on("keyDown", e => {
    if (checkKeyPress(e, keyConfig.reset))
        erase_mode = false;
    else if (checkKeyPress(e, ERASE_KB))
        erase_mode = !erase_mode;

    owot.style.cursor = erase_mode ? "crosshair" : defaultCursor;
});

w.on("mouseDown", e => {
    if (!erase_mode) return;
    let x = (e.tileX * tileC) + e.charX,
        y = (e.tileY * tileR) + e.charY;

    erase_mode = false;
    flood(x, y);
});

w.setFlushInterval(0);
