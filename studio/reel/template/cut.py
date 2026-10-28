#!/usr/bin/env python3
"""Build the footage edit for AI-video / UGC / store-footage reels.

Usage: python3 cut.py edit.json
edit.json: {"clips": [["clip1.mp4", in_sec, out_sec], ...], "keep_audio": false}
Writes base.mp4 (1080x1920, 30 fps, no audio; each clip scaled+cropped to fill 9:16) and, when keep_audio is true
(UGC: the person on camera is the voice), base_audio.wav at 48 kHz mono to use as vo48.wav.
Prints the cut points so scene timings in part.js can follow the edit.
"""
import json, subprocess, sys

cfg = json.load(open(sys.argv[1], encoding='utf-8'))
parts, t = [], 0.0
for i, (src, a, b) in enumerate(cfg['clips']):
    out = f'_cut_{i}.mp4'
    vf = 'scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,fps=30,setsar=1'
    cmd = ['ffmpeg', '-nostdin', '-y', '-loglevel', 'error', '-ss', str(a), '-to', str(b), '-i', src, '-vf', vf,
           '-c:v', 'libx264', '-crf', '16', '-preset', 'fast', '-pix_fmt', 'yuv420p']
    cmd += ['-c:a', 'pcm_s16le', '-ar', '48000', '-ac', '1', out.replace('.mp4', '.mkv')] if cfg.get('keep_audio') else ['-an', out]
    subprocess.run(cmd, check=True)
    parts.append(out.replace('.mp4', '.mkv') if cfg.get('keep_audio') else out)
    print(f'clip {i}: {src} [{a}-{b}] -> {t:.2f}-{t + b - a:.2f}')
    t += b - a
open('_cuts.txt', 'w').write(''.join(f"file '{p}'\n" for p in parts))
subprocess.run(['ffmpeg', '-nostdin', '-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', '_cuts.txt', '-an', '-c:v', 'copy', 'base.mp4'], check=True)
if cfg.get('keep_audio'):
    subprocess.run(['ffmpeg', '-nostdin', '-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', '_cuts.txt', '-vn', '-c:a', 'pcm_s16le', '-ar', '48000', '-ac', '1', 'base_audio.wav'], check=True)
print(f'base.mp4 {t:.2f}s')
