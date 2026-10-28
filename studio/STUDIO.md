# QUALITY LIGHT content studio — playbook for Claude studio sessions

Scheduled Claude sessions run this playbook to produce the Instagram + Facebook content of QUALITY LIGHT
(lighting showroom in Kuwait). The owner approves every step from the **QL Studio** Telegram bot; the
`content-studio` Supabase function holds the queue, schedules approved posts and publishes them.

```
idea ──owner✅──▶ idea_approved ──session──▶ script_ready ──owner✅──▶ script_approved
     ──session──▶ media_ready ──owner✅──▶ approved (next free slot) ──cron──▶ publishing ──▶ published
owner replies to a bot message ⇒ status "revise" + feedback (revise_from = the step to redo)
```

Slots (Kuwait time): reels 09:00 · 14:00 · 18:00, image posts 11:30 · 20:30 (`python3 studio/studio.py settings`).

## Environment

- `STUDIO_TOKEN` — auth for `studio/studio.py` (content-studio function). `GOOGLE_AI_API_KEY` — Gemini TTS.
- Never print, log or commit these values. Never ask anyone to paste a token in chat.
- Network: the Supabase project host and generativelanguage.googleapis.com must be allowed.
- Once per session: `cd studio/3d && npm install --silent && cd ../..`
- Work folders go in the scratchpad (or `/tmp/studio`), never inside the repo.
- Long renders: run in the background and wait for them; never `pkill`/`pgrep` with a pattern that can match your own shell.

## A session run, in order

1. `python3 studio/studio.py list revise` — redo each item's `revise_from` step using `feedback`, then set the
   status back to `idea` / `script_ready` / `media_ready` (that resends it to the owner).
2. `python3 studio/studio.py list script_approved` — produce media (reel or image), see below. Max **3 reels + 2 images per run**;
   oldest first.
3. `python3 studio/studio.py list idea_approved` — write scripts / post texts → `script_ready`.
4. Keep the pipeline full: count items in `idea`, `idea_approved`, `script_ready`, `script_approved`, `media_ready`, `approved`.
   If fewer than **9 reels or 6 images** are waiting, propose new ideas (`create` with status `idea`).
   Check `topics` first and never repeat a topic or angle.
5. `python3 studio/studio.py notify "..."` — one short Egyptian-Arabic summary of what this run did.

## Brand and content rules

- QUALITY LIGHT — كواليتي لايت · حولي – شارع تونس – مقابل مجمع الرحاب · واتساب +965 5111 1725 · @quality_light1
- Orange `#EF5924`, Cairo font, QL logo (`studio/reel/template/logo3d.png`, `wordmark.png`).
- Standing offer: **سعر التصميم ينخصم عند الشراء** (design fee deducted on purchase). Sign-off: «خلّ بيتك ينوّر صح ✨».
- Technical facts to stay consistent with: 3000K for living/majlis/bedrooms, 4000K for kitchens/bathrooms/work,
  CRI 90+, anti-glare deep spots, 24° or narrower beams for accent, IP44 minimum near water and IP65 in showers and
  outdoors, layers (general + cove + accent + decorative) on dimmers. Never invent prices, stock or product claims.
- Topics: real lighting problems of Kuwaiti homes (majlis, diwaniya, kitchens, villas, gardens, façades, stairs…),
  mistakes, comparisons, before/after, tips. Seasonal angles (Ramadan, winter, Eid, national day) when relevant.

### Ideas (`create`)
`{"kind": "reel"|"image", "topic": "...", "hook": "the first line that stops the scroll", "angle": "what the video shows"}`

### Reel script (`update` → `script_ready`)
- `script`: Kuwaiti Gulf dialect, 10–14 lines, 55–80 s spoken. One `[expression]` tag at the start of every line
  (e.g. `[curious, soft]`). **Numbers spelled out as words** (ثلاث آلاف كلفن، تسعين). Ends with the design-fee offer,
  the address, WhatsApp and «خلّ بيتك ينوّر صح».
- `voice_description`: English, 4–6 sentences: male Kuwaiti voice, late 20s–mid 30s, warm and confident, natural Gulf
  dialect, the emotional arc, medium pace, studio-quality close-mic.
- `caption`: ready-to-post Instagram caption in Kuwaiti/Gulf Arabic: hook, value bullets with ✅/emoji, the offer,
  address + WhatsApp + @quality_light1, 12–16 hashtags (Arabic + English, always #كواليتي_لايت #الكويت #qualitylight).
  Digits are fine in captions.

### Image post (`update` → `script_ready`)
- `script`: the on-image texts (kicker, title ≤ 6 words, 2–4 short rows), and which background render to use.
- `caption`: as above.

## Making a reel

1. `bash studio/reel/new.sh $W` (W = work folder). Save the approved `script` and `voice_description` to text files.
2. Voice: `python3 studio/tts.py script.txt voice.txt $W/vo48.wav && cp $W/vo48.wav $W/vo.wav`.
   Duration: `ffprobe -v error -show_entries format=duration -of csv=p=0 $W/vo.wav`. Reel length = voice + ~0.3 s.
3. Timing: put the spoken lines (without tags) in `lines=[...]` of `$W/align.py`, run `python3 align.py <n> x` in `$W`.
   It prints speech segments (start, end, length, syllable peaks) and a suggested line mapping.
   **Verify the mapping by hand** (short segments are often single words such as «وفجأة…»); shift lines when a
   segment's peak count does not fit. Every on-screen event is keyed to these segment start times.
4. 3D: pick a room in `studio/3d/bodies/` (or write a new body: same head/tail, define `VIEWS` and `window.setState`;
   look at `accent_corner.html` and `living_colors.html`). Test small first, then final size:
   `node studio/3d/shoot.js <body> "view@state;view@state" 540 960 $W/test` → look at a contact sheet →
   `node studio/3d/shoot.js <body> "..." 1080 1920 $W/r`. Name the files you load in `part.js` (`IM.<name>`).
   - Fix lighting until the effect being explained is obvious at phone size (contrast between states!).
   - Transparent helper meshes still darken the image through GTAO: hide them with `visible = false`.
   - Images that only simulate an effect (e.g. low CRI by desaturating in PIL) are fine, but say so in the report.
5. Scenes: write `$W/part.js` — functions `S1..Sn(t)`, the `SCENES` table, `draw(t)` and `init()` loading the renders.
   Start from the closest example in `studio/reel/examples/` (accent_spot.js, furniture_colors.js, garden.js,
   wardrobe.js, stairs.js); helpers: `bgImg keyed flash shade2 title2 sub2 label pop sparkles imgCard glow icon`.
   **No captions/subtitles in the video**, only short headline chips. The QL logo sits bottom-left until the logo scene.
   Arabic + Latin in one string can flip order (e.g. "15° – 24°", "CRI 90+"): check the stills.
6. `bash build.sh <duration>` then `node render.js stills "t1,t2,..."` (one or two stills per scene) → make a contact
   sheet with PIL → look at it and fix overlaps, wrong order, empty frames. Repeat until clean.
7. Sound: write `$W/music.json` (see `examples/furniture_colors.music.json`): `drop` = the reveal moment,
   `hats` ≈ first content scene, `lift` ≈ the offer scene, `end` = duration − 1.8, `transitions` = scene starts,
   `events` = [name, time, gain, ...args] for pop/click/chime/impact/riser/whoosh/thud/coin/crack/buzz on the
   visual beats. `python3 synth.py`.
8. `bash runvid.sh <duration> $W/out/<slug>.mp4` (background; ~20–30 min). Check 4 frames from the result.
9. Upload and hand over:
   ```
   V=$(python3 studio/studio.py upload $W/out/<slug>.mp4 reels/<yyyy-mm-dd>-<slug>.mp4)
   P=$(python3 studio/studio.py upload $W/out/<slug>_preview.mp4 reels/<yyyy-mm-dd>-<slug>_preview.mp4)
   python3 studio/studio.py update <id> "{\"media_url\": \"$V\", \"preview_url\": \"$P\", \"duration_sec\": <d>, \"status\": \"media_ready\"}"
   ```
   The final file must stay under 50 MB (runvid.sh caps the bitrate).

## Making an image post (1080×1350)

Render a background with `studio/3d/shoot.js` at 1080×1350 (or reuse one), copy `studio/post/template.html` to
`studio/post/<slug>.html` with the render as `bg.jpg` next to it, fill in the texts, `node studio/post/shot.js
studio/post/<slug>.html $W/<slug>.jpg`, look at it, delete the temporary html/bg files, upload to
`posts/<yyyy-mm-dd>-<slug>.jpg`, `update` with `media_url` and status `media_ready`.

## Growing the library

When a session builds a new reusable room (3D body) or a strong reel, commit it to the studio branch:
`studio/3d/bodies/<room>.html`, `studio/reel/examples/<slug>.js` and `<slug>.music.json`. Never commit renders,
audio, videos or client-specific project files.
