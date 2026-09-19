# Front Desk (working title)

Team **LAN Party** (Lisa, Aaron, Nick) at UFCU's Develop U Hackathon, Saturday September 19, 2026.

Challenge: **Reimagine UFCU's New Member Onboarding Experience.** Our thesis: UFCU's in-branch
front desk is welcoming, multilingual, and flexible (no SSN required for international students,
products explained in plain language). The online application is a rigid form that turns those same
people away at step one. Front Desk brings the branch experience online: a guided, multilingual,
source-linked conversation that gets a person from "I think I need a bank account" to a prefilled,
trustworthy application in minutes, without ever typing sensitive data into a chatbot.

## Status
Build day. The full vertical slice runs locally: landing, Front Desk conversation (live Claude plus scripted personas), Secure Zone application with a simulated trust readout, five languages. See docs/11-demo-runbook.md for the exact demo clicks.

## Read in this order
1. [docs/00-brief.md](docs/00-brief.md): the challenge, deliverables, schedule, judging.
2. [docs/01-research-synthesis.md](docs/01-research-synthesis.md): what we learned (banker interview, current flow, UFCU site).
3. [docs/02-brainstorm.md](docs/02-brainstorm.md): opportunities ranked by demo value against build cost.
4. [docs/03-prd.md](docs/03-prd.md): MVP scope, non-goals, stretch goals, acceptance criteria.
5. [docs/04-architecture.md](docs/04-architecture.md): stack, data flow, tool schema, corpus format.
6. [docs/05-build-plan.md](docs/05-build-plan.md): roles, timeline, check-ins, scope-cut ladder, QA.
7. [docs/06-demo-and-pitch.md](docs/06-demo-and-pitch.md): 5-minute demo script, deck outline, judge Q&A prep.
8. [docs/07-personas.md](docs/07-personas.md): the hard-coded demo personas and their scripted paths.
9. [docs/08-brand.md](docs/08-brand.md): UFCU palette, contrast rules, CSS variables.
10. [docs/09-rubric-map.md](docs/09-rubric-map.md): the official scorecard mapped to what we build and demo.
11. [docs/10-competitor-switch.md](docs/10-competitor-switch.md): competitor first screens and the switching story.
12. [docs/11-demo-runbook.md](docs/11-demo-runbook.md): exact clicks for the demo, modes, recovery.
13. [docs/research/](docs/research/): source-linked UFCU research that grounds the assistant.

Coding agents: read [AGENTS.md](AGENTS.md) first.

## Running
```bash
pnpm install
cp .env.example .env.local   # add ANTHROPIC_API_KEY
pnpm dev
```

## Resources
`Resources/` holds the challenge PDF, the agenda, and (untracked, shared separately) the current
account-opening walkthrough video and the branch packet the front-desk banker gave us.
