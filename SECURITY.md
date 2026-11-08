# Security Policy

## Supported Versions

Security fixes are applied to `main`, which is the branch published to GitHub
Pages at https://privacy.cuesoft.io.

## Reporting a Vulnerability

Do not use the regular issue tracker. Report vulnerabilities through the
repository's **Security → Report a vulnerability** flow. If that option is
unavailable, email `security@cuesoft.io` with the subject
`Security vulnerability: privacy-policy`.

Include the impact, affected page or script, reproduction steps, and any
suggested mitigation. Do not include production credentials or personal data.
We aim to acknowledge reports within three business days.

## Secret and Data Handling

- Keep `NODE_AUTH_TOKEN` and the Datadog RUM values out of the repository; they live in repository secrets.
- Never commit `.env` files, service-account keys, or personal data.
- Use synthetic identities in tests and screenshots.
- Rotate a credential immediately if exposure is suspected.
