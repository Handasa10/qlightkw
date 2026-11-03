#!/usr/bin/env python3
"""Cover (thumbnail) from the video itself: the owner picks one of a few real frames, and it becomes the first frame.

  python3 thumbs.py sheet <video.mp4> <t1> <t2> <t3> [...] <sheet.jpg>
      grabs the frames at those times and lays them side by side with big numbers 1, 2, 3 (sent to the bot as a card)
  python3 thumbs.py apply <video.mp4> <t> <out.mp4> [<cover.jpg>]
      the frame at <t> is held over the first 0.6 s of the video (so it is the cover on Instagram, TikTok and Facebook),
      audio untouched; also writes it as <cover.jpg> when given
"""
import subprocess, sys, tempfile, os
from PIL import Image, ImageDraw, ImageFont

HOLD = 0.6
FONT = os.path.join(os.path.dirname(__file__), 'template', 'fonts', 'cairo4.ttf')


def grab(video, t, out):
    subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-ss', str(t), '-i', video, '-frames:v', '1', '-q:v', '2', out], check=True)
    return out


def sheet(video, times, out):
    tmp = tempfile.mkdtemp()
    w, h = 432, 768
    sh = Image.new('RGB', (w * len(times) + 24 * (len(times) + 1), h + 48), '#0b0a0d')
    d = ImageDraw.Draw(sh)
    font = ImageFont.truetype(FONT, 110) if os.path.exists(FONT) else ImageFont.load_default()
    for i, t in enumerate(times):
        im = Image.open(grab(video, t, f'{tmp}/f{i}.jpg')).resize((w, h))
        x = 24 + i * (w + 24); sh.paste(im, (x, 24))
        d.ellipse([x + w - 150, h - 170, x + w - 20, h - 40], fill='#EF5924')  # bottom-right: clear of the titles
        d.text((x + w - 85, h - 105), str(i + 1), font=font, fill='white', anchor='mm')
    sh.save(out, quality=90)


def apply(video, t, out, cover=None):
    tmp = tempfile.mkdtemp()
    frame = grab(video, t, f'{tmp}/cover.jpg')
    if cover:
        Image.open(frame).save(cover, quality=92)
    subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', video, '-loop', '1', '-t', str(HOLD), '-i', frame,
                    '-filter_complex', f"[1:v]scale=iw:ih,setsar=1[c];[0:v][c]overlay=0:0:enable='lt(t,{HOLD})'[v]",
                    '-map', '[v]', '-map', '0:a?', '-c:v', 'libx264', '-crf', '18', '-preset', 'medium', '-pix_fmt', 'yuv420p',
                    '-c:a', 'copy', '-movflags', '+faststart', out], check=True)


if __name__ == '__main__':
    cmd, args = sys.argv[1], sys.argv[2:]
    if cmd == 'sheet':
        sheet(args[0], [float(a) for a in args[1:-1]], args[-1])
    elif cmd == 'apply':
        apply(args[0], float(args[1]), args[2], args[3] if len(args) > 3 else None)
    else:
        sys.exit(__doc__)
