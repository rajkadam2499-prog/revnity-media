# revnity-media

Images for the Revnity Marketing LinkedIn company page. Publora fetches each post's image from
`https://raw.githubusercontent.com/rajkadam2499-prog/revnity-media/main/posts/<file>.png`.

- `posts/` — one image per post, named `YYYY-MM-DD-<day>.png` (2160×2700, 4:5).
- `kit/` — the 3D image toolkit (three.js scenes rendered in headless Chromium).

## Making a new image
1. `cd kit && npm install` (installs three@0.169.0).
2. Copy one of the `ex-*.html` scenes to a new file and change the concept, title, labels and callout.
3. `python3 -I shot.py "$PWD" my-scene.html "$PWD/out.png"` renders at 2160×2700.
4. Use `fit(scene, cam, W, H, {top, bottom, left, right})` to frame the 3D content inside a pixel region.

## Brand rules
- Logo: `kit/logo-transparent.png` at the top of every image.
- Colours: teal #2bb5a8 → green #3fd98a → lime #a8d84a, accent yellow #e8d867.
  Light theme (mint-white) and dark theme (deep teal-navy); alternate across the week.
- Signature object: the 3D Revnity map pin (`pin()` in `common.js`).
- Every post gets a different 3D concept (pins, layered stack, funnel, podiums, bridge, magnet,
  radar, target, magnifying glass, puzzle, compass, shield, ladder, key/lock...). Don't repeat a
  concept within 2 weeks.
- Facts only: 45K+ software products & technologies, 25M+ companies, 2K+ IT companies served,
  30-45 day refresh cycle, 98% email deliverability, 100% tech usage guarantee,
  NA/EMEA/APAC/LATAM. Never name clients or competitor data providers, never mention
  scraping/crawling or data-detection methods.
