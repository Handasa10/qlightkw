#!/bin/bash
# Assemble scenes.js from the shared base + helpers and this reel's part.js, and set the duration.  Usage: bash build.sh <duration>
cd "$(dirname "$0")"
(echo "// ===== reel ====="; cat base.js maghelp.js kit_help.js vhelp.js helpers.js part.js) > scenes.js
printf "// No captions in this video\nconst PHRASES = [];\nconst CARDS = [];\nconst DURATION = %s;\nconst FPS = 30;\nif (typeof module !== 'undefined') module.exports = { PHRASES, CARDS, DURATION, FPS };\n" "$1" > timeline.js
