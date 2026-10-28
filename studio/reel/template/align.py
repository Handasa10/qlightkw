import numpy as np, wave, re, subprocess, sys
w = wave.open('vo48.wav'); sr = w.getframerate(); x = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(float) / 32768
out = subprocess.run(['ffmpeg','-i','vo.wav','-af','silencedetect=noise=-35dB:d=0.18','-f','null','-'],capture_output=True,text=True).stderr
st=[float(v) for v in re.findall(r'silence_start: ([\d.]+)',out)]; en=[float(v) for v in re.findall(r'silence_end: ([\d.]+)',out)]
dur=len(x)/sr
segs=[]; prev=0.0
for a,b in zip(st,en):
    if a-prev>0.05: segs.append((round(prev,2),round(a,2)))
    prev=b
if dur-prev>0.05: segs.append((round(prev,2),round(dur,2)))
hop=int(sr*.01); env=np.array([np.sqrt(np.mean(x[i:i+hop*2]**2)) for i in range(0,len(x)-hop*2,hop)]); env=np.convolve(env,np.hanning(7)/np.hanning(7).sum(),'same')
def peaks(a,b):
    e=env[int(a*100):int(b*100)]
    if len(e)<3: return 0
    thr=max(e.max()*.25,np.median(e)*.6); n=0; last=-10
    for i in range(1,len(e)-1):
        if e[i]>e[i-1] and e[i]>=e[i+1] and e[i]>thr and i-last>=9: n+=1; last=i
    return n
P=[peaks(a,b) for a,b in segs]
lines=[]  # the spoken lines of the script, without [tags]; run: python3 align.py <number of lines> x
def syl(s): return sum(max(1,round(len(re.sub('[اويى]','',w))*0.75)) for w in s.split())
def run(L):
    S=[syl(l) for l in L]; r=sum(P)/sum(S); N,M=len(segs),len(L)
    INF=1e18; D=[[INF]*(N+1) for _ in range(M+1)]; B=[[0]*(N+1) for _ in range(M+1)]; D[0][0]=0
    for i in range(1,M+1):
        for j in range(1,N+1):
            for k in range(i-1,j):
                if D[i-1][k]>=INF: continue
                p=sum(P[k:j]); e=S[i-1]*r; c=D[i-1][k]+(p-e)**2/max(e,1)
                if c<D[i][j]: D[i][j]=c; B[i][j]=k
    j=N; res=[]
    for i in range(M,0,-1): k=B[i][j]; res.append((i,k,j)); j=k
    return D[M][N], r, list(reversed(res)), S
print('segs',len(segs),'peaks',sum(P))
for n in (len(lines),):
    c,r,res,S=run(lines[:n]); print(f'--- {n} lines cost {c:.1f} rate {r:.2f}')
    if n==int(sys.argv[1]):
        for i,k,j in res: print(f'L{i}: segs {k+1}-{j} t={segs[k][0]:.2f}-{segs[j-1][1]:.2f} ' + ' | '.join(f'{segs[q][0]:.2f}' for q in range(k,j)) + f'  pk={sum(P[k:j])} exp={S[i-1]*r:.1f}')
if len(sys.argv)>2:
    for i,(a,b) in enumerate(segs): print(i+1,a,b,round(b-a,2),P[i])
