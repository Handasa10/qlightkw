# Production: 3D + motion graphics (and the other styles built from 3D renders)

`T` = this skill's `toolkit/` folder. `W` = a fresh scratch folder for this video. Tools needed: node + Playwright
Chromium, ffmpeg, python3 with numpy and Pillow (all present in Claude Code cloud sessions).

## 0. Once per session
`cd $T/3d && npm install --silent` (three.js 0.170 for the 3D rooms).

## 1. Work folder
`bash $T/reel/new.sh $W` copies the template: engine, base helpers, fonts, logos, `render.js`, `build.sh`,
`runvid.sh`, `synth.py`, `align.py`, `cut.py`. Copy the voice to `$W/vo.wav` and make the analysis copy:
`ffmpeg -i $W/vo.wav -ac 1 -ar 48000 -c:a pcm_s16le $W/vo48.wav`. Duration: `ffprobe -v error -show_entries
format=duration -of csv=p=0 $W/vo.wav`. Reel length = voice + 0.3 s.

## 2. Timing (the video follows the voice)
Put the spoken lines (no tags) in `lines=[...]` in `$W/align.py`, then `python3 align.py <n> x` in `$W`. It prints the
speech segments (start, end, length, syllable peaks) and a suggested line mapping. **Check the mapping by hand**:
short segments are often one word («لا…», «وفجأة…», «نصيحتي»); if a line's peak count doesn't fit, shift it. Write
down the start time of every phrase; every on-screen event is keyed to these times. Plan scenes so a scene changes
with each idea (typically 10–12 scenes for 60–80 s).

## 3. 3D renders
Rooms in `$T/3d/bodies/`: `living_colors` (sofa, leather chair, walnut table; states show/cold/warm/yellow/mixed),
`accent_corner` (painting + console; mode dark/flat/spot, beam, pos good|bad, cct, cri, dim), `garden` (day/dusk/
night + path/tree/wall/seat layers), `wardrobe` (doors, shelf/rail/drawer LEDs), `stairs`, `majlis`, `cove_hall` (gypsum cove, voltage drop 12v/24v), `cafe` (flat panels vs pendants + bar spots + shelf LEDs; layer tokens `panels pend bar shelf wash`). Each body
defines `VIEWS` (cameras) and `window.setState(string)`; read the body to learn its states.

Shoot: `node $T/3d/shoot.js <body> "view@state;view@state" 540 960 $W/test` (small test) → contact sheet with PIL
→ fix → `node $T/3d/shoot.js <body> "..." 1080 1920 $W/r` (final). Files are named `<view>_<state>.jpg` with `: | +`
turned into `-`; rename them to short keys (`m_warm.jpg`) for `part.js`.

New room or product: write `$T/3d/bodies/<name>.html` in the same style (it is concatenated between `head.html` and
`tail.html`: use the helpers there: `box`, `plane`, `canvasTex`, `woodDraw`, materials `M.*`, `emis`, `plant`).
Lessons:
- Make the lighting difference obvious at phone size; test the extreme states side by side first.
- Transparent helper meshes still darken the image through the AO pass: hide them (`visible = false`).
- Close-up views blow out easily: lower the light, don't raise exposure.
- Effects that can't be rendered physically (e.g. low CRI) can be simulated on the image with PIL; say so in the review.

## 4. Scenes: `$W/part.js`
Start from the closest example in `$T/reel/examples/` (`accent_spot.js`, `furniture_colors.js`, `garden.js`,
`wardrobe.js`, `stairs.js`) and keep its skeleton: helper functions, `S1..Sn(t)`, the `SCENES` table
`[start, end, fn, …]`, `draw(t)` (start it with `beginFrame()`, end with `endFrame(t)`), `init()` loading `IM[key]`.
Useful helpers: `bgImg keyed flash shade2 title2 sub2 label pop sparkles imgCard glow icon sweep drawImg`, and the
per-example ones (`versus` cards ✗/✓, `gauge`, `spectrum`, `beamGauge`, `angleDiagram`, `tip`, `badge`, before/after
slider). Ending: logo scene with the offer (price card «سعر التصميم» struck → «ينخصم عند الشراء»), then the CTA scene
(pin + حولي + شارع تونس, WhatsApp pill +965 5111 1725, logo, «خلّ بيتك ينوّر صح ✨», @quality_light1). QL logo
bottom-left from ~3 s until the logo scene. No subtitles.

Arabic + Latin in one string can flip order ("15° – 24°", "CRI 90+", "+965…"): use `dir: 'ltr'` on pure-Latin
texts, rephrase mixed ones («مؤشر ألوان 90 وفوق»), and always check the stills.

## 4b. Cover (thumbnail)
The first frame is the cover on Instagram, TikTok and Facebook, so every reel opens on a designed cover that holds
0.35 s and dissolves into the hook: `drawCover(COVER)` in `draw(t)` while `t < .6` (alpha `1 - clamp((t - .35) / .25)`),
with `COVER = { img | left+right + leftTag/rightTag, kicker, title: [question, answer], sub }` (title ≤ 2 short lines,
the strongest render, split before/after when the video compares). Don't fade in from black at t = 0. Export the
cover JPG with `node render.js stills 0` (→ `stills/s_0.00.jpg`) and upload it next to the video as `<slug>_cover.jpg`.

## 5. Check stills
`bash build.sh <duration>` then `node render.js stills "t1,t2,…"` (1–2 per scene, plus every tricky moment) → contact
sheet (PIL, e.g. 10 per row at 216×384) → look → fix overlaps, empty frames, wrong order, unreadable text → repeat.

## 6. Sound
Write `$W/music.json` (example: `$T/reel/examples/furniture_colors.music.json`):
`dur`, `drop` (the reveal: beat starts), `hats` (≈ first content scene), `lift` (≈ offer scene: louder pads + claps),
`end` (= duration − 1.8: final chord), `transitions` (scene starts → whoosh), `events` `[name, time, gain, …args]`
with `pop click chime impact riser whoosh thud coin crack buzz` on the visual beats. `python3 synth.py` → `mix.wav`
(voice + ducked music + SFX).

## 7. Render
`bash runvid.sh <duration> $W/out/<slug>.mp4` in the background (~20–30 min for 60–80 s). It writes the final MP4
(< 50 MB) and `<slug>_preview.mp4`. Then extract 4 frames (`ffmpeg -ss t -i … -frames:v 1`) and look at them.
