/* yagton's "Chat Filter" script (version 1.2)
 * 
 * This is free and unencumbered software released into the public domain.
 * For more information, please refer to <http://unlicense.org/> */
 
// Anything matching this RegEx will be removed from chat.
var filter_pattern = /(uwu|owo|yiff|hacked|hehe)/i
 
w.on("chatmod", function (chat_event) {
  if (filter_pattern.test(chat_event.message)) {
    chat_event.hide = true;
  }
});
