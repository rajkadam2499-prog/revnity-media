import sys,subprocess,time,os
from playwright.sync_api import sync_playwright
root,page,out=sys.argv[1],sys.argv[2],sys.argv[3]
srv=subprocess.Popen([sys.executable,'-m','http.server','8765','--bind','127.0.0.1'],cwd=root,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
time.sleep(1)
try:
  with sync_playwright() as p:
    b=p.chromium.launch(args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist'])
    pg=b.new_page(viewport={'width':1080,'height':1350},device_scale_factor=2)
    pg.on('console',lambda m:print('console:',m.text))
    pg.on('pageerror',lambda e:print('err:',e))
    pg.goto('http://127.0.0.1:8765/'+page);pg.wait_for_function('window.__done===true',timeout=120000);pg.wait_for_timeout(1500)
    pg.screenshot(path=out);b.close()
finally: srv.terminate()
