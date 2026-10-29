#!/bin/bash
# Render the reel in 4 parallel chunks, then mux with mix.wav.
#   bash runvid.sh <duration> <out.mp4>              motion-graphics reel (3D renders + graphics)
#   BASE=base.mp4 bash runvid.sh <duration> <out.mp4>  graphics over a footage edit made with cut.py (AI clips / UGC / store footage)
set -e
cd "$(dirname "$0")"
DUR=$1; OUT=$2; mkdir -p "$(dirname "$OUT")"
P=$(python3 -c "d=$DUR;print(' '.join(str(round(d*i/4,2)) for i in range(5)))"); read -r a b c d e <<< "$P"
if [ -n "$BASE" ]; then R="node render.js overlay $BASE"; else R="node render.js video"; fi
$R c_1.mp4 $a $b > log_1.txt 2>&1 &
$R c_2.mp4 $b $c > log_2.txt 2>&1 &
$R c_3.mp4 $c $d > log_3.txt 2>&1 &
$R c_4.mp4 $d $e > log_4.txt 2>&1 &
wait
printf "file 'c_1.mp4'\nfile 'c_2.mp4'\nfile 'c_3.mp4'\nfile 'c_4.mp4'\n" > list.txt
ffmpeg -nostdin -y -loglevel error -f concat -safe 0 -i list.txt -c copy vid.mp4
ffmpeg -nostdin -y -loglevel error -i vid.mp4 -i mix.wav -map 0:v -map 1:a -c:v libx264 -preset medium -crf 19 -maxrate 3800k -bufsize 7600k -pix_fmt yuv420p -af "loudnorm=I=-14:TP=-1.5:LRA=11" -ar 48000 -c:a aac -b:a 192k -shortest -movflags +faststart "$OUT"
# small preview for chat / Telegram (bots can only fetch files up to 20 MB by URL)
ffmpeg -nostdin -y -loglevel error -i "$OUT" -vf scale=540:-2 -c:v libx264 -crf 30 -preset veryfast -c:a aac -b:a 96k -movflags +faststart "${OUT%.mp4}_preview.mp4"
ffprobe -v error -show_entries format=duration,size -of default=nw=1 "$OUT"
