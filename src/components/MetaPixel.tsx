"use client";

// Meta Pixel loader + SPA route tracking.
//
// Rendered once from the root layout. No-ops entirely (renders nothing)
// unless NEXT_PUBLIC_META_PIXEL_ID is set, so the site can deploy before
// the Labs pixel exists.
//
// The inline snippet handles the landing URL's PageView (and ViewContent on
// funnel landers) so nothing depends on script-vs-hydration ordering. The
// effect only covers App Router navigations after the first render, when
// the fbq queue stub is guaranteed to exist.

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

function track(...args: unknown[]) {
  if (typeof window.fbq === "function") window.fbq(...args);
}

export default function MetaPixel() {
  const pathname = usePathname();
  const initialLoad = useRef(true);

  useEffect(() => {
    if (!PIXEL_ID) return;
    if (initialLoad.current) {
      // The inline snippet already tracked the landing URL.
      initialLoad.current = false;
      return;
    }
    track("track", "PageView");
    if (pathname.startsWith("/f/") || pathname === "/apply-now") {
      track("track", "ViewContent", { content_name: pathname });
    }
  }, [pathname]);

  if (!PIXEL_ID) return null;

  return (
    <Script id="meta-pixel" strategy="afterInteractive">
      {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${PIXEL_ID}');
fbq('track', 'PageView');
if (window.location.pathname.indexOf('/f/') === 0 || window.location.pathname === '/apply-now') { fbq('track', 'ViewContent', { content_name: window.location.pathname }); }`}
    </Script>
  );
}
