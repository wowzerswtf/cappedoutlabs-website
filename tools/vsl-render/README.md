# VSL renderer

Builds the Labs-style VSL: white sentences on a black 1920x1080 frame, one
card per spoken chunk, a voiceover under it, "CAPPED OUT LABS" letterspaced at
the foot. Same look as the live video on `/f/vsl` (Vimeo 1180565378).

It is its own package so the Next.js build never installs ffmpeg.

```bash
cd tools/vsl-render
npm install                 # ffmpeg-static + ffprobe-static, nothing else
npm run cards               # script -> out/own/cards.json (53 cards for /f/own)
# generate one voice clip per card (see "Voice" below) and list the clip
# URLs in out/own/audio.json as { "<card index>": "<url>" }
npm run fetch               # downloads them to out/own/audio/NN.mp3
npm run render              # out/own/vsl.mp4 + timeline.json
```

Rendering 53 cards takes about four minutes on a laptop. The installed Chrome
screenshots each card from an HTML template (Inter from Google Fonts, so the
machine needs network for the first run), ffprobe measures each clip, ffmpeg
builds one segment per card (fade in, loudness-normalised voice, a 0.45s gap
of silence) and concatenates them with a 4s silent end card.

## Where the words come from

`src/lib/vsl-cards.ts` turns `OWN_VSL_SCRIPT` into cards: split paragraphs
into sentences, split anything over 185 characters at the clause break nearest
its middle, merge short neighbours up to 115 characters so the voice never
stops on a three-word card. `tests/vsl-cards.test.mts` proves the cards fit the
frame, drop nothing and keep every spoken number on one card. Edit the script
in `src/lib/funnels/own.ts`, run `npm test` at the repo root, then regenerate
the clips for the cards that changed (compare the old and new `cards.json`).

## Voice

The 2026-10-20 render used Higgsfield's Text to Speech V2 with the ElevenLabs
engine and the preset voice "Brooks" (`c2acff45-84b2-4974-892d-89fa2d4e5598`),
one job per card, about 0.9 credits each (53 cards, about 48 credits). Any
engine that returns one clip per card works; the renderer only needs mp3 files
named `01.mp3` to `53.mp3`. To use Waynard's own voice, clone it from a short
recording (seed_audio accepts an audio reference) and regenerate all cards;
nothing else changes.

Pacing check: the render prints each clip's length. `timeline.json` carries
start, voice and hold time per card; a clip far from 2.5 words per second is
worth listening to before shipping.

## Knobs

Environment variables on `render.mjs`: `GAP_SECONDS` (0.45), `END_SECONDS`
(4), `FADE_SECONDS` (0.18), `CHROME_PATH`. Typography lives in `cardHtml()`
in `render.mjs`; font size steps down for longer cards so three lines always
fit.

## Shipping

Upload `out/own/vsl.mp4` to Vimeo (view: anybody, embed: public, like
1180565378), paste the numeric id into `OWN_VSL_VIMEO_ID` in
`src/lib/funnels/own.ts`, redeploy. The written letter on `/f/own` disappears
and the player takes its place. Check it in a headed browser; headless Chrome
gets a Cloudflare 401 from Vimeo that looks like a broken embed
(`tasks/lessons.md`).
