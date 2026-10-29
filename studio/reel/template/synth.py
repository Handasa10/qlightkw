import numpy as np, wave, math, json

# music.json: {"dur": total seconds, "drop": beat starts, "hats": hats+arp start, "lift": louder pads+claps, "end": final chord, "transitions": [...], "events": [...]}
CFG = json.load(open("music.json"))

SR = 48000
DUR = CFG["dur"]
N = int(DUR * SR)
rng = np.random.default_rng(7)
mus = np.zeros((2, N))
sfx = np.zeros((2, N))


def add(buf, sig, t0, gain=1.0, pan=0.0):
    i = int(t0 * SR)
    if i >= N: return
    sig = sig[: N - i]
    l, r = math.cos((pan + 1) * math.pi / 4), math.sin((pan + 1) * math.pi / 4)
    buf[0, i:i + len(sig)] += sig * gain * l * 1.414
    buf[1, i:i + len(sig)] += sig * gain * r * 1.414


def tt(d): return np.arange(int(d * SR)) / SR


def band(x, lo, hi):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR)
    m = ((f >= lo) & (f <= hi)).astype(float)
    return np.fft.irfft(X * m, len(x))


def noise(d): return rng.standard_normal(int(d * SR))


def mtof(m): return 440 * 2 ** ((m - 69) / 12)


def adsr(n, a, r):
    e = np.ones(n); na, nr = int(a * SR), int(r * SR)
    if na: e[:na] = np.linspace(0, 1, na)
    if nr: e[-nr:] *= np.linspace(1, 0, nr)
    return e

# ---------- SFX ----------
def whoosh(d=.7, lo=250, hi=4000):
    t = tt(d); x = band(noise(d), lo, hi)
    e = np.sin(np.pi * np.clip(t / d, 0, 1)) ** 2
    return x * e / (np.abs(x).max() + 1e-9)

def pop(f=900):
    t = tt(.12); return np.sin(2 * np.pi * f * t * (1 + 1.5 * np.exp(-t * 40))) * np.exp(-t * 35)

def click():
    t = tt(.05); x = band(noise(.05), 2000, 9000) * np.exp(-t * 200)
    return x / np.abs(x).max() + .5 * np.sin(2 * np.pi * 1800 * t) * np.exp(-t * 120)

def bell(f, d=1.6):
    t = tt(d); s = sum(a * np.sin(2 * np.pi * f * k * t) * np.exp(-t * (2 + k)) for k, a in [(1, 1), (2.76, .4), (5.4, .2), (8.9, .1)])
    return s * (1 - np.exp(-t * 400))

def chime(base=72, n=4, gap=.07):
    out = np.zeros(int((n * gap + 1.2) * SR))
    for k in range(n):
        b = bell(mtof(base + [0, 4, 7, 12, 16][k % 5]), 1.0); i = int(k * gap * SR)
        out[i:i + len(b)] += b * .6
    return out

def impact(d=2.0):
    t = tt(d)
    sub = np.sin(2 * np.pi * (40 + 80 * np.exp(-t * 10)) * t) * np.exp(-t * 2.5)
    n = band(noise(d), 60, 6000) * np.exp(-t * 6); n /= np.abs(n).max()
    return sub + .5 * n

def riser(d=1.2):
    t = tt(d); x = band(noise(d), 800, 9000); x /= np.abs(x).max()
    tone = np.sin(2 * np.pi * (200 * t + 600 * t * t / d))
    return (x * .7 + tone * .3) * (t / d) ** 2

def thud():
    t = tt(.4); return np.sin(2 * np.pi * (55 + 120 * np.exp(-t * 30)) * t) * np.exp(-t * 12)

def coin():
    t = tt(.5); return sum(np.sin(2 * np.pi * f * t) * np.exp(-t * dcy) for f, dcy in [(2200, 9), (3350, 12), (5100, 16)]) / 3

def crack():
    t = tt(.6); x = band(noise(.6), 150, 7000) * np.exp(-t * 9); x /= np.abs(x).max()
    th = thud(); x[:len(th)] += th
    return x

def buzz(d):
    t = tt(d); s = sum(np.sin(2 * np.pi * 100 * k * t) / k for k in range(1, 12))
    return s / 3

def rand(i):
    x = math.sin(i * 127.1 + 311.7) * 43758.5453; return x - math.floor(x)

def flick(t):
    k = math.floor(t * 14); r = rand(k * 3.1)
    return .12 if r < .22 else .55 + .45 * rand(k * 7.7)


def rand_j(i): return ((i*7919)%13)/100
# ---- SFX from music.json: events are [name, time, gain, *args] ----
FX = {'whoosh': whoosh, 'pop': pop, 'click': click, 'chime': chime, 'impact': impact, 'riser': riser, 'thud': thud, 'coin': coin, 'crack': crack, 'buzz': lambda d=.3: buzz(d) * .3}
for tb in CFG.get('transitions', []): add(sfx, whoosh(.65), tb - .32, .22)
for ev in CFG.get('events', []):
    name, t0, gain, *args = ev
    add(sfx, FX[name](*args), t0, gain)

# ---------- MUSIC ----------
BEAT = .6
T0 = CFG["drop"]  # music drop
prog_ch = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]]  # Am F C G
def chord_at(tm):
    k = int(math.floor((tm - T0) / (BEAT * 8))) % 4
    return prog_ch[k]

# Intro drone + clock ticks (tension)
t = tt(CFG["drop"]); drone = (np.sin(2 * np.pi * mtof(33) * t) + .5 * np.sin(2 * np.pi * mtof(40) * t)) * (.6 + .4 * np.sin(2 * np.pi * .5 * t))
add(mus, drone * adsr(len(t), 1.0, 1.0), 0, .10)

# Pads
start = T0
while start < CFG["end"]:
    notes = chord_at(start + .01); d = BEAT * 8
    tl = tt(d + .8); seg = np.zeros(len(tl))
    for m in notes + [notes[0] + 12]:
        for det in (-.003, .003):
            f = mtof(m) * (1 + det)
            seg += np.sin(2 * np.pi * f * tl) + .25 * np.sin(4 * np.pi * f * tl) + .1 * np.sin(6 * np.pi * f * tl)
    seg *= adsr(len(tl), .5, .9) / 10
    add(mus, seg, start, .16 if start < CFG["lift"] else .2, pan=0)
    start += d
# Bass, kick, hats, arp, claps
bt = T0
k = 0
while bt < CFG["end"]:
    notes = chord_at(bt + .01)
    t = tt(.5)
    add(mus, np.sin(2 * np.pi * mtof(notes[0] - 24) * t) * np.exp(-t * 4) * (1 - np.exp(-t * 300)), bt, .32)
    kt = tt(.35); kick = np.sin(2 * np.pi * (45 * kt + 105 * (1 - np.exp(-kt * 25)) / 25)) * np.exp(-kt * 9)
    add(mus, kick, bt, .45)
    if bt >= CFG["hats"]:
        h = band(noise(.06), 7000, 16000) * np.exp(-tt(.06) * 70)
        add(mus, h / (np.abs(h).max() + 1e-9), bt + BEAT / 2, .06, pan=.25)
        arp = [notes[0] + 12, notes[1] + 12, notes[2] + 12, notes[1] + 24]
        for j in range(2):
            m = arp[(k * 2 + j) % 4]; at = tt(.35)
            add(mus, (np.sin(2 * np.pi * mtof(m) * at) + .3 * np.sin(4 * np.pi * mtof(m) * at)) * np.exp(-at * 9), bt + j * BEAT / 2, .07, pan=(-.4 if j else .4))
    if bt >= CFG["lift"] and k % 2 == 1:
        cl = band(noise(.18), 900, 4000) * np.exp(-tt(.18) * 22)
        add(mus, cl / np.abs(cl).max(), bt, .12)
    bt += BEAT; k += 1
# final ring-out chord
t = tt(3.0); fin = sum(np.sin(2 * np.pi * mtof(m) * t) for m in [45, 57, 60, 64, 69]) * np.exp(-t * 1.2) / 5
add(mus, fin, CFG["end"], .35)

# ---------- VO + ducking ----------
w = wave.open('vo48.wav'); vo = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(float) / 32768
vo = vo / max(np.abs(vo).max(), 1e-9) * .89  # a silent track (no-voice reels) stays silent
v = np.zeros(N); v[:len(vo)] = vo[:N]
fr = 480; rms = np.sqrt(np.convolve(v ** 2, np.ones(fr) / fr, 'same'))
act = np.clip(rms / .04, 0, 1)
# attack fast / release slow
g = np.zeros(N); cur = 0.0
step = 240
for i in range(0, N, step):
    tgt = act[i]
    cur = cur + (tgt - cur) * (.5 if tgt > cur else .02)
    g[i:i + step] = cur
duck = (1 - .6 * g) * .42
mix = np.zeros((2, N))
mix += mus * duck
mix += sfx * (1 - .3 * g) * .8
mix += v[None, :]
mix *= .8
peak = np.abs(mix).max(); mix /= max(1, peak / .98)
out = (np.clip(mix.T, -1, 1) * 32767).astype(np.int16)
wo = wave.open('mix.wav', 'wb'); wo.setnchannels(2); wo.setsampwidth(2); wo.setframerate(SR); wo.writeframes(out.tobytes()); wo.close()
print('peak', peak)
def db(x): return 20*np.log10(np.sqrt(np.mean(x**2))+1e-9)
for a,b in [(0,5),(6,DUR-6),(DUR-6,DUR)]:
    s,e=int(a*SR),int(b*SR); sp=act[s:e]>.5
    print(a,b,'vo',round(db(v[s:e][sp]),1),'music(ducked, during speech)',round(db((mus[0]*duck)[s:e][sp]),1),'music gaps',round(db((mus[0]*duck)[s:e][~sp]),1),'sfx',round(db(sfx[0][s:e]),1))
