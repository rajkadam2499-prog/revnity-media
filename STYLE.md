# Revnity LinkedIn Post Style Guide

## Image Style — MANDATORY for every post
Every LinkedIn post MUST include a 3D claymorphism / glassmorphism UI/UX image.

### Visual Rules
- **Format**: 2160×2700 PNG (1080×1350 at dpr 2)
- **3D style**: Clay materials (MeshPhysicalMaterial, roughness ~0.4-0.6, clearcoat, sheen) + glass elements (transmission, ior)
- **Each image must be UNIQUE** — different 3D objects, different composition, different concept every time
- **No repeated patterns** — don't reuse the same tiles/boxes/balls layout. Think: radar domes, seesaws, dominoes, funnels, levers, telescopes, dashboards, compasses, gauges, puzzles, bridges, etc.
- **Theme**: Alternate dark and light backgrounds across posts
- **Dark bg**: radial-gradient from #11505a → #08303a → #041820
- **Light bg**: radial-gradient from #ffffff → #e3f8ef → #edf0fc
- **Brand colors**: #1fa597 (teal), #2fc97c (green), #8cc63f (lime), #12b06a (deep green)
- **Accent**: gradient bar below logo (90deg, teal → green → lime)
- **Glass cards**: backdrop-filter blur, semi-transparent, rounded corners 20-26px
- **Gradient text** (.grad): linear-gradient teal → green → lime, background-clip text

### Layout Structure (top to bottom)
1. **Logo** (top-left, 100px height) — must be clearly visible
2. **Accent bar** (6px, below logo)
3. **Headline** (bold, 68px, max 3 lines)
4. **3D scene** (canvas, centered, ~500px tall)
5. **Glass info cards** (supporting content, stats, comparisons)
6. **CTA or framework bar** (if applicable)
7. **Footer**: revnitymarketing.com (bottom-right)

### Rendering
- Use hero.js (THREE.js toolkit with clay/glass helpers)
- Use ui.css (glass cards, gradients, typography)
- Render with shot.py: `python3 -I shot.py ROOT PAGE OUTPUT`
- Three.js via importmap from local node_modules

## Text Style

### Post Format (Problem → Solution → Perspective)
- **Opening**: Strong hook, no jargon. State the problem.
- **Middle**: The shift / insight / how it works.
- **Close**: Perspective shift or call to think differently.
- End with 3-5 relevant hashtags.

### Content Rules — NEVER VIOLATE
- **NEVER** name clients or deals (no Badger Maps, Pelion IoT, Navan, etc.)
- **NEVER** name competitor data providers
- **NEVER** reveal data sources or detection methodology
- **NEVER** describe Revnity as scraping or web crawling — it's intelligence, not scraping
- **NEVER** invent stats or outcomes
- **NEVER** write "5,000+" — the correct number is **45K+**

### Correct Facts (use these exactly)
- 45K+ software products & technologies mapped
- 25M+ companies worldwide
- 2K+ IT companies served
- 30–45 day data refresh cycle
- 100% tech usage guarantee
- 98% email deliverability
- BDE team covering NA / EMEA / APAC / LATAM

## Posting Schedule
- Company page only (linkedin-107044811)
- Free plan: 15 posts/month, 4/week Mon–Thu at 6 PM IST (12:30 UTC)
- 3 posts in the last full week of the month
- In months with 5 full weeks: 3/week on Tue/Wed/Thu
