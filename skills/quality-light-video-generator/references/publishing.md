# Publishing with Postora

Postora (connector tools `mcp__postora__*`; load them with tool search if they are deferred) publishes to the owner's
connected accounts. Publishing is public and hard to undo: only do it after the owner approved the final video and
chose the platforms and the time in this run.

## 1. Accounts: QUALITY LIGHT only
`list_accounts`, then pick by username (ids as of 2026-10, re-check every run):
| Platform | Username | id hint |
|---|---|---|
| instagram | quality_light1 | fd85cc1d-6e55-4431-a89d-fdc905f69cea |
| facebook | Quality Light - كواليتي لايت للإضاءة | 06168394-6e00-4c17-a17d-86d10e86335b |
| tiktok | Qualty.light | dba3e398-cc01-44c0-86e7-4df0ceeb2bc6 |
| threads | quality_light1 | a2e16809-63d3-47ce-b385-9e7f8f0ffe91 |
| youtube | Nour Hamdy (personal channel: confirm before the first upload there) | d14be0f4-b967-4469-a9eb-fd355fda8df5 |

The same Postora profile also holds **Smart Energy** accounts (instagram/facebook/threads `smartenergykw`,
`Smart Energy`): never post QL videos there unless the owner asks. If a chosen account is missing or
`check_account_health` says it needs reconnecting, tell the owner to reconnect it in Postora and continue with the others.

## 2. Time
When the owner approved in Telegram, the queue item already has `scheduled_at`: use it as is.
Slots are 09:00, 14:00 and 18:00 Kuwait time (UTC+3, no daylight saving). "Next free slot" = the earliest slot at least
20 minutes from now that no scheduled post already uses: check `list_posts` with status `scheduled`.
Pass `scheduled_at` with the offset, e.g. `2026-11-02T14:00:00+03:00`, and `timezone: "Asia/Kuwait"`.
"Now" = omit `scheduled_at`.

## 3. A public link to the video
Postora fetches media from a public URL (`media_urls`) or its media library (`upload_media` with a URL). Base64 is only
practical for small images, not videos. Host the MP4 on the QL Supabase storage:
```
python3 toolkit/studio.py upload <final.mp4> reels/<yyyy-mm-dd>-<slug>.mp4   # prints the public URL
```
This needs, once (see `docs/CONTENT_STUDIO_SETUP.md` in the repo `handasa10/qlightkw`): the `content-studio` function and
the `content-media` bucket (already deployed on the Qlight project), the `STUDIO_TOKEN` secret in Supabase, and in the
Claude environment settings the domain `yubebbfsmlopmnluajgf.supabase.co` allowed plus the variable `STUDIO_TOKEN`
(same value). The QL Studio Telegram bot needs `STUDIO_TELEGRAM_BOT_TOKEN` in Supabase and the owner's `/start`.
If the upload fails, say exactly which of these is missing (never ask for the token in chat), and hand over the MP4 and
caption so the owner can post from Meta Business Suite at the chosen slot.

**Postora size limit:** Postora fails to fetch files above roughly 12 MB ("Edge Function returned a non-2xx"); 10.5 MB
works. Upload a Postora copy encoded to fit: `ffmpeg -i final.mp4 -c:v libx264 -preset slow -b:v 1300k -maxrate 1950k
-bufsize 2600k -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart final_postora.mp4` (≈ 10 MB for 60 s; lower
the bitrate for longer videos), then `upload_media` with its URL and pass `media_file_ids` to `create_post`.

## 4. Create the posts
One `create_post` per caption variant:
- Instagram **on its own post** (combined with Facebook, Postora published only Facebook and silently dropped
  Instagram): `platforms: ["instagram"]`, its account id, the full caption, the media, `instagram_share_to_feed: true`,
  `scheduled_at`, `timezone`.
- Facebook: `platforms: ["facebook"]`, `facebook_post_type: "reel"`, same caption and time.
- TikTok: `platforms: ["tiktok"]`, the TikTok caption, `tiktok_privacy: "PUBLIC_TO_EVERYONE"`, comments on.
- YouTube Shorts: `youtube_video_type: "short"`, `youtube_title`, `youtube_privacy: "public"`, `youtube_tags`.
- Threads: short caption, same video.
Optional `first_comment` for quiz videos («اكتب A ولا B 👇»).

## 5. Confirm
`get_post` for each id after the slot: every chosen platform must have a `platform_results` entry with `success`;
a platform missing from the results did not publish, so post it again on its own. Report platform results, the Kuwait time, and any warning. If a platform failed, show the error
and offer `retry_failed_post`. To move or cancel later: `reschedule_post` / `cancel_scheduled_post` (cancel only when
the owner asks).
