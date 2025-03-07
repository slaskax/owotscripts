/* fern's "News Ticker" script (version 1.3)
 * I saw a neat news ticker on OWOT one day, so I decided to implement
 * my own public-domain version. Change the variables prefixed with
 * `news_` to change the location, width, and contents of the ticker.
 *
 * NOTE: In order to easily set the location, you can enable cursor
 *       coords by clicking the coordinates bar; to enable the bar,
 *       open the menu in the top right and select it.
 *
 * This is free and unencumbered software released into the public domain.
 * For more information, please refer to <http://unlicense.org/> */

let news_location = [-1, -2, 0, 2];
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
    const text = news_text.padEnd(news_width, ' ');
    let subsect = text.slice(Math.max(0, text_pos), text_pos + news_width);

    text_pos += 1;
    if (text_pos > news_text.length)
        text_pos = -news_width;

    subsect = text_pos < 0
        ? subsect.padStart(news_width, ' ')
        : subsect.padEnd(news_width, ' ');


    writeStringAt(subsect, news_color, news_location);
}, 100);

w.setFlushInterval(0);
