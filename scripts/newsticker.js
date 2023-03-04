/* yagton's "News Ticker" script (version 1)
* I saw a neat news ticker on OWOT one day, so I decided to implement
* my own public-domain version. Change the variables prefixed with
* `news_` to change the location, width, and contents of the ticker.
*
* This is free and unencumbered software released into the public domain.
* For more information, please refer to <http://unlicense.org/> */

let news_location = [-1, -2, 0, 2 ];
let news_width = 32;

let news_text = "put your news text here! it can be as long as you want"
let news_color = 0xcc241d;

function writeStringAt(s, color, loc) {
    for (const ch of s) {
        writeCharTo(ch, color, ...loc, true);
        loc = coordinateAdd(...loc, 0, 0, 1, 0);
    }
}

let text_pos = -news_width;
setInterval(() => {
    let subsect = TEXT.slice(Math.max(0, text_pos), text_pos + news_width);

    text_pos += 1;
    if (text_pos > TEXT.length)
        text_pos = -news_width;

    subsect = text_pos < 0
        ? subsect.padStart(news_width, ' ')
        : subsect.padEnd(news_width, ' ');


    writeStringAt(subsect, 0xcc241d /* color */, news_location);
}, 100);

w.setFlushInterval(0);
