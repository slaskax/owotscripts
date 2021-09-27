/* yagton's "Watchtower" script (version 2)
 * This is a simple script that opens a WebSocket and listens for tileUpdate messages.
 * After it recieves such a message, it will output the location of the update to the console.
 * The purpose of this script is so you can see where edits are happening on an OWOT world.
 * Please do not use this for malicious purposes.
 * 
 * WARNING: This script has a known "off-by-one" bug. I have tried several times to fix it,
 *          but have not succeeded. If you find out how to fix it, *please* let me know.
 * 
 * This is free and unencumbered software released into the public domain.
 * For more information, please refer to <http://unlicense.org/> */

w.socket.onmessage = new Proxy(w.socket.onmessage, {
  apply: function(func, _, args) {
    var data = JSON.parse(args[0].data);
    if (data.kind == "tileUpdate") {
      for (const i in data.tiles) {
        var nums = i.split(',').map(x => parseInt(x));
        var positionX = Math.floor(nums[1] / coordSizeX);
        var positionY = Math.floor(-nums[0] / coordSizeY);
        console.log(`tileUpdate at ${positionX}, ${positionY}.`);
      }
    }

    func(...args);
  }
});
