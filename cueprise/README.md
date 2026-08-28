# Cueprise™ Privacy Notice

**Effective date: 28 August 2026**

This notice covers **Cueprise™** in both the places you meet it: the
website at **cueprise.cuesoft.io**, where you can read about the product and
ask for a demo, and the **platform** itself, licensed to organisations
("licensees") under written agreements.

Those two halves work differently, which is why they are kept apart below. On
the website, Cuesoft is the controller of what you send us, in the ordinary
way. Inside a licensed deployment, **the licensee, not Cuesoft, is the data
controller** of the data the platform holds.

## The Cueprise™ website

### Demo request form

- **What:** your name, work email, business name, the trade you picked from
  the list, and anything you added in the message box. We also record the
  country Cloudflare's edge places you in: derived from your IP address as
  you submit rather than asked for on the form, and stored as the country
  name, not the address itself. It tells us which of our two entities should
  answer you.
- **Why:** to reply to your request and arrange the walkthrough you asked
  for.
- **Where:** records are stored in Airtable, our forms database.
- **Legal basis:** our legitimate interest in responding to the business
  enquiry you sent us (GDPR Art. 6(1)(f)), and the equivalent legitimate-
  interest basis under the NDPA — you may
  [object](../rights/your-rights/) at any time. Cueprise™ is licensed to
  organisations rather than to people, so the licence that may follow is
  between Cuesoft and your business: you are usually not a party to it, and
  contract performance therefore cannot be the basis for your own name and
  work email. The same reasoning applies to the staff
  and representatives of a licensee, below. Where a licence is signed with you as an
  individual, processing under it rests on that contract (Art. 6(1)(b)).
- **Confirmation:** we email you a receipt, copied to
  [cueprise@cuesoft.io](mailto:cueprise@cuesoft.io) — see
  [what every site collects](../collection/all-sites/).

Data inside a licensed Cueprise™ deployment is governed by that licence's
data terms and by the rest of this notice.

### Analytics and advertising tags — opt-in only

This site uses analytics and advertising tags, gated behind a consent
banner. None of them loads, and no cookie is set, until you press
**Accept** — the cookieless Cloudflare measurement described in
[what every site collects](../collection/all-sites/) is separate and runs either way:

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
  location is what is kept. Google Analytics keeps this for **14 months** —
  see [retention](../handling/retention/). We do not send your form
  contents to any of them.
- **One event beyond page views:** when you request a demo, **Meta** is
  told that it happened, so it can credit the ad you arrived from. Google
  Analytics is not: it receives the page views described above and nothing
  more. The event records the fact of the request and nothing else: not
  your name, not your email, not your business, and not what you wrote.
  Google Ads, LinkedIn and X receive page views on this site but are not
  told about the request.
- **If you are signed in to Google:** we have Google signals switched on,
  so where you are signed in to a Google account that has Ads
  Personalisation enabled, Google may connect this visit to that account
  and combine it with what Google already holds there: location, search
  history, YouTube history and activity on sites that partner with Google.
  What that does, precisely: it lets us see age, gender and interest
  summaries, and it lets Google build advertising audiences that can reach
  you across your devices. It does **not** merge your devices together in
  our own reports — since February 2024 Google signals is not part of how
  Analytics counts users — so we do not see your phone and your laptop as
  one person. And Google uses the visit for its own ads personalisation as
  well as for our measurement. You control it on Google's side,
  independently of us, at
  [myadcenter.google.com](https://myadcenter.google.com) and
  [Google's activity controls](https://myaccount.google.com/activitycontrols)
  — switching Ads Personalisation off there stops it for every site, not
  just ours. Declining our banner prevents it entirely.
- **Decline and none of them load.** The site works identically either
  way.
- **Withdraw any time** via the site's **Cookie preferences** link.
  Withdrawal stops the tags loading from that point on; it does not delete
  cookies already set (you can clear those in your browser). What happens
  to data already collected differs by provider: Google Analytics holds it
  as our **processor**, on our instructions, so the
  [rights page](../rights/your-rights/) reaches it. The exception is what
  Google signals feeds into Google's own ads personalisation, which Google
  controls rather than us: manage that in your
  [Google account](https://myadcenter.google.com). The four advertising
  platforms hold what they collected as **independent businesses** under
  their own policies — see
  [processors and platforms](../handling/processors/).
- An opt-out preference signal (**Global Privacy Control**) overrides a
  stored opt-in for as long as your browser sends it.
- **Legal basis:** consent (GDPR Art. 6(1)(a)); California treatment is on
  the [United States page](../jurisdictions/united-states/).

### What this site does not do

No payment data is ever requested, and no fee is quoted here — a Cueprise™
licence is priced after a conversation. See the
[Cueprise™ Terms](https://terms.cuesoft.io/cueprise/). Nothing loads before you
accept, and the cookieless Cloudflare measurement described in
[what every site collects](../collection/all-sites/) stays outside the consent gate
because it sets no cookie.

## The Cueprise™ platform

Everything from here describes a licensed deployment rather than the website.

### How Cueprise™ is deployed

Every licensee gets its **own isolated deployment with its own database**.
No licensee's data shares an instance, a database or an encryption
boundary with any other licensee's. Deployments are operated by Cuesoft on
Google Cloud infrastructure unless the licensing agreement provides
otherwise.

A deployment periodically verifies its licence key against Cuesoft's
licensing service. The request payload carries the licence key and nothing
else; like any web request it also reveals its source IP address, which the
licensing service processes transiently for rate limiting, as described
under [service telemetry](#service-telemetry) below.

### Roles

| Data | Controller | Processor |
| --- | --- | --- |
| Licensee data — records, files and people data inside the platform, including the licensee's customers and storefront shoppers | The licensee | Cuesoft |
| Account and administration data — named users, roles, authentication records | The licensee | Cuesoft |
| Relationship data — licensee contacts, contracts, invoices, support correspondence | Cuesoft | — |
| Service telemetry — operational logs and usage metrics needed to run and secure the platform | Cuesoft | — |

### What the platform holds

So licensees can describe their deployment accurately in their own privacy
notices, these are the categories of personal data a Cueprise™ deployment
stores, depending on which modules the licensee uses:

| Category | Fields |
| --- | --- |
| Staff accounts | Name, email, phone, avatar, role and branch, sign-in history; for Google sign-in, the profile Google returns |
| Business customers | Name, email, phone, tax ID, addresses, credit terms |
| Storefront shoppers | Name, phone (and optional alternate phone), email, delivery and billing addresses, order notes, order history |
| Login codes | For WhatsApp one-time codes: the phone number and a cryptographic hash of the code. The code itself is never stored |

### Payments

Card details **never enter Cueprise™**. Online payments happen on
**Paystack's** hosted checkout page under Paystack's own security
certification; the platform sends Paystack only the payer's email address,
the amount and an order reference, and receives back the payment status.

### When Cuesoft is the processor

For licensee data, Cuesoft processes **only on the licensee's documented
instructions**, under the data terms of the licensing agreement:

1. To provide, support, secure and maintain the platform, and for nothing
   else. Cuesoft does not mine licensee data, does not use it for
   advertising, does not sell it, and does not use it to train AI models.
2. Access inside Cuesoft is least-privilege and logged; personnel who can
   touch licensee data are bound by
   [confidentiality](https://handbook.cuesoft.io/policies/confidentiality/)
   and [data-protection](https://handbook.cuesoft.io/policies/data-protection/)
   obligations.
3. Sub-processors are engaged under contracts that impose the same
   protections. The table below names the platform's sub-processors; each
   licensing agreement confirms which are active for that deployment and
   how the licensee is told of changes.
4. On termination or expiry, licensee data is returned or deleted as the
   agreement provides.
5. Cuesoft assists the licensee with data-subject requests, security
   incidents and impact assessments concerning licensee data, as the
   agreement and applicable law require.

**If your data is inside a licensee's Cueprise™ deployment**, for
example you are an employee of an organisation that runs Cueprise™, or a
customer who bought from a store it powers, **the organisation's own
privacy notice governs the platform records about you, and rights requests
about them go to that organisation.** We refer any request we receive
about a licensee's data to that licensee, and help them answer it. The
exception is the data Cuesoft controls itself, relationship data and the
service telemetry described below: rights requests about those come to
Cuesoft directly at [hello@cuesoft.io](mailto:hello@cuesoft.io), because
the licensee cannot act on data it does not control.

### Sub-processors

These providers process **licensee data** in the licensee-to-Cuesoft
processing chain:

| Provider | Role in the platform | Personal data it touches |
| --- | --- | --- |
| Google Cloud | Hosting, file storage, staff sign-in | Everything the deployment stores; for sign-in, the staff member's Google profile |
| Paystack | Online payments | From the platform: payer email, amount, order reference. On Paystack's own hosted page, the shopper additionally enters card or other payment details, which never enter Cueprise™ and are handled under Paystack's own policy |
| Brevo | Transactional email | Recipient name and email |
| Meta (WhatsApp Business Platform) | One-time login codes and staff invitations by WhatsApp | Recipient phone number and the message body: the one-time code being delivered, or the invitation's details |
| Cloudinary | Media storage, where the licensee's deployment is configured to use it | Uploaded files |

Separately, **Datadog** processes the service telemetry described below.
Because Cuesoft is the controller of that telemetry, Datadog acts there as
**Cuesoft's own processor**, not as a sub-processor of licensee data.

### When Cuesoft is the controller

For **relationship data**, the licensee contacts, contracts, invoices and
support correspondence involved in running the licensing relationship,
Cuesoft is the controller. **Legal basis:** where the licensee is an
individual, performance of the licensing contract (GDPR Art. 6(1)(b));
for the staff and representatives of an organisational licensee, who are
usually not parties to the contract themselves, our legitimate interest
in managing the relationship their organisation entered into
(Art. 6(1)(f)); and, for records kept beyond the relationship, compliance
with legal obligations (Art. 6(1)(c)).

Cuesoft is also the controller of the **service telemetry** needed to run
and secure the platform.

#### Service telemetry

- **Server-side**: request traces, error reports and operational logs from
  each deployment's services.
- **Admin application**: usage analytics in the staff-facing admin app,
  including, in production, a session-replay sample of roughly one in five
  admin sessions used for debugging. Sign-in callback addresses are
  scrubbed before anything is sent, and replay is of the admin interface
  used by licensee staff; storefront shoppers are not session-replayed by
  the platform.
- **Security**: IP addresses are processed transiently to rate-limit
  sign-in and licensing endpoints and to attribute traffic through our
  edge protection.

**Legal basis:** our legitimate interest in securing, supporting and
improving the platform (Art. 6(1)(f)). Licensee staff whose sessions
appear in telemetry are usually not parties to the licensing contract, so
we do not rely on contract performance for this processing; the
legitimate-interest balance is struck by the sampling, the scrubbing and
the admin-only scope described above.

Service telemetry, including session-replay samples and any IP addresses
appearing in request logs, is kept for **30 days**, the same period the
[retention page](../handling/retention/) sets for infrastructure and
security logs. The rate-limiting counters themselves are shorter-lived
still: they hold an IP only for the minutes their sliding window covers.
Relationship data follows the retention page and the agreement. The
[jurisdiction pages](../jurisdictions/nigeria/) apply to this data as they
do to website data.

### Security and breach

The platform is operated under the safeguards on the
[security page](../handling/security/), plus the platform-specific
measures stated in each licensing agreement. Security incidents affecting
licensee data are notified to the affected licensee without undue delay,
with the detail the licensee needs for its own legal obligations — see
[breach notification](../handling/breach/).

## Contact

Cueprise™ privacy questions — licensees and data subjects alike:
[hello@cuesoft.io](mailto:hello@cuesoft.io).
