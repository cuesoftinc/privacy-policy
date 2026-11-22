# Upstat Privacy Notice

**Effective date: 22 November 2026**

This notice covers **Upstat** at **upstat.cuesoft.io**: the service that
checks whether your sites and services are up, alerts you when they are
not, publishes status pages, and counts visits and errors on the sites you
connect to it.

Two groups of people meet Upstat, and the roles differ:

| Data                                                                                        | Controller             | Processor |
| ------------------------------------------------------------------------------------------- | ---------------------- | --------- |
| Your Upstat account, your organisation’s members, monitors, alert channels and status pages | Cuesoft                |           |
| Events from the visitors of a site connected to Upstat                                      | The owner of that site | Cuesoft   |

Cuesoft here means Cuesoft Inc. and Cuesoft Nigeria Limited, as joint
controllers under the [privacy policy](../), reachable at
[hello@cuesoft.io](mailto:hello@cuesoft.io). If you visit a site that uses
Upstat, that site’s own privacy notice governs what it measures, and this
notice describes how Upstat handles it on the site’s behalf.

Upstat is open-source software. If you run your own copy, you are the
controller of the data it holds, and this notice does not describe it.

Upstat is for people 18 and older: see [children](../rights/children/). If
we learn that someone under 18 has an account, we verify and delete it. The
[Upstat Terms](https://terms.cuesoft.io/upstat/) go with this notice.

## For Upstat Account Holders

### Signing In and Your Organisation

- **What we collect:** you sign in with Google, the only way in. Upstat
  receives from Google your email address and name. For each organisation
  it keeps the members you invite, with their email, name, role and
  whether they have joined.
- **Session:** a cookie that scripts on the page cannot read, valid for up
  to 24 hours, plus two short-lived cookies used only during sign-in (10
  minutes and 5 minutes).
- **Legal basis:** performing the contract you enter when you create an
  account (GDPR Art. 6(1)(b), and the equivalent contractual basis under
  the NDPA).

### Monitors, Alerts and Status Pages

- **What we collect:** the name and address of each thing you monitor, its
  check results and incidents, and your alert channels: an email address,
  or a web address Upstat calls, with the secret that signs the call.
- **Alert email** is sent through **Brevo**, which receives the address
  and the message.
- **Incident summaries:** Upstat can write a short summary of an incident
  with **Google’s Vertex AI**, or with **Groq** where it is switched on.
  They receive the incident’s severity, risk score and findings, never
  your monitors’ names or anyone’s personal data.
- **Status pages** are public and show only what you choose to publish.
- **Retention:** check results are kept for **90 days** and daily uptime
  figures for **13 months**; your account, monitors and channels until
  you delete them or your account.
- **Legal basis:** performing the contract (GDPR Art. 6(1)(b)).

### Required or Optional, and Other People’s Details

- **Required:** signing in with Google. Without it there is no account.
- **Optional:** everything else: inviting members, monitors, alert channels,
  status pages and the events a site sends. You decide what to add.
- **Other people’s details:** the members you invite and the email addresses
  you add as alert channels belong to other people. Add only people who
  expect it, and tell them how Upstat handles their data. An invited member
  takes part by signing in with the invited address.
- **Lawful basis for those people:** performing the contract with you, and
  our legitimate interest in delivering the alerts and invitations you ask
  for (GDPR Art. 6(1)(b) and (f)); they may [object](../rights/your-rights/).

### Logs, Traces and Metrics You Send

An account holder can also send Upstat logs, traces and metrics from their
own systems, in the OpenTelemetry format. **You are the controller** of what
you send, and Cuesoft processes it as your processor, only to show it to you.
Keep personal data out of it, because it is stored as sent.

- **Retention:** logs and metrics are kept for **15 days** and traces for
  **7 days**. Their one-minute rollups are kept for 90 days and their hourly
  rollups for 13 months.
- **Where:** in ClickHouse Cloud, as described under
  [where your data is held](#where-your-data-is-held).

<!-- TODO(owner): confirm that sending logs, traces and metrics to Upstat is live in production; the code (upstat/api/observability and the Helm chart) ships it, but the retention page and the notice named only visitor events and check results -->

## For Visitors to Sites That Use Upstat

A site owner can send Upstat events about visits to their site: page
views, errors and loading speed. Upstat is built so that those events do
not identify you.

- **No cookies and no stored identifiers.** Upstat sets nothing on your
  device.
- **Your IP address and browser are never stored.** Upstat uses them for
  a moment, with the site and a random value that changes every day, to
  make a one-way code that lets it count unique visitors for that day.
  The daily value is destroyed 48 hours after the day ends, after which
  the code cannot be linked to anything. Because the site is part of the
  code, Upstat cannot follow you from one site to another.
- **What is stored with each event:** the event’s name and time, the page
  address, the site you came from (its domain only), the kind of device
  (phone, tablet or desktop), a country code, and the one-way code above.
  An error event also stores the error message; a speed event, the
  measurement. A site owner can add their own fields to events.
- **Retention:** individual events for **90 days**, hourly totals for 90
  days and daily totals, which identify nobody, for **13 months**.
- **Legal basis:** the site owner’s, set out in their notice. Upstat
  processes the events only on the site owner’s instructions.
- **Site owners:** page addresses, error messages and your own fields are
  stored as you send them. Keep personal data out of them.

## Who Receives Your Data

Upstat uses these providers, each on our instructions and listed on
[processors and platforms](../handling/processors/): Google Cloud (running
the service), ClickHouse Cloud (events and check data), Aiven (the other
databases), Brevo (alert emails), Google’s Vertex AI and Groq (incident
summaries, with no personal data) and Datadog (monitoring of our own logs).
Those processors may change: [processors and platforms](../handling/processors/)
is kept current.

## Decisions About You

Incident summaries written by AI are drafts for a person to read. Upstat
makes no decision about any person by automated means, and a summary never
holds anyone’s personal data.

## Logs and Monitoring

Our servers keep operational logs, and **Datadog** monitors their health
on our instructions. Upstat’s own service logs are kept for no more than
**15 days**: see [retention](../handling/retention/).

## Where Your Data Is Held

Upstat runs on **Google Cloud** in Iowa, United States, its event data is
held in **ClickHouse Cloud** in the same region, and its other databases
are run for us by **Aiven** in DigitalOcean’s San Francisco region. See
[processors and platforms](../handling/processors/) and
[international transfers](../handling/transfers/).

## On Your Device

Upstat keeps your light or dark choice and your colour-vision setting in
your browser’s local storage. This stays on your device and is not sent to
us as analytics. The session cookie is described under
[signing in](#signing-in-and-your-organisation). Upstat carries no
advertising software, and sets nothing on the device of a visitor to a site
that uses it.

## International Transfers

Your data is held in the United States, as the section above says. If you
use Upstat from Nigeria, the EU or the UK, that is a transfer out of your
country, made under the safeguards on the
[transfers page](../handling/transfers/).

## Security and Breaches

Upstat’s own safeguards are on the [security page](../handling/security/).
Visitor events are built so that they identify nobody. If a breach affects
your data, we follow [breach notification](../handling/breach/). Where we
process a site’s visitor events for its owner, we tell the owner without
undue delay, as the [Upstat Terms](https://terms.cuesoft.io/upstat/) say.

## Your Rights in Upstat

Account holders: email [hello@cuesoft.io](mailto:hello@cuesoft.io) for a
copy of your data, to correct it, or to delete your account. Visitors:
Upstat holds nothing that identifies you, so ask the site you visited
about what it measures. Every right, and how to exercise it, is on
[your rights](../rights/your-rights/).

**We do not sell personal data, and Upstat carries no advertising tags.**

## Complaints, Terms and Contact

- **Complaints:** you may complain to your supervisory authority at any
  time: see the [Nigeria](../jurisdictions/nigeria/#complaints) and
  [EU and UK](../jurisdictions/eu-uk/#complaints) pages, and the
  [United States page](../jurisdictions/united-states/).
- **Requests:** we answer within one month: see
  [how to exercise your rights](../rights/your-rights/#how-to-exercise-them).
- **Terms:** the [Upstat Terms](https://terms.cuesoft.io/upstat/) go with
  this notice.
- **Changes:** see [changes to this policy](../#changes-to-this-policy).
- **Contact:** [hello@cuesoft.io](mailto:hello@cuesoft.io).
