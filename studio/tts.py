#!/usr/bin/env python3
"""Voice-over with Gemini TTS (the same voices as Google AI Studio).

Usage: python3 studio/tts.py <script.txt> <voice_description.txt> <out.wav>
Env:   GOOGLE_AI_API_KEY (required), GEMINI_TTS_VOICE (default Charon), GEMINI_TTS_MODEL (default: newest *tts* model the key can use)
Writes a 48 kHz mono 16-bit WAV ready for align.py / synth.py (vo48.wav) plus the raw 24 kHz file next to it.
"""
import base64, json, os, subprocess, sys, urllib.request

API = 'https://generativelanguage.googleapis.com/v1beta'
KEY = os.environ.get('GOOGLE_AI_API_KEY') or sys.exit('GOOGLE_AI_API_KEY is not set')


def call(path, body=None):
    req = urllib.request.Request(f'{API}/{path}', data=json.dumps(body).encode() if body else None,
                                 headers={'Content-Type': 'application/json', 'x-goog-api-key': KEY})
    with urllib.request.urlopen(req, timeout=600) as r:
        return json.load(r)


def pick_model():
    if os.environ.get('GEMINI_TTS_MODEL'):
        return os.environ['GEMINI_TTS_MODEL']
    names = [m['name'].split('/')[-1] for m in call('models?pageSize=1000').get('models', []) if 'tts' in m['name']]
    if not names:
        sys.exit('no TTS model available for this key')
    # prefer pro over flash, newest version first
    names.sort(key=lambda n: ('pro' in n, n), reverse=True)
    return names[0]


def main():
    script, voice, out = sys.argv[1:4]
    text = open(script, encoding='utf-8').read().strip()
    style = open(voice, encoding='utf-8').read().strip()
    model = pick_model()
    body = {
        'contents': [{'parts': [{'text': f'{style}\n\n{text}'}]}],
        'generationConfig': {
            'responseModalities': ['AUDIO'],
            'speechConfig': {'voiceConfig': {'prebuiltVoiceConfig': {'voiceName': os.environ.get('GEMINI_TTS_VOICE', 'Charon')}}},
        },
    }
    res = call(f'models/{model}:generateContent', body)
    part = res['candidates'][0]['content']['parts'][0]['inlineData']
    raw = out.replace('.wav', '_24k.pcm')
    open(raw, 'wb').write(base64.b64decode(part['data']))
    rate = 24000
    if 'rate=' in part.get('mimeType', ''):
        rate = int(part['mimeType'].split('rate=')[1].split(';')[0])
    subprocess.run(['ffmpeg', '-nostdin', '-y', '-loglevel', 'error', '-f', 's16le', '-ar', str(rate), '-ac', '1', '-i', raw,
                    '-ar', '48000', '-ac', '1', '-c:a', 'pcm_s16le', out], check=True)
    print(f'{model} -> {out}')


if __name__ == '__main__':
    main()
