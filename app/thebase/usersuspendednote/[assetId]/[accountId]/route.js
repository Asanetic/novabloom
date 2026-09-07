// app/thebase/usersuspendednote/[assetId]/[accountId]/route.js
//
// Public "content unavailable" note — the counterpart to
// /paused/[assetId]/[accountId], but for the END CUSTOMER visiting a
// client's site, not the client/staff themselves. Client apps redirect
// their public-facing visitors here via the `usernoteurl` field returned
// by /api/novabloomv3/status (see BILLING_BASE_URL / buildUrls there).
//
// Deliberately a raw Route Handler instead of a page.jsx:
//   - page.jsx would render inside app/layout.js (dashboard chrome, fonts,
//     Asanetic/NovaBloom-branded CSS) and can't set a custom HTTP status.
//   - This has to be a fully standalone, brand-free document returned with
//     status 503 + Retry-After, which only a Route Handler can control.
//
// Content rules (do not change without re-reading the spec this was built
// against): no mention of billing/subscription/payment/overdue/expired/
// suspended, no Asanetic/NovaBloom naming, no links or buttons, and the
// exact same message for every asset/account — known, unknown, or
// malformed — so nothing here can be used to probe a client's billing
// state from the outside.

export const dynamic = 'force-dynamic';

const NOTE_HTML = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex, nofollow" />
<title>Content Unavailable</title>
<style>
  :root { color-scheme: light dark; }
  * { box-sizing: border-box; }
  html, body { height: 100%; margin: 0; }
  body {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 24px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    background: #f5f6f8;
    color: #1c1f24;
  }
  .note_card {
    max-width: 420px;
    width: 100%;
    text-align: center;
    padding: 40px 32px;
    border-radius: 16px;
    background: #fff;
    box-shadow: 0 12px 32px rgba(15, 18, 24, 0.08);
  }
  .note_icon {
    width: 52px;
    height: 52px;
    margin: 0 auto 20px;
    border-radius: 50%;
    background: #eef0f3;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .note_icon svg { width: 24px; height: 24px; }
  .note_headline {
    font-size: 19px;
    font-weight: 700;
    margin-bottom: 10px;
    letter-spacing: -0.2px;
  }
  .note_subtext {
    font-size: 14.5px;
    line-height: 1.6;
    color: #5a6069;
    margin: 0;
  }
  @media (prefers-color-scheme: dark) {
    body { background: #0f1216; color: #e7e9ec; }
    .note_card { background: #1a1d22; box-shadow: 0 12px 32px rgba(0,0,0,0.4); }
    .note_icon { background: #22262c; }
    .note_subtext { color: #9aa0a8; }
  }
</style>
</head>
<body>
  <div class="note_card">
    <div class="note_icon">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="9.25" stroke="currentColor" stroke-width="1.5" />
        <path d="M12 8v5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
        <circle cx="12" cy="16.2" r="0.9" fill="currentColor" />
      </svg>
    </div>
    <p class="note_headline">This page isn&rsquo;t available right now</p>
    <p class="note_subtext">We&rsquo;re working on it. Please check back again soon.</p>
  </div>
</body>
</html>
`;

function noteResponse() {
  return new Response(NOTE_HTML, {
    status: 503,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Retry-After': '3600',
      'X-Robots-Tag': 'noindex, nofollow',
      'Cache-Control': 'no-store'
    }
  });
}

export async function GET(_request, { params }) {
  // assetId/accountId only exist to match the URL shape client apps
  // redirect to — intentionally never read, validated, or reflected back.
  // Same note whether the pair is real, unknown, or malformed.
  await params;
  return noteResponse();
}

export async function HEAD(_request, { params }) {
  await params;
  return noteResponse();
}
