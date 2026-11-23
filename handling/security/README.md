# Security

We apply proportionate technical and organisational safeguards:

- **Encrypted transport (TLS) everywhere**: every Cuesoft property is
  HTTPS-only.
- **Edge protection and origin controls**: our APIs answer only requests
  that arrive through our edge security layer; requests that bypass it are
  rejected.
- **Least-privilege access**: form records and infrastructure are
  accessible only to the people who need them for their role, and access
  is revocable per engagement.
- **Two-factor authentication** is mandatory on company systems.
- **No credentials in chat**: secrets move through a secret manager, never
  through messaging platforms, per our public
  [cybersecurity policy](https://handbook.cuesoft.io/policies/cyber/).
- **A binding internal policy**: everyone who works with us is bound by
  the [data-protection policy](https://handbook.cuesoft.io/policies/data-protection/)
  in the company handbook.

No internet transmission is guaranteed 100% secure; we commit to prompt,
lawful handling if something goes wrong: see
[breach notification](../breach/).

## Safeguards in specific products

- **Card details stay with Paystack.** Cards are typed only into Paystack’s
  own window or hosted page, and Cuesoft never receives the card number or
  security code: see [what every site collects](../../collection/all-sites/).
- **Your account shows who is signed in.** The Security page of
  [account.cuesoft.io](../../collection/account/#security) lists your
  sign-in methods, passkeys and sessions, and lets you end any of them. The
  session cookie cannot be read by scripts on the page, and sign-in follows a
  return address only when it is one of the Cuesoft sites.
- **Monitoring is masked.** Datadog never records what you type, and the
  contents of form fields are masked in the one case where a failed page is
  recorded as a replay: see
  [performance and error monitoring](../../collection/all-sites/#performance-and-error-monitoring).
- **Cueprise™ deployments are isolated.** Every Licensee has its own
  deployment and its own database: see the
  [Cueprise™ Privacy Notice](../../cueprise/#how-cueprise-is-deployed).
- **Cuelearn™ platform safeguards** are in the
  [Cuelearn™ Privacy Notice](../../cuelearn/#security-and-breach) and in each
  licensing agreement.
- **Processors are bound by contract.** Each of our
  [processors](../processors/) processes data only on our instructions under
  its data processing agreement.
- **Data is encrypted at rest.** Google Cloud encrypts the data we hold there
  at rest by default. The databases Aiven runs for us are encrypted at rest,
  and so are their backups.
- **Backups.** Aiven takes automatic backups of the databases it runs for us.
  A file deleted from Google Cloud Storage is kept for 7 more days, then
  removed for good.

## What you can do

- Use the sign-in method that suits you (a passkey, a one-time code or
  Google), and keep the email address and phone number that receive your
  codes secure.
- Where a product asks for a password, choose a strong one that you use
  nowhere else.
- Do not share a one-time code with anyone.
- Look at the Security page of your Cuesoft account now and then, and end
  any session you do not recognise.
- Type a card number only into Paystack’s own window or page.
- Do not put sensitive personal information into Ace, or into free-text
  fields that ask you to keep personal data out.
- Keep your device and browser up to date.

## Reporting a security problem

If you think your account or data has been exposed, or you are unsure
whether a message really came from us, email
[hello@cuesoft.io](mailto:hello@cuesoft.io). Our
[cybersecurity policy](https://handbook.cuesoft.io/policies/cyber/) tells
everyone who works with us to report suspected phishing, breaches and unusual
account activity to the same address straight away.

To report a vulnerability in the source of these pages, follow the
repository’s
[security policy](https://github.com/cuesoftinc/privacy-policy/blob/main/SECURITY.md):
use GitHub’s **Security, Report a vulnerability** flow, or email
`security@cuesoft.io` with the subject `Security vulnerability: privacy-policy`.
Do not include production credentials or personal data. We aim to acknowledge
reports within three business days.

To report a vulnerability in Apparule, Expendit, Upstat or the Cuelearn™ and
Cueprise™ platforms, email `security@cuesoft.io` with the subject
`Security vulnerability:` followed by the name of the part (`apparule`,
`expendit`, `upstat`, `cuelearn`, `cuelearn-client`, `cueprise` or
`cueprise-client`). Where that part’s repository offers GitHub’s **Security,
Report a vulnerability** flow, you can use it instead. Do not include
production credentials or personal data. We aim to acknowledge reports within
three business days.
