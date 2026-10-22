import sys,subprocess,time,os,shutil
from playwright.sync_api import sync_playwright
import imageio_ffmpeg
root,page,out=sys.argv[1],sys.argv[2],sys.argv[3]
dur=float(sys.argv[4]) if len(sys.argv)>4 else 6.0;fps=int(sys.argv[5]) if len(sys.argv)>5 else 30
fr=os.path.join(root,'frames_'+os.path.splitext(page)[0]);os.makedirs(fr,exist_ok=True)
srv=subprocess.Popen([sys.executable,'-m','http.server','8766','--bind','127.0.0.1'],cwd=root,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
try:
  with sync_playwright() as p:
    b=p.chromium.launch(args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist'])
    pg=b.new_page(viewport={'width':1080,'height':1350},device_scale_factor=1)
    pg.on('pageerror',lambda e:print('err:',e))
    pg.goto('http://127.0.0.1:8766/'+page);pg.wait_for_function('window.__done===true',timeout=180000);pg.wait_for_timeout(800)
    n=int(dur*fps);t0=time.time()
    for i in range(n):
      if os.environ.get('RESUME') and os.path.exists(f'{fr}/f{i:04d}.png'): continue
      pg.evaluate(f'window.renderAt({i/fps})');pg.screenshot(path=f'{fr}/f{i:04d}.png')
    print('frames',n,'in',round(time.time()-t0),'s');b.close()
finally: srv.terminate()
ff=imageio_ffmpeg.get_ffmpeg_exe()
subprocess.run([ff,'-y','-loglevel','error','-framerate',str(fps),'-i',f'{fr}/f%04d.png','-c:v','libx264','-pix_fmt','yuv420p','-crf','18','-preset','slow','-movflags','+faststart',out],check=True)
print('ok',out,os.path.getsize(out))
