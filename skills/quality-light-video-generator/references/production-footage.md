# Production: AI cinematic clips, UGC and showroom footage

The edit is the footage plus the same QL graphics layer as the 3D reels, drawn transparently on top.

## 1. AI cinematic: prompts for the owner's video tool
One prompt per shot (4–6 shots, 3–5 s each), same room and materials in every shot:

```text
Photorealistic cinematic vertical 9:16 shot for a lighting showroom's ad in Kuwait.
Scene: [room / product / moment, e.g. a modern Kuwaiti majlis at night with warm 3000K cove light and deep anti-glare spots].
Action & camera: [slow push-in / gentle pan / lights fading on layer by layer], smooth, stabilized.
Lighting: physically accurate LED colour temperature, soft shadows, realistic beam angles and reflections, real fixtures.
Materials & style: contemporary Gulf interior, [marble, wood, fabrics], consistent furniture and fixture count across shots.
No people unless stated. Duration [3–5] seconds.
Negative: no text, letters, digits, subtitles, logos, watermarks, signage, invented brand marks, distorted fixtures.
```

Keep the upper 15% and lower 25% visually calm: the chips and logo go there. Ask the owner to send the clips
(any resolution; vertical preferred) and say which shot each file is.

## 2. UGC / showroom footage: guide for the owner
Phone vertical, 4K or 1080p at 30 fps, lens wiped, steady (both hands or a gimbal), the showroom lights on, quiet room,
phone close to the speaker for sound (or a clip-on mic). Film each line 2–3 times; film B-roll: fixtures switching on,
close-ups of products, the beam on a wall, the storefront. Send the files as they are (no edits, no filters).

## 3. Assemble the footage
In `$W` (made with `bash $T/reel/new.sh $W`):
```json
{"clips": [["shot1.mp4", 0.0, 3.5], ["shot2.mp4", 1.0, 5.0]], "keep_audio": false}
```
`python3 cut.py edit.json` → `base.mp4` (1080×1920, 30 fps, scaled + cropped to fill) and prints each cut's time
range. For UGC set `"keep_audio": true`: `base_audio.wav` is the speaker's voice: `cp base_audio.wav vo48.wav` and
use it in `synth.py` like a TTS voice (lower the music).

For AI cinematic with a TTS voice: run `align.py` on the WAV first and cut the clips to the voice's phrase timings.

## 4. Graphics layer
Write `part.js` like a 3D reel but **without backgrounds** (no `bgImg`): only chips, numbers, ✗/✓ marks, the logo
bottom-left, the offer and CTA. `draw(t)` starts with `beginFrame()` and ends with `endFrame(t)`; with
`window.OVERLAY` set the canvas stays transparent and the footage shows through. The final offer/CTA scenes may still
use a dark full-screen panel (draw a rectangle) so the address and WhatsApp read clearly.

Check: `bash build.sh <duration>`, stills look transparent-on-black (normal), so also preview a frame over the footage
with a 1-second overlay render: `node render.js overlay base.mp4 test.mp4 <t> <t+1>`.

## 5. Sound and render
`music.json` + `python3 synth.py` as usual (needs `vo48.wav`; for no-voice styles make a silent one:
`ffmpeg -f lavfi -i anullsrc=r=48000:cl=mono -t <dur> -c:a pcm_s16le vo48.wav`).
`BASE=base.mp4 bash runvid.sh <duration> $W/out/<slug>.mp4` (background). Check 4 frames.
