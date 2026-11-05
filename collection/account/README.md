# account.cuesoft.io: Account Site

This is the Cuesoft account site: one sign-in for CueTA™, CueLABS™, CueHIRE™
and the Cuesoft products, and the place where you keep your account. You can
sign up, sign in with a one-time code, Google or a passkey, and then manage
your profile, work history, sign-in security, saved cards, payout bank
details, identity documents, access, notification choices and privacy
settings. Every page sends what you type to the Cuesoft platform that runs
your account, which holds it. The only outside services you deal with
directly are Google, if you sign in with it, and Paystack, when you add a
card. Each section below names the page, what it collects, why,
where it is held, who receives it and the legal basis. Apart from the server
logs and cookieless analytics described in
[what every site collects](../all-sites/), the sections on this page, the tags
and the monitoring are all this site collects. The site is closed to search
engines.

## Signing Up and Signing In

You can sign in with a one-time code, with Google or with a passkey. Sign-up
is its own page and creates a learner or an applicant account; if you are
hired through CueHIRE™, we set your account up for you.

- **What we collect:** to sign up, your first name, last name and email
  address, and the kind of account the link you followed asked for (learner or
  applicant). To sign in with a code, your email address or, where the
  platform offers codes by WhatsApp, your phone number, and then the six-digit
  code. With Google, the platform receives from Google the account you chose
  and its email address. With a passkey, your browser’s own passkey prompt
  runs and the site sends the platform only the signed answer it returns. For
  each session the platform records a label for your browser and device, your
  IP address, and when the session was opened, last seen and ends. We keep
  your account record: name, email address, phone number if you add one, the
  picture address if one is set, your account type, and when you last signed
  in and when the account was created.
- **Why:** to create your account, check that it is you, keep you signed in
  and take you back to the Cuesoft site that sent you. The site follows a
  return address only when it is one of the Cuesoft sites.
- **Where:** your account is held on the Cuesoft platform that runs your
  account. Your session is that platform’s cookie, which scripts on the page
  cannot read. During Google sign-in only, your browser also keeps a random
  one-use code and the return address in its session storage until you come
  back, and the site deletes both then.
- **Who receives it:** the platform sends your one-time code by email through
  **Brevo**, and by WhatsApp where that is offered. If you choose Google,
  your browser leaves for Google’s own sign-in, which Google runs under its
  own privacy policy. See [processors and platforms](../../handling/processors/).
- **Legal basis:** steps at your request prior to a contract, and performing
  the contract once you have an account (GDPR Art. 6(1)(b), and the
  equivalent contractual basis under the NDPA). Recording the device and IP
  address of a session, so you can see and end your sessions and we can
  protect the account, rests on our legitimate interest in keeping accounts
  secure (Art. 6(1)(f)).

## Your Profile and Work History

- **What we collect:** on the profile page, your first name and last name
  (required), your phone number (optional) and your email address, which the
  page shows but does not let you change. On the work history page, for each
  role: the role, the company, the start date and either an end date or that
  you still work there. The page does not ask for a description of the role.
  The account bar also shows the email address and, if one is set, the picture
  address of your account.
- **Why:** to run your account and, for work history, to show your experience
  on your applications. The page’s own words are that CueHIRE™ shows it to a
  client, in your words.
- **Where:** the profile is part of your account record. Work history is held
  with your personnel record on the Cuesoft platform, so it appears only for
  an account that has one.
- **Who receives it:** nobody outside Cuesoft and the platform that holds it.
  This site sends them nothing else.
- **Legal basis:** performing the contract (GDPR Art. 6(1)(b), and the
  equivalent contractual basis under the NDPA).

## Security

- **What we collect:** the page shows, and does not ask you to type,
  the sign-in methods linked to your account (with the email address, phone
  number or Google account each uses, and when it was linked), your passkeys
  (name, when created and last used) and your sessions (device, IP address,
  when each was opened and last seen). You can unlink Google, remove a passkey,
  end one session or end every session except this one.
- **Why:** so that you can see how your account is reached and end access you
  do not recognise.
- **Where:** held on the Cuesoft platform that runs your account. Ending a
  session ends it there.
- **Who receives it:** nobody outside Cuesoft and the platform that holds it.
- **Legal basis:** performing the contract (GDPR Art. 6(1)(b)) and our
  legitimate interest in keeping accounts secure (Art. 6(1)(f)).

## Cards

Cards are saved on the Payment Methods page, under **Add Card**. The cards
you save there pay for your CueTA™ subscription or your CueHIRE™ invoices.

- **Where the card is typed:** the card number, expiry date and security code
  are typed only into **Paystack’s own window**, which opens over the page
  when you press Add Card. The page loads Paystack’s script only then. This
  site has no field for them, never sees them and does not send them to the
  Cuesoft platform, and **Cuesoft never receives your card number or security
  code**. The platform also refuses a card number if one ever reached it, and
  the site’s own tests fail if any request to the site or the platform carries
  one.
- **What the site sends Paystack:** to open its window, your email address
  from your profile, an amount of 50 naira (NGN) and the instruction to take a
  card payment only. 50 naira is the smallest charge Paystack takes, so adding
  a card makes that payment from it. Neither the site’s code nor the platform’s
  account code refunds it.
- **What the site sends the platform:** one request carrying Paystack’s
  transaction **reference** for that payment, and whether you want the card as
  your default. Nothing else: no card number, security code, expiry, brand,
  last four digits or Paystack token, and no name on the card.
- **What the platform asks and keeps:** the platform asks Paystack about the
  reference, using Cuesoft’s secret key, and takes from the answer the card’s
  authorization code (Paystack’s token for the card, which is not a number),
  brand, last four digits, expiry month and expiry year, and whether the card
  can be saved. It keeps those, the name of the gateway, whether the card is
  your default, whether it is active, and when it was added. It keeps no card
  number and no security code, because it never receives them. The Cards list
  and the export show brand, last four digits, expiry and default only (the
  list also shows the status of the card); the authorization code is never
  shown or exported.
- **Why:** to take the payments you choose to pay by card, and to show you
  which card is which.
- **Where:** the saved card record is held on the Cuesoft platform that runs
  your account. The card itself, and the 50 naira payment, are held by
  Paystack.
- **Who receives it:** **Paystack** receives the card from you in its window,
  and your email address and the amount from the site; the platform and
  Paystack exchange the reference and the authorization code. Paystack
  processes them under its own security certification and its own privacy
  notice: see [processors and platforms](../../handling/processors/). The
  advertising platforms do not receive card details: the tags send page views
  only.
- **Removing a card:** the Remove button takes the card out of your account.
  The platform marks the record deleted rather than erasing it: to have it
  erased, use the [rights page](../../rights/your-rights/). Deleting your
  account does the same for every saved card.
- **Legal basis:** performing the contract under which you pay by card (GDPR
  Art. 6(1)(b), and the equivalent contractual basis under the NDPA).

## Payout

- **What we collect:** on the Payout Bank Details page, your bank (chosen from
  a list), your ten-digit account number and the account name. The page shows
  the number back with only its last four characters. The platform also keeps
  a sort code and a currency if one is sent, which this page does not send.
  For each account it keeps whether it is verified, pending or not verified,
  when and by which staff member it was verified, a fingerprint of the
  details that decision covers, and the reason shown to you if it was
  rejected.
- **Why:** to know where to send your payouts. New or changed details start as
  pending until a member of staff verifies or rejects them.
- **Where:** held in your personnel record on the Cuesoft platform, so the page
  works only for an account that has one. The platform holds the full account
  number and returns it masked.
- **Who receives it:** the members of staff who verify payouts, and the
  platform that holds it. This site sends the details nowhere else.
- **Legal basis:** performing the contract under which we pay you (GDPR Art.
  6(1)(b), and the equivalent contractual basis under the NDPA).
- **Removing it:** the Remove button deletes the saved account.

## Identity Checks

- **What we collect:** the Identity Check page opens only after your
  application is accepted. It takes up to two documents, an identity document
  and a proof of address, each a PDF, JPG or PNG of up to 10 MB. The site
  uploads the file and then submits it as that document type. It asks for no
  document number. The platform keeps the file, its original name and size,
  the document type, its status (pending, approved or rejected), the reviewer’s
  note, and when it was sent and reviewed.
- **Why:** to confirm who you are before we finish setting you up. Staff
  review the documents, and you can remove a file before you submit it.
- **Where:** the file is held in the Cuesoft platform’s file storage and the
  record in your personnel record there.
- **Who receives it:** the members of staff who review documents, and the
  platform that holds them. This site sends the files nowhere else.
- **Legal basis:** steps at your request prior to a contract, and performing
  the contract (GDPR Art. 6(1)(b), and the equivalent contractual basis under
  the NDPA).

## Access and Notifications

- **What we collect:** the Your Access page asks for nothing. It shows which
  Cuesoft apps your account can open, with the reason, using your account type
  and licence. The Notifications page asks you to switch on or off five kinds
  of email: product updates, billing and receipts, security alerts, learning
  reminders, and offers and events. The platform keeps your choice for each
  one you change. Product updates, billing and security alerts start on;
  learning reminders and offers and events start off.
- **Why:** to show you what you can open, and to email you only what you chose.
- **Where:** held on the Cuesoft platform that runs your account.
- **Who receives it:** the platform sends your emails through **Brevo**: see
  [processors and platforms](../../handling/processors/).
- **Legal basis:** performing the contract for billing and security emails
  (GDPR Art. 6(1)(b)); consent for learning reminders and offers and events,
  which you can switch off at any time (Art. 6(1)(a)); our legitimate interest
  in telling you about the products you use for product updates (Art. 6(1)(f)),
  which you may object to by switching them off.

## Your Privacy Settings

- **What we collect:** the Privacy & Data page asks you to press a button. To
  export, it asks the platform to build a file called `cuesoft-account.json`
  and saves it on your device at once. The file holds your account record
  (identifier, email, phone, names, picture address, account type, when you
  signed up and last signed in), your saved cards (brand, last four digits,
  expiry, default), your notification choices and, for an account with a
  personnel record, your payout details with the number masked, your identity
  documents (type, status, note and date, not the files) and your work
  history. To delete, you type DELETE to confirm. The platform keeps the
  request, its date and the date it is due.
- **Why:** so that you can see and take a copy of your data and ask for your
  account to be deleted without writing to us.
- **Where:** the platform keeps the export as a record for seven days, after
  which it can no longer be downloaded. A deletion is booked for **30 days**
  after you ask: sign-in keeps working so you can cancel. It is refused while
  you own a workspace or have unpaid invoices. When the date comes, the
  platform deletes your saved cards, notification choices and export files,
  marks the account deleted so that no one can sign in to it, and ends every
  session. The account record is marked deleted and not erased, and the step
  does not remove your payout details, identity documents or work history,
  which sit in your personnel record: ask for those on the
  [rights page](../../rights/your-rights/).
- **Who receives it:** nobody outside Cuesoft and the platform that holds it.
- **Legal basis:** meeting your request to see, take or delete your data (GDPR
  Art. 6(1)(c), and the equivalent legal duty under the NDPA).

## Analytics and advertising tags: opt-in only

This site uses analytics and advertising tags on its live address, gated
behind a consent banner. None of them loads, and none of their cookies is
set, until you press **Accept** (the cookieless Cloudflare measurement
described in [what every site collects](../all-sites/) and the
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
  do not send what you type on this site to any of them.
- **Page views only:** this site sends no conversion events. The platforms
  are told which pages are viewed and nothing about what you do on them.
- **Matching switched off:** we turn off Meta’s automatic matching and
  automatic event detection and X’s automatic advanced matching, so those
  platforms do not read details from the page to identify you.
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

## What is still true

Apart from the [performance and error monitoring](#performance-and-error-monitoring)
above, nothing loads before you accept, and the cookieless Cloudflare
measurement described in [what every site collects](../all-sites/) stays outside
the consent gate because it sets no cookie. The advertising platforms receive
page views only: they do not receive what you type on any page above, your
card details, or any account record. Card entry is described under
[Cards](#cards) and nowhere else on this site.
