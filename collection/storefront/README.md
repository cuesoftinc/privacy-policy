# storefront.cuesoft.io: Storefront™

Storefront™ is the shop, booking page or landing page we build for a
business. This page covers the **marketing site** at storefront.cuesoft.io,
where you can read about it and ask for one.

A storefront we have built for somebody else is a different matter: it is
that business’s own website, they are the controller of whatever their
customers enter on it, and this policy does not describe it. Where that
storefront runs on a licensed Cueprise™ deployment, what Cuesoft holds as
their processor is set out in the
[Cueprise™ privacy notice](../../cueprise/). Where it was built as a
CueHIRE™ engagement against their own back office instead, that notice does
not reach it and the engagement’s own data terms govern what we hold and for
how long.

## Enquiry form

- **What:** your name, work email, business name, the sector you picked from
  the list, and anything you added in the message box. We also record the
  country Cloudflare’s edge places you in: derived from your IP address as
  you submit rather than asked for on the form, and stored as the country
  name, not the address itself. It tells us which of our two entities should
  answer you.
- **Why:** to reply to your enquiry and scope the site you are asking for.
- **Where:** records are stored in Airtable, our forms database, in the same
  table as CueHIRE™ enquiries: building a storefront is a CueHIRE
  engagement, so it is one pipeline rather than two.
- **Legal basis:** our legitimate interest in responding to the business
  enquiry you sent us (GDPR Art. 6(1)(f)), and the equivalent
  legitimate-interest basis under the NDPA: you may
  [object](../../rights/your-rights/) at any time. An engagement that follows
  is between Cuesoft and your business rather than with you: if you enquired
  as an employee or representative you are usually not a party to it, so
  contract performance cannot become the basis for your own name and work
  email. Where an engagement is signed with you as an individual, processing
  under it rests on that contract (Art. 6(1)(b)).
- **Confirmation:** we email you a receipt, copied to
  [storefront@cuesoft.io](mailto:storefront@cuesoft.io): see
  [what every site collects](../all-sites/).
- **Booking a time directly:** the page also links to a Google Calendar
  booking page, which opens in a new tab. What you enter there goes to
  Google, under [Google’s privacy policy](https://policies.google.com/privacy),
  and not through our form.

## Analytics and advertising tags: opt-in only

This site uses analytics and advertising tags, gated behind a consent
banner. None of them loads, and none of their cookies is set, until you press
**Accept** (the cookieless Cloudflare measurement described in
[what every site collects](../all-sites/) and the
[performance and error monitoring](#performance-and-error-monitoring) below are
separate and run either way):

| Provider         | Purpose                                                                                                                                                                                                                                                             | Their policy                                                                       |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Google Analytics | Traffic and journey measurement; building remarketing audiences that are shared with our Google Ads account; and, where you are signed in to Google, age, gender and interest reporting plus cross-device advertising audiences for Google Ads (**Google signals**) | [policies.google.com/privacy](https://policies.google.com/privacy)                 |
| Google Ads       | Ad measurement and remarketing                                                                                                                                                                                                                                      | [policies.google.com/privacy](https://policies.google.com/privacy)                 |
| Meta             | Ad measurement and remarketing                                                                                                                                                                                                                                      | [facebook.com/privacy/policy](https://www.facebook.com/privacy/policy/)            |
| LinkedIn         | Ad measurement                                                                                                                                                                                                                                                      | [linkedin.com/legal/privacy-policy](https://www.linkedin.com/legal/privacy-policy) |
| X (Twitter)      | Ad measurement                                                                                                                                                                                                                                                      | [x.com/en/privacy](https://x.com/en/privacy)                                       |

- **What they receive:** a cookie or device identifier, your IP address,
  the page URLs you visit on this site and the referring URL, plus basic
  device and browser metadata and the page-view events themselves. Google
  Analytics uses the IP address in passing to derive an approximate
  location and then discards it: the address itself is not stored, and the
  location is what is kept. Google Analytics keeps
  this for **14 months**: see [retention](../../handling/retention/). We
  do not send your form contents to any of them.
- **One event beyond page views:**
  when you send us a brief, or click the link that books a time directly,
  **Google Ads, Meta, LinkedIn and X** are told that it happened, so
  they can credit the ad you arrived from. Google Analytics is not: it
  receives the page views described above and nothing more. The event
  records the fact of the brief or the click and nothing else: not your
  name, not your email, not your phone number, and not what you wrote.
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

## What this site does not do

It takes no payment and quotes no price: a storefront is built at no charge,
and it can connect to Cueprise™ or to a system you already run. Apart from the
[performance and error monitoring](#performance-and-error-monitoring) above, nothing
loads before you accept, and the cookieless Cloudflare measurement described
in [what every site collects](../all-sites/) stays outside the consent gate
because it sets no cookie.

## What you have to give, and what happens if you do not

- **The enquiry form:** your first and last name, work email, business name and
  the sector are required, and submitting accepts the privacy policy and terms.
  The message box is optional. If you leave a required item out, the form does
  not send and we cannot answer you through it. You can write to
  [storefront@cuesoft.io](mailto:storefront@cuesoft.io) instead. The country we
  record is taken from your connection, not asked for.
- **Booking a time directly:** this is your choice, it opens on Google’s own
  page, and the form does not need it.
- **Special categories:** the form has no field for health, religion,
  ethnicity or any other special category of data, and we ask you not to put
  any in the message box.
- **Banner:** if you decline it, the analytics and advertising tags do not
  load, and the site works identically either way.

## The legal basis for each thing this site does

| What happens                                                  | Legal basis                                                                                                                                           |
| ------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| The enquiry form and its confirmation email                   | Legitimate interest in responding to a business enquiry: GDPR Art. 6(1)(f); Art. 6(1)(b) only where an engagement is signed with you as an individual |
| Booking a time directly on Google Calendar                    | Your own action: Google acts under its own policy                                                                                                     |
| Server and security logs, cookieless analytics and monitoring | Legitimate interest: Art. 6(1)(f), as set out above and on [what every site collects](../all-sites/)                                                  |
| Analytics and advertising tags                                | Consent: Art. 6(1)(a), withdrawable at any time                                                                                                       |

Under the Nigeria Data Protection Act 2023 (NDPA) the same activities rest on
the matching bases in s. 25: legitimate interest, contract where an engagement
is with you, and consent. See
[Nigeria](../../jurisdictions/nigeria/#lawful-bases). Where we rely on
legitimate interests, we have balanced them against your rights, and you may
[object](../../rights/your-rights/) at any time.

## Who receives it, where it goes and how long it stays

- **Who receives it:** Airtable, which holds the enquiry; Brevo, which sends
  the confirmation; Cloudflare, which tells us your country; and the Cuesoft
  staff who answer enquiries. Google receives what you enter if you book a
  time on its calendar page, and Google, Meta, LinkedIn and X receive tag data
  only if you press **Accept**. Each processor is named on
  [processors and platforms](../../handling/processors/). We do not sell
  personal data.
- **Where it goes:** some of these providers are outside your country, and the
  safeguards that cover each transfer are on
  [international transfers](../../handling/transfers/).
- **How long it stays:** records of inactive enquiries are deleted or
  anonymised within 24 months of last contact, unless a legal duty requires
  longer: see [retention](../../handling/retention/).

## Your rights on this site

You have the rights listed on [your rights](../../rights/your-rights/):
access, correction, deletion, restriction, objection, portability, withdrawing
consent and complaint. To use one, email
[hello@cuesoft.io](mailto:hello@cuesoft.io) and say that it is about
Storefront™. Either Cuesoft entity can act on it, and we reply within one
month: see [how to exercise them](../../rights/your-rights/#how-to-exercise-them).

- **A storefront we built for a business:** ask that business, which is the
  controller of what its customers enter. Where we hold that data as its
  processor, we help it answer you.
- **Complaints:** you may complain to your supervisory authority at any time:
  see the [Nigeria](../../jurisdictions/nigeria/),
  [EU and UK](../../jurisdictions/eu-uk/) and
  [United States](../../jurisdictions/united-states/) pages.

## Children

Storefront™ is for people 18 and older: the form asks you to confirm it when
you submit, and we do not knowingly collect personal data from anyone under 18. If you believe a minor has sent an enquiry, tell us at
[hello@cuesoft.io](mailto:hello@cuesoft.io): see
[children](../../rights/children/).

## Automated decisions

We make no decision about you by solely automated means that has legal or
similarly significant effects: see
[automated decisions](../../rights/your-rights/#automated-decisions). A person
reads and answers every enquiry.

## Security, cookies and contact

- **Security:** see [security](../../handling/security/) for how we protect
  data and [breach notification](../../handling/breach/) for what we do if
  something goes wrong.
- **Cookies and similar technologies:** every one this site uses or may set is
  listed, with how to manage it, in
  [cookies and similar technologies](../all-sites/#cookies-and-similar-technologies).
- **Terms:** the [Terms of Service for the Websites](https://terms.cuesoft.io/websites/),
  which cover Storefront™ and Client Work, go with this page.
- **Contact:** [storefront@cuesoft.io](mailto:storefront@cuesoft.io) or
  [hello@cuesoft.io](mailto:hello@cuesoft.io), and the postal addresses and
  phone numbers on the [main page](../../#contact).
