/* yagton's "Chat Filter" script (version 1)
 * 
 * This is free and unencumbered software released into the public domain.
 * For more information, please refer to <http://unlicense.org/> */
 
// Anything matching this RegEx will be removed from chat.
var filter_pattern = /(uwu|owo|yiff|hacked|hehe)/i
 
var event_on_chat = new Proxy(event_on_chat, {
    apply: function(a, _, b) {
        if (!filter_pattern.test(b[0].message)) {
            return a(b[0]);
        }
    }
});
