# Accident Intake Form

A multi-step lead-qualification form for a fictional personal injury law firm. Built to mirror how a real intake form actually works — branching qualification logic, event tracking through GTM/GA4, and a webhook handoff to a CRM.

**Live demo:** https://formsandfunnels.com/accident_intake_form/<br>
**Case study / write-up:** https://formsandfunnels.com/projects/project_accident_intake_form.html

## What it does

The form walks a visitor through four qualifying questions:

1. Were you injured in a car accident?
2. What's the estimated total of your losses?
3. Do you have automobile insurance?
4. Do you already have a lawyer for this case?

Questions 1, 3, and 4 can disqualify a lead — if that happens, the form shows a message instead of continuing, and no conversion is ever recorded. Only a fully qualified lead reaches the contact form (name, email, phone) and, eventually, the thank-you page.

## Tracking

- Each step fires its own `step_N_complete` event into `dataLayer`, so drop-off can be tracked per question, not just at the end.
- A qualified lead fires a separate `lead_qualified` event with all four answers attached.
- Both are wired to real GTM triggers and a GA4 event tag, tested and confirmed in GTM Preview mode.
- The thank-you page reads the damages range back out of the URL (`URLSearchParams`) and pushes it into `dataLayer` there too, so a page-view-based pixel on that page has access to it.

## Validation

Name, email, and phone are all validated on submit, not per field — same pattern Gravity Forms uses under the hood. Email and phone use regex; phone also has a live input mask that formats digits as `(555) 123-4567` while typing.

## Webhook

On submit, the form sends the collected data to a webhook endpoint via `fetch()`. Note: this hits a real CORS wall if the endpoint doesn't explicitly allow the request's content type — worked around here using `text/plain` instead of `application/json` for the header, purely for testing against webhook.site. A production version of this would move the webhook call server-side to avoid CORS entirely.

## File structure

```
index.html        — the form itself
script.js         — all step logic, validation, dataLayer pushes, webhook call
style.css         — styling
thank-you.html     — landing page after a qualified submission
```

## Stack

HTML, CSS, vanilla JavaScript. No frameworks, no build step. Google Tag Manager and GA4 for tracking.

## Notes

This is a portfolio project, not a real law firm or a real form in production use. Built as a hands-on way to learn dataLayer architecture, GTM trigger/tag setup, and form-to-CRM handoff patterns from the ground up.

