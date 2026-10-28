#!/usr/bin/env python3
"""Client for the content-studio Supabase function (the content queue the owner approves from Telegram).

Env: STUDIO_TOKEN (required), STUDIO_URL (default: the QUALITY LIGHT project's content-studio function)
  python3 studio/studio.py settings
  python3 studio/studio.py list [status ...]            e.g. list idea_approved revise
  python3 studio/studio.py topics                        everything ever proposed (avoid repeats)
  python3 studio/studio.py create items.json             JSON list of items (kind, topic, hook, angle, status, ...)
  python3 studio/studio.py update <id> patch.json|'{json}'
  python3 studio/studio.py upload <local file> <remote path>   prints the public URL
  python3 studio/studio.py notify "text"                 message to the owner on Telegram
  python3 studio/studio.py tts script.txt voice.txt [title]   Gemini voice-over (Achird), sent to the owner's bot to approve
  python3 studio/studio.py voice <id>                   status of a voice-over (ready / approved / failed) and its WAV URL
"""
import json, os, sys, urllib.request

URL = os.environ.get('STUDIO_URL', 'https://yubebbfsmlopmnluajgf.supabase.co/functions/v1/content-studio')
TOKEN = os.environ.get('STUDIO_TOKEN') or sys.exit('STUDIO_TOKEN is not set')


def api(body):
    req = urllib.request.Request(URL, data=json.dumps(body).encode(), headers={'Content-Type': 'application/json', 'x-studio-token': TOKEN})
    try:
        with urllib.request.urlopen(req, timeout=240) as r:
            return json.load(r)
    except urllib.error.HTTPError as e:
        sys.exit(f'HTTP {e.code}: {e.read().decode()[:500]}')


def load(arg):
    return json.load(open(arg, encoding='utf-8')) if os.path.exists(arg) else json.loads(arg)


def main():
    cmd, args = sys.argv[1], sys.argv[2:]
    if cmd == 'upload':
        local, remote = args
        r = api({'action': 'upload_url', 'path': remote})
        types = {'.mp4': 'video/mp4', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png'}
        data = open(local, 'rb').read()
        req = urllib.request.Request(r['signed_url'], data=data, method='PUT',
                                     headers={'Content-Type': types.get(os.path.splitext(local)[1].lower(), 'application/octet-stream'), 'x-upsert': 'true'})
        with urllib.request.urlopen(req, timeout=900) as res:
            res.read()
        print(r['public_url'])
        return
    body = {'settings': lambda: {'action': 'settings'},
            'list': lambda: {'action': 'list', **({'status': args} if args else {})},
            'topics': lambda: {'action': 'topics'},
            'create': lambda: {'action': 'create', 'items': load(args[0])},
            'update': lambda: {'action': 'update', 'id': args[0], 'patch': load(args[1])},
            'notify': lambda: {'action': 'notify', 'text': ' '.join(args)},
            'tts': lambda: {'action': 'tts', 'script': open(args[0], encoding='utf-8').read().strip(),
                            'voice_description': open(args[1], encoding='utf-8').read().strip(), 'title': args[2] if len(args) > 2 else None,
                            'voice': os.environ.get('GEMINI_TTS_VOICE', 'Achird')},
            'voice': lambda: {'action': 'voice', 'id': args[0]}}[cmd]()
    print(json.dumps(api(body), ensure_ascii=False, indent=1))


if __name__ == '__main__':
    main()
