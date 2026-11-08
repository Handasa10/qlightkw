# Production: 3D + motion graphics (and the other styles built from 3D renders)

`T` = this skill's `toolkit/` folder. `W` = a fresh scratch folder for this video. Tools needed: node + Playwright
Chromium, ffmpeg, python3 with numpy and Pillow (all present in Claude Code cloud sessions).

## Style rule (the owner's choice, 2026-11-03): like the first videos
The owner wants every reel to look like the first 3D reels (stairs, colours, accent spot), not like a still background
under a dark layer with 2D drawings on top:
- **A 3D scene built for this topic.** Never reuse a room or render from a reel that was already published; if a body
  fits, give it a new layout, views and states for this topic, or write a new body.
- **The light changes inside the 3D scene**: render sequences (`grow:0.15…1`, `age:0.15…1`, step 1…14) and crossfade
  them, so the viewer sees the room light up, age, get fixed. Many renders per reel (25–40), at least one per idea.
- **The render stays bright and visible**: only the top/bottom `shade2` gradients; a full-frame dim is allowed only
  behind the logo/offer and CTA scenes (≤ .55). No 2D diagram as the main picture: build the close-up in 3D (a
  detail station far from the room, like `strip_bed`'s `PX` cove piece) and keep 2D to small labels and chips.
- Text: one title at the top, one chip at the bottom (`title2`, `sub2`, `pop`), timed to the voice.

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
night + path/tree/wall/seat layers), `wardrobe` (doors, shelf/rail/drawer LEDs), `stairs`, `majlis`, `cove_hall` (gypsum cove, voltage drop 12v/24v; `new` white strip vs `aged` cheap strip a year later: yellow, dim, dead patches), `cafe` (flat panels vs pendants + bar spots + shelf LEDs; layer tokens `panels pend bar shelf wash`), `shop` (boutique wall: flat downlights vs track spots + under-shelf linear; tokens `flat track shelf`), `mirror` (vanity: downlight over the head vs side LED bars; tokens `top side bust`; draw faces as 2D diagrams, a sculpted 3D face reads uncanny), `gypsum` (ceiling before closing: grid, drivers + hatches, cables, cove channel, marked spots; presets `open closed hatch test done`), `strip_bed` (master bedroom with a gypsum cove: `new`, `aged`, `age:<0..1>`, `grow:<0..1>`; detail station views `d`/`e`: `flat`, `burn:<0..1>`, `sag`, `prof`, `cover`), `roof` (winter roof terrace at night: tokens `night|dusk + str:<0..1> + wall + path:<0..1>`; detail views `d`/`e` with `ip+rain`), `curtain` (living room curtain wall with a gypsum pelmet: `off|room + wash:<0..1> + dim:<x>`; detail view `d@det` = the pelmet cut open), `stonewall` (courtyard wall built from real 3D stones: `top` flat flood vs `graze:<0..1>` in-ground up-lights; views `w a m`), `kidsroom` (kids' bedroom at night: `off`, `cold` harsh white ceiling light, `night:<0..1>` warm floor-level night lights, `read:<0..1>` dimmable story light; views `w b f`; no faces), `reception` (company lobby: slat logo wall, counter, desk; `panels` flat cold grid vs `logo` spots, `counter` hidden strip, `linear` pendant, `downs`; `design` = all four; views `w c l`), `entrance` (villa entrance at night: stone-clad door frame, `sconce:<0..1>` up/down wall lights, `steps:<0..1>` brick lights in the cheek walls, `num` halo-lit house number, `rain` for IP65; `all` = sconce+steps+num; views `w s n e`), `gym` (home gym: `bulb` one yellow bulb vs `linear:<0..1>` recessed 4000 K anti-glare rows + `mirror` side bars; `all` = linear+mirror; mirror reflects via a cube camera; faceless figure; views `w b m`), `apartment` (rented flat living room: `ceil` one cold ceiling lamp vs `sconce` plug-in wall light with its cord to the socket, `floor` lamp, `table` lamp; `cozy` = all three; `tint:<0..1>` smart-bulb hue; views `w s f`), `warehouse` (tall pallet-rack warehouse: `old` weak yellow lamps vs `hb:<0..1>` LED high-bays row by row, `dust` for IP65; views `w u r d`), `barber` (barber shop: `spot` one spot over the head vs `mirror` 4000 K side bars + `linear` ceiling; `all` = mirror+linear; faceless client; mirror via cube camera; views `w c s`), `perfume` (perfume shop: `panel` flat ceiling panel vs `shelves:<0..1>` strips under glass shelves + backlit panel and `hero` 12–15° spot on the star bottle; `all` = shelves+hero; views `w s h`), `floatbed` (floating bed: `ceil` one ceiling lamp vs `glow:<0..1>` warm strip under a recessed plinth, `path` motion-sensor lights to the door; views `w f n`), `coffee` (home coffee corner: `ceil` far ceiling light vs `strip:<0..1>` hidden strip under the shelf + `pend` small warm pendant; `all` = strip+pend; views `w c s`), `camp` (winter desert camp at night: `flood` one harsh white floodlight on a pole vs `warm:<0..1>` 2700 K string lights + lanterns over the majlis, `path` small aimed floodlight to the cars, `ip` the pole head re-lit warm, `dust` for IP65; `all` = warm+path; views `w s p d`). Each body
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

## 4b. Cover (thumbnail): a real frame of the video, chosen by the owner
The owner's reels that spread widest had a cover he picked himself: the first frame is a real frame of the video that
says what it is about (with its on-screen text), not a designed card. So:
- Don't call `drawCover` in `draw(t)`; the reel starts straight on the hook.
- After the final render, pick the 3 strongest frames (the before/after or reveal moment with its title, the most
  dramatic 3D close-up, the problem shown in the room) and make the numbered sheet:
  `python3 $T/reel/thumbs.py sheet out/<slug>.mp4 t1 t2 t3 thumbs/sheet.jpg`, upload it
  (`studio.py upload … reels/<slug>_covers.jpg`), and queue a card with the picture: insert into `content_questions`
  (`header` «غلاف فيديو …», `question`, 3 `options` with a short label each, `recommended` 0 = your pick,
  `image_url` = the sheet URL), then POST `{"action":"flush"}` to the function. Send it together with media_ready.
- On his answer (the watcher returns it), or with your pick if it is still unanswered when you schedule:
  `python3 $T/reel/thumbs.py apply out/<slug>.mp4 <t> out/<slug>_c.mp4 out/<slug>_cover.jpg` (holds that frame over
  the first 0.6 s), make the Postora copy from `<slug>_c.mp4` and upload it. If the posts were already scheduled with
  the old file, cancel those four and create them again with the new media (same time and captions).

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
