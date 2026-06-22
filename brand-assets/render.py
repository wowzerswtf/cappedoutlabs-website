import pathlib
from playwright.sync_api import sync_playwright

HERE = pathlib.Path(__file__).parent
OUT = HERE.parent / "public" / "brand"
OUT.mkdir(parents=True, exist_ok=True)

# (html, width, height, output, transparent)
ASSETS = [
    ("avatar.html", 512, 512, "avatar@2x.png", False),
    ("linkedin-banner.html", 1128, 191, "linkedin-banner@2x.png", False),
    ("x-header.html", 1500, 500, "x-header@2x.png", False),
    ("logo-horizontal-dark.html", 1200, 360, "logo-horizontal-dark@2x.png", True),
    ("logo-horizontal-light.html", 1200, 360, "logo-horizontal-light@2x.png", True),
]

with sync_playwright() as p:
    browser = p.chromium.launch()
    for html, w, h, out, transparent in ASSETS:
        ctx = browser.new_context(
            viewport={"width": w, "height": h},
            device_scale_factor=2,
        )
        page = ctx.new_page()
        page.goto((HERE / html).as_uri())
        page.wait_for_load_state("networkidle")
        page.evaluate("document.fonts.ready")
        page.wait_for_timeout(400)
        page.screenshot(path=str(OUT / out), omit_background=transparent)
        ctx.close()
        print("rendered", out, f"{w*2}x{h*2}")
    browser.close()
print("done")
