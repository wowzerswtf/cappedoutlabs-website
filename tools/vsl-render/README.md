# VSL renderer

Builds the Labs-style VSL: white sentences on a black 1920x1080 frame, one
card per spoken chunk, a voiceover under it, "CAPPED OUT LABS" letterspaced at
the foot. Same look as the live video on `/f/vsl` (Vimeo 1180565378).

It is its own package so the Next.js build never installs ffmpeg.

```bash
cd tools/vsl-render
npm install                 # ffmpeg-static + ffprobe-static, nothing else
npm run cards               # script -> out/own/cards.json (18 paragraphs, 53 cards for /f/own)
# generate one voice take per paragraph (see "Voice" below) and list the
# URLs in out/own/paragraph-audio.json as { "<paragraph index>": "<url>" }
npm run fetch:paragraphs    # downloads them to out/own/para/NN.mp3
npm run split               # cuts the takes into out/own/audio/NN.mp3, one per card
GAP_SECONDS=0.3 npm run render   # out/own/vsl.mp4 + timeline.json
```

Rendering 53 cards takes about four minutes on a laptop. The installed Chrome
screenshots each card from an HTML template (Inter from Google Fonts, so the
machine needs network for the first run), ffprobe measures each clip, ffmpeg
builds one segment per card (fade in, loudness-normalised voice, a short gap
of silence) and concatenates them with a 4s silent end card.

The voice is generated one paragraph per take, not one clip per card. A
per-card clip restarts cold on every sentence and sounds like a robot reading a
list; a paragraph take carries the delivery through. `split-paragraphs.mjs`
cuts each take back into its cards: card boundaries are sentence ends, the
voice pauses about 0.6s there (0.3s at a comma), so for every boundary it takes
the pause nearest to where the boundary falls by character count, with longer
pauses preferred, and cuts in the middle of it. It writes `split.json` with
every cut and exits 2 if a boundary had no pause to use or landed more than
1.5s from where it was expected. The per-card path still works: list clip URLs
in `audio.json`, `npm run fetch`, skip the split.

## Where the words come from

`src/lib/vsl-cards.ts` turns `OWN_VSL_SCRIPT` into cards: split paragraphs
into sentences, split anything over 185 characters at the clause break nearest
its middle, merge short neighbours up to 115 characters so the voice never
stops on a three-word card. `tests/vsl-cards.test.mts` proves the cards fit the
frame, drop nothing and keep every spoken number on one card. Each card
carries the 1-based paragraph it came from, which is how the split step joins
takes to cards. Edit the script in `src/lib/funnels/own.ts`, run `npm test` at
the repo root, then regenerate the takes for the paragraphs that changed
(compare the old and new `cards.json`) and re-run the split.

## Voice

The 2026-10-21 render is a voice clone. Every ElevenLabs, MiniMax and Seed
preset we tried (Brooks, Jake, Benji, Leo, Dylan, Evan, Miles, Callan, Cody)
was rejected as sounding fake, so the reference is the real narrator of the
2023 talking-head VSL `VSL 7 Young.mp4` (Waynard's Downloads; 2:56, clean
track, no music bed). A 28s cut of it is uploaded to Higgsfield as audio media
`7ca76bc1-eea6-4be1-a7a6-3f2e1cee2db8`; each paragraph is one `seed_audio`
job with that id as `audio_references` (`format: mp3`, `sample_rate: 44100`),
about 1 credit per take, 18 takes. The reference cut is not in git: recut it
with ffmpeg from the source file (first 28s, mono 44.1k) and upload it again
if the media id expires. Seed Audio rate-limits at about twelve concurrent
jobs; submit the rest once the first batch finishes.

Any engine that returns one take per paragraph works. To use Waynard's own
voice instead, record the first two paragraphs on a phone, upload that as the
audio reference and regenerate the 18 takes; nothing else changes. Note the
script says "I'm Waynard with Capped Out Labs" in paragraph 3: with a cloned
third-party voice that line should be changed or recorded by Waynard.

Pacing check: the render prints each clip's length. `timeline.json` carries
start, voice and hold time per card, `split.json` the cut points; a clip far
from 2.5 words per second is worth listening to before shipping.

## Knobs

Environment variables on `render.mjs`: `GAP_SECONDS` (0.45; use 0.3 with
split takes, which already carry half a pause at each end), `END_SECONDS`
(4), `FADE_SECONDS` (0.18), `CHROME_PATH`. On `split-paragraphs.mjs`:
`SILENCE_DB` (-32), `MIN_PAUSE` (0.18), `LEAD_KEEP` (0.08), `TAIL_KEEP`
(0.15). Typography lives in `cardHtml()` in `render.mjs`; font size steps down
for longer cards so three lines always fit.

## Shipping

Upload `out/own/vsl.mp4` to Vimeo (view: anybody, embed: public, like
1180565378), paste the numeric id into `OWN_VSL_VIMEO_ID` in
`src/lib/funnels/own.ts`, redeploy. The written letter on `/f/own` disappears
and the player takes its place. Check it in a headed browser; headless Chrome
gets a Cloudflare 401 from Vimeo that looks like a broken embed
(`tasks/lessons.md`).
