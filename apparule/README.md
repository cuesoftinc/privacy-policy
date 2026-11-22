# Apparule Privacy Notice

**Effective date: 22 November 2026**

This notice covers **Apparule**: the web app at **apparule.cuesoft.io** and
the Apparule mobile app, where you capture your body measurements from a
phone, keep them in a private vault, follow designers and commission
outfits from them.

Cuesoft is the controller of everything Apparule holds, as set out in the
[privacy policy](../): Cuesoft Inc. and Cuesoft Nigeria Limited, as joint
controllers, reachable at [hello@cuesoft.io](mailto:hello@cuesoft.io). That
includes the records a designer keeps about their own customers in
Apparule: those customers are asked for their consent by Apparule
directly, not through the designer.

Apparule is open-source software. If you run your own copy, you are the
controller of the data it holds, and this notice does not describe it.

## Who Can Use Apparule

You can use Apparule from the age of **13**. If you are under 18, you may
use it only with a parent’s or guardian’s agreement, which also covers the
consent for your photos below. See [children](../rights/children/).

## Under 18s and Parents or Guardians

- **Under 13:** Apparule is not for anyone under 13, and we do not
  knowingly hold data about anyone that young. If we learn that we do, we
  verify and delete it.
- **13 to 17:** a parent or guardian must agree to the
  [Apparule Terms](https://terms.cuesoft.io/apparule/) on your behalf. That
  agreement also covers the consent for your photos below.
- **Rights for a minor:** a parent or guardian can ask for access to,
  correction of or deletion of a minor’s data at
  [hello@cuesoft.io](mailto:hello@cuesoft.io), as
  [exercising rights for a child](../rights/your-rights/#exercising-rights-for-a-child)
  explains.

<!-- TODO(owner): how Apparule records or checks a parent’s or guardian’s agreement; the code records only the account’s own acceptance of the terms and privacy notice, and has no guardian check -->

## What Is Required and What Is Optional

| Detail                                 | Required?                                                                                             |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Signing in with Google, and a username | Required: without them there is no account                                                            |
| Display name, city, state and country  | Optional                                                                                              |
| Photos and height for a capture        | Required for a photo capture, and only after your consent. You can enter measurements by hand instead |
| Delivery details on an order           | Required to place an order: the designer needs them to deliver                                        |
| A bank account                         | Required only for a designer who wants to post and be paid                                            |
| Push notifications                     | Optional: they need your permission on your phone                                                     |
| Notification settings                  | Optional: you can switch quotes, order status, social activity and payouts on or off                  |

## Signing In

- **What we collect:** you sign in with Google, the only way in. Apparule
  receives from Google your Google account identifier, email address,
  name and profile picture address. You then choose a username and, if you
  like, a display name and the city, state and country you want shown.
- **Why:** to create your account, keep you signed in and show your
  profile to the people you deal with.
- **Session:** a cookie that scripts on the page cannot read, valid for up
  to 24 hours.
- **Legal basis:** performing the contract you enter when you create an
  account (GDPR Art. 6(1)(b), and the equivalent contractual basis under
  the NDPA).

## Body Photos and Measurements

- **What we collect:** for each capture, a photo of you from the front and
  one from the side, and your height. Location and camera metadata are
  stripped from the photos when they upload. From them Apparule computes
  your measurements, and it keeps any measurement you enter or correct by
  hand.
- **How they are processed:** on our own servers, by open-source pose and
  body-outline models that ship with Apparule. No photo is sent to an
  outside AI service, and photos are never used to recognise who you are.
- **Who sees them:** only you. Your vault is private. When you commission
  a designer, they receive a fixed copy of the measurements you attach to
  that order, never your photos. The share button builds a text of your
  latest measurements that you paste wherever you choose; Apparule sends
  it nowhere itself.
- **Improving the measurement model:** your photos and measurements are
  used to measure you and for nothing else, unless you turn on a separate
  opt-in that lets us use them to improve Apparule’s measurement model.
  It is off unless you switch it on, and you can switch it off at any
  time, after which what you gave is removed from our training data.
  Apparule does not offer that opt-in yet, so nothing you capture today is
  used this way.
- **Retention:** a capture you do not save, or one that fails, is deleted
  with its photos within 24 hours. The photos of a saved capture are
  deleted 30 days after you save it; the measurements stay until you
  delete them or your account. Deleted files remain in our storage
  provider’s recovery copy for up to 7 more days.
- **Legal basis:** your consent, which Apparule asks for before your first
  capture (GDPR Art. 6(1)(a), and consent under NDPA s. 25). You can
  withdraw it by deleting your captures or your account.

## Sensitive Information

A body photo can reveal more about you than a measurement does, so we treat
photos and measurements as sensitive. We ask for your explicit consent
before your first capture (GDPR Art. 9(2)(a), and the NDPA’s rules on
sensitive personal data), use them only to measure you, and show them only
to you. You can withdraw your consent at any time, as described above.

## Designers, Posts and Social Features

- **What we collect:** what you post (text and images), your likes,
  saves, comments and follows, the accounts you block and the reports you
  make. A designer also adds a bio and the bank details payouts go to:
  Apparule keeps the bank’s name and code and Paystack’s reference for the
  account, while Paystack holds the account number.
- **Who sees it:** posts, comments and profiles are visible to everyone
  using Apparule. Reports and blocks are seen only by our moderation
  staff.
- **Retention:** until you delete them or your account.
- **Legal basis:** performing the contract (GDPR Art. 6(1)(b)). Reviewing
  reports rests on our legitimate interest in keeping Apparule safe
  (Art. 6(1)(f)).

## Public Posts and Designer Payout Checks

- **Post links:** a post can also be opened by anyone who has its link,
  whether or not they use Apparule.
- **Payout checks:** when a designer adds a bank account, Apparule asks
  Paystack to verify it and to set it up for payouts. Apparule keeps whether
  the check passed, the reason if it did not, and the details already
  listed above. A designer must pass the check to post.

## Orders and Messages

- **What we collect:** the order, its notes and the measurement copy
  attached to it, and the messages and images you and the designer send
  in its thread.
- **Retention:** thread messages are deleted 30 days after the order
  closes, and in-app notifications after 90 days. The order record itself
  is kept as a transaction record: see [payments](#payments).
- **Legal basis:** performing the contract (GDPR Art. 6(1)(b)).

## Delivery Details and Order Records

- **What we collect:** when you place an order you give a delivery
  recipient’s name, phone number and address (two address lines, city,
  state and country). An order also holds the designer’s decline reason or
  tracking reference, and, if you open a dispute, its reason and your
  description.
- **Who sees it:** you and the designer on the order, and our support team
  if a dispute needs it. The designer needs the delivery details to deliver.
- **Retention:** the delivery details and the measurement copy stay with the
  order record, which is kept as a transaction record: see
  [payments](#payments) for how long.
- **Legal basis:** performing the contract (GDPR Art. 6(1)(b)), and our legal
  obligation to keep transaction records (Art. 6(1)(c)).

## Payments

Card details **never enter Apparule**. You pay on **Paystack’s** hosted
checkout under Paystack’s own security certification and
[privacy policy](https://paystack.com/privacy). Apparule keeps the payment
reference, amount and currency of each attempt, and the escrow, refund and
payout entries that follow. Those records, like the orders they belong to,
are kept for as long as Nigerian tax and company law require us to keep
transaction records, and they lose your name and email when you delete
your account.

- **Legal basis:** performing the contract, and our legal obligation to
  keep transaction records (GDPR Art. 6(1)(b) and (c)).

## Email and Push Notifications

- **Email:** Apparule emails you when money moves on one of your orders: a
  payment received, an order funded, a payout released or a refund. It
  sends them through **Brevo**, which receives your email address and the
  message.
- **Push:** if you allow notifications on your phone, Apparule stores your
  device’s push token and sends notifications through **Google’s Firebase
  Cloud Messaging**.
- **Legal basis:** performing the contract (GDPR Art. 6(1)(b)). Turn push
  off in your phone’s settings at any time.

## Logs and Monitoring

Our servers keep operational logs, and **Datadog** monitors their health
on our instructions. Logs never contain your photos or measurement values.
They are kept for no more than **30 days**: see
[retention](../handling/retention/).

- **Legal basis:** our legitimate interest in running a secure, working
  service (GDPR Art. 6(1)(f)); you may [object](../rights/your-rights/).

## Consent Records

Apparule records which version of the terms and of this notice your account
accepted, and when. We keep it to show what you agreed to. **Legal basis:**
our legitimate interest in proving that consent (GDPR Art. 6(1)(f)); you
may [object](../rights/your-rights/).

## On Your Device

- **Web app:** besides the session cookie above, the web app keeps your
  light or dark choice, whether you have seen the first-save notice and your
  recent searches in your browser’s local storage, and, only during sign-in,
  a one-use code in session storage. None of this is sent to us as
  analytics, and you can clear it in your browser.
- **Mobile app:** your session token is kept in the phone’s secure storage,
  and your theme choice, recent searches and which guides you have seen in
  the app’s own storage. The app asks your permission to use the camera for
  a capture, and where you attach a picture it lets you choose one from your
  library.
- **No tracking software:** Apparule’s apps carry no analytics or
  advertising software of their own.

## Where Your Data Is Held

Apparule’s services and files run on **Google Cloud** in the United States
(Iowa, with the web app served from Virginia), and its databases are run
for us by **Aiven** in DigitalOcean’s San Francisco region. See
[processors and platforms](../handling/processors/) and
[international transfers](../handling/transfers/).

## International Transfers

Your data is held in the United States, as the section above says. If you
use Apparule from Nigeria, the EU or the UK, that is a transfer out of your
country, made under the safeguards on the
[transfers page](../handling/transfers/).

## Security and Breaches

Your photos and measurements are visible only to your own account: the
database enforces that for each account, and files are served only through
time-limited signed links. Our safeguards are on the
[security page](../handling/security/). If a breach affects your data, we
follow [breach notification](../handling/breach/). Tell us at
[hello@cuesoft.io](mailto:hello@cuesoft.io) if you think someone else is
using your account.

## Automatic Steps and Decisions

- **Measurements** are computed automatically from your photos and are
  estimates. You review them and may correct them before anything relies on
  them.
- **Order timers** run automatically, as the
  [Apparule Terms](https://terms.cuesoft.io/apparule/) set out: a quote
  expires after 7 days, an order is refunded if the designer has not started
  within 14 days of payment, and delivery is confirmed 14 days after
  shipping if you do not confirm it. These follow fixed rules and use no
  profiling.
- **Moderation** decisions on reports and accounts are made by our staff,
  not by software.
- **Feeds and search** show posts from designers you follow, newest first,
  and sort search results by the filters you choose. Choosing to see
  designers near you compares the city, state and country on your profile
  with those on designers’ profiles.
- **Your right to a person:** you may ask for any of these to be reviewed
  by a person at [hello@cuesoft.io](mailto:hello@cuesoft.io). See
  [automated decisions](../rights/your-rights/#automated-decisions).

## Your Rights in Apparule

- **Export:** download your account, captures, orders, consent records
  and saved posts from your settings. For anything else, email
  [hello@cuesoft.io](mailto:hello@cuesoft.io).
- **Delete:** delete your account from your settings once no order is
  open and no payout is pending. It is removed at the next daily run. An
  account that never placed an order is deleted entirely; one that did is
  reduced to an anonymous stub so the transaction records above stay
  intact.
- Every other right, and how to exercise it, is on
  [your rights](../rights/your-rights/).

**We do not sell personal data, and Apparule carries no advertising
tags.**

## Complaints, Terms and Contact

- **Complaints:** you may complain to your supervisory authority at any
  time: see the [Nigeria](../jurisdictions/nigeria/#complaints) and
  [EU and UK](../jurisdictions/eu-uk/#complaints) pages, and the
  [United States page](../jurisdictions/united-states/).
- **Requests:** we answer within one month: see
  [how to exercise your rights](../rights/your-rights/#how-to-exercise-them).
- **Terms:** the [Apparule Terms](https://terms.cuesoft.io/apparule/) go with
  this notice.
- **Changes:** see [changes to this policy](../#changes-to-this-policy).
- **Contact:** [hello@cuesoft.io](mailto:hello@cuesoft.io).
