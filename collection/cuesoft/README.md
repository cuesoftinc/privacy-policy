# cuesoft.io: the Corporate Site

- **No forms.** Apart from the opt-in tags described below, the site
  collects nothing you don’t type into [Ace](../all-sites/). If you have
  opted in, the advertising platforms are told that you used Ace, though
  never what you said: see below.
- **Click-to-load media.** The media section offers a Spotify player for
  The CueShow™ that loads **only if you click it**; once loaded, Spotify
  may set its own cookies under
  [Spotify’s privacy policy](https://www.spotify.com/legal/privacy-policy/).
  Until you click, nothing from Spotify runs on the page.
- **Blog posts** are fetched from Medium by our servers at build time:
  your browser never talks to Medium on our site.
- Everything on [what every site collects](../all-sites/) applies.

## Analytics and advertising tags: opt-in only

This site uses analytics and advertising tags, gated behind a consent
banner. None of them loads, and none of their cookies is set, until you press
**Accept** (the cookieless Cloudflare measurement described in
[what every site collects](../all-sites/) and the
[performance and error monitoring](#performance-and-error-monitoring) below are
separate and run either way):

| Provider | Purpose | Their policy |
| --- | --- | --- |
| Google Analytics | Traffic and journey measurement; building remarketing audiences that are shared with our Google Ads account; and, where you are signed in to Google, age, gender and interest reporting plus cross-device advertising audiences for Google Ads (**Google signals**) | [policies.google.com/privacy](https://policies.google.com/privacy) |
| Google Ads | Ad measurement and remarketing | [policies.google.com/privacy](https://policies.google.com/privacy) |
| Meta | Ad measurement and remarketing | [facebook.com/privacy/policy](https://www.facebook.com/privacy/policy/) |
| LinkedIn | Ad measurement | [linkedin.com/legal/privacy-policy](https://www.linkedin.com/legal/privacy-policy) |
| X (Twitter) | Ad measurement | [x.com/en/privacy](https://x.com/en/privacy) |

- **What they receive:** a cookie or device identifier, your IP address,
  the page URLs you visit on this site and the referring URL, plus basic
  device and browser metadata and the page-view events themselves. Google
  Analytics uses the IP address in passing to derive an approximate
  location and then discards it: the address itself is not stored, and the
  location is what is kept. Google Analytics keeps
  this for **14 months**: see [retention](../../handling/retention/). We
  do not send your form contents to any of them.
- **One event beyond page views:**
  when Ace answers a question you asked it,
  **Google Ads, Meta, LinkedIn and X** are told that it happened, so
  they can credit the ad you arrived from. Google Analytics is not: it
  receives the page views described above and nothing more. The event
  records the fact of the conversation and nothing else: not your name, not
  your email, not your phone number, and not what you wrote.
- **If you are signed in to Google:** we have Google signals switched on,
  so where you are signed in to a Google account that has Ads
  Personalisation enabled, Google may connect this visit to that account
  and combine it with what Google already holds there: location, search
  history, YouTube history and activity on sites that partner with Google.
  What that does, precisely: it lets us see age, gender and interest
  summaries, and it lets Google build advertising audiences that can reach
  you across your devices. It does **not** merge your devices together in
  our own reports (since February 2024 Google signals is not part of how
  Analytics counts users), so we do not see your phone and your laptop as
  one person. And Google uses the visit for its own ads personalisation as
  well as for our measurement. You control it on Google’s side,
  independently of us, at
  [myadcenter.google.com](https://myadcenter.google.com) and
  [Google’s activity controls](https://myaccount.google.com/activitycontrols):
  switching Ads Personalisation off there stops it for every site, not
  just ours. Declining our banner prevents it entirely.
- **Decline and none of them load.** The site works identically either
  way.
- **Withdraw any time** via the site’s **Cookie preferences** link.
  Withdrawal stops the tags loading from that point on; it does not delete
  cookies already set (you can clear those in your browser). What happens
  to data already collected differs by provider: Google Analytics holds it
  as our **processor**, on our instructions, so the
  [rights page](../../rights/your-rights/) reaches it. The exception is what
  Google signals feeds into Google’s own ads personalisation, which Google
  controls rather than us: manage that in your
  [Google account](https://myadcenter.google.com). The four advertising
  platforms hold what they collected as **independent businesses** under
  their own policies: see
  [processors and platforms](../../handling/processors/).
- An opt-out preference signal (**Global Privacy Control**) overrides a
  stored opt-in for as long as your browser sends it.
- **Legal basis:** consent (GDPR Art. 6(1)(a)); California treatment is on
  the [United States page](../../jurisdictions/united-states/).
- The Spotify player above is separate: it loads only on click and is not
  covered by this banner.

## Performance and error monitoring

This site loads **Datadog**’s browser monitoring. It is operational
telemetry, so it does not wait for the consent banner, and declining the
banner does not stop it: it measures how quickly a page loads and records
the errors it hits, so that we can keep the pages working.

- **What Datadog receives:** the page addresses you visit and the page
  that referred you, load and resource timings, your clicks (which
  element, never anything you type), script errors and failed requests,
  your browser, device and operating system, and your IP address, from
  which it derives an approximate location. Nothing links a session to
  your name or email. No session is recorded as a replay, with one
  exception: if a page fails to render correctly, Datadog records that
  session as a replay so we can see what went wrong. A replay shows the
  page as it appeared to you, and the contents of form fields are masked.
- **Cookie:** one first-party session cookie, `_dd_s_v2`, holding a random
  session identifier that lapses after 15 minutes of inactivity (4 hours
  at most).
- **Role and retention:** Datadog acts as our **processor**, on our
  instructions, and keeps the data in the United States for no more than
  **30 days**, under the safeguards on the
  [transfers page](../../handling/transfers/); see
  [processors and platforms](../../handling/processors/) and
  [retention](../../handling/retention/).
- **Legal basis:** our legitimate interest in keeping the pages working
  (GDPR Art. 6(1)(f)); you may [object](../../rights/your-rights/) at any
  time.
