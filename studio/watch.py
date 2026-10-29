#!/usr/bin/env python3
"""Wait for the owner's next move in the QL Studio bot and print it (exit 0), so the Claude session wakes up and continues.

Usage: python3 studio/watch.py [state_file]   (default /tmp/ql_watch_since)
Polls the content-events function every 20 s; remembers the last seen time in the state file. Gives up after
~110 minutes with exit code 3 (just start it again). Env: STUDIO_TOKEN.
"""
import json, os, sys, time, urllib.request
from datetime import datetime, timezone

URL = os.environ.get('STUDIO_EVENTS_URL', 'https://yubebbfsmlopmnluajgf.supabase.co/functions/v1/content-events')
state = sys.argv[1] if len(sys.argv) > 1 else '/tmp/ql_watch_since'
since = open(state).read().strip() if os.path.exists(state) else datetime.now(timezone.utc).isoformat()
deadline = time.time() + 110 * 60
while time.time() < deadline:
    try:
        req = urllib.request.Request(URL, data=json.dumps({'since': since}).encode(),
                                     headers={'Content-Type': 'application/json', 'x-studio-token': os.environ['STUDIO_TOKEN']})
        with urllib.request.urlopen(req, timeout=60) as r:
            ev = json.load(r)
        if ev['questions'] or ev['voices'] or ev['items']:
            open(state, 'w').write(ev['now'])
            print(json.dumps(ev, ensure_ascii=False, indent=1))
            sys.exit(0)
    except Exception as e:  # network hiccup: keep watching
        print('watch: retry after error:', e, file=sys.stderr)
    time.sleep(20)
sys.exit(3)
