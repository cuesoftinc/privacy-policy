# Cueprise™ Privacy Notice

**Effective date: 17 August 2026**

This notice explains how personal data is handled in **Cueprise™**,
Cuesoft's enterprise business management platform, licensed to
organisations ("licensees") under written agreements. It works differently
from the websites, because in Cueprise™ **the licensee, not Cuesoft, is
the data controller** of the data inside the platform.

## How Cueprise™ is deployed

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

## Roles

| Data | Controller | Processor |
| --- | --- | --- |
| Licensee data — records, files and people data inside the platform, including the licensee's customers and storefront shoppers | The licensee | Cuesoft |
| Account and administration data — named users, roles, authentication records | The licensee | Cuesoft |
| Relationship data — licensee contacts, contracts, invoices, support correspondence | Cuesoft | — |
| Service telemetry — operational logs and usage metrics needed to run and secure the platform | Cuesoft | — |

## What the platform holds

So licensees can describe their deployment accurately in their own privacy
notices, these are the categories of personal data a Cueprise™ deployment
stores, depending on which modules the licensee uses:

| Category | Fields |
| --- | --- |
| Staff accounts | Name, email, phone, avatar, role and branch, sign-in history; for Google sign-in, the profile Google returns |
| Business customers | Name, email, phone, tax ID, addresses, credit terms |
| Storefront shoppers | Name, phone (and optional alternate phone), email, delivery and billing addresses, order notes, order history |
| Login codes | For WhatsApp one-time codes: the phone number and a cryptographic hash of the code. The code itself is never stored |

## Payments

Card details **never enter Cueprise™**. Online payments happen on
**Paystack's** hosted checkout page under Paystack's own security
certification; the platform sends Paystack only the payer's email address,
the amount and an order reference, and receives back the payment status.

## When Cuesoft is the processor

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
privacy notice governs, and rights requests go to that organisation.** We
refer any request we receive about a licensee's data to that licensee, and
help them answer it.

## Sub-processors

These providers process **licensee data** in the licensee-to-Cuesoft
processing chain:

| Provider | Role in the platform | Personal data it touches |
| --- | --- | --- |
| Google Cloud | Hosting, file storage, staff sign-in | Everything the deployment stores; for sign-in, the staff member's Google profile |
| Paystack | Online payments | Payer email, amount, order reference |
| Brevo | Transactional email | Recipient name and email |
| Meta (WhatsApp Business Platform) | One-time login codes and staff invitations by WhatsApp | Recipient phone number |
| Cloudinary | Media storage, where the licensee's deployment is configured to use it | Uploaded files |

Separately, **Datadog** processes the service telemetry described below.
Because Cuesoft is the controller of that telemetry, Datadog acts there as
**Cuesoft's own processor**, not as a sub-processor of licensee data.

## When Cuesoft is the controller

For **relationship data**, the licensee contacts, contracts, invoices and
support correspondence involved in running the licensing relationship,
Cuesoft is the controller. **Legal basis:** performance of the licensing
contract (GDPR Art. 6(1)(b)) and, for records kept beyond the
relationship, compliance with legal obligations (Art. 6(1)(c)).

Cuesoft is also the controller of the **service telemetry** needed to run
and secure the platform.

### Service telemetry

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

Retention for both follows the [retention page](../handling/retention/)
and the agreement; the [jurisdiction pages](../jurisdictions/nigeria/)
apply to this data as they do to website data.

## Security and breach

The platform is operated under the safeguards on the
[security page](../handling/security/), plus the platform-specific
measures stated in each licensing agreement. Security incidents affecting
licensee data are notified to the affected licensee without undue delay,
with the detail the licensee needs for its own legal obligations — see
[breach notification](../handling/breach/).

## Contact

Cueprise™ privacy questions — licensees and data subjects alike:
[hello@cuesoft.io](mailto:hello@cuesoft.io).
