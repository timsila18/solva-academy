# Production Implementation Prompt 7

Prompt 7 integrates Solco as the provider-adapter live-learning and collaboration layer for Solva Academy. It does not implement native WebRTC media infrastructure, AI summaries, AI attendance interpretation, external calendar account synchronization, paid webinar checkout, live-session payouts, or native mobile calling.

## Selected Provider

Initial provider: `mock` Solco adapter.

The adapter is intentionally provider-neutral and supports room creation, short-lived role tokens, webhook signature checks, and normalized webhook events. This lets the product and database architecture work now while keeping Daily, LiveKit, Zoom, Google Meet, Teams, Jitsi, or future native Solco infrastructure pluggable later.

## Environment Variables

- `SOLCO_PROVIDER=mock`
- `SOLCO_WEBHOOK_SECRET=`
- `SOLCO_TOKEN_TTL_SECONDS=900`

Provider API keys are not required for the mock adapter. A real provider will require provider-specific API credentials, webhook endpoint configuration, recording configuration, and staging verification.

## Implemented Scope

- Live session types, sessions, series, occurrences, hosts, presenters, moderators, registrations, waitlists, rooms, provider events, join events, attendance, attendance events, attendance corrections, resources, agendas, chat, polls, live quizzes, whiteboards, breakout rooms, recordings, recording access, transcripts, reminders, incidents, consent records, learning hours, make-up sessions, and coaching notes.
- Solco provider adapter with mock room/token/webhook implementation.
- Secure server actions for creating sessions, registering/waitlisting, generating short-lived join tokens, chat, polls, poll responses, incident reports, and attendance corrections.
- ICS calendar export and live calendar route.
- Virtual classroom shell with provider stage placeholder, host controls, token generation, chat, polls, and incident reporting.
- Instructor, academy, organization, and learner live dashboards.
- Attendance calculation helpers for reconnect merging, thresholds, status, and learning hours.
- Child-safety data fields and defaults for child-focused session types.
- RLS policies for session visibility, registration, chat, attendance, recordings, incidents, and tenant isolation.

## Routes Added

- `/live/[sessionSlug]`
- `/live/create`
- `/live/calendar`
- `/live/classroom/[occurrenceId]`
- `/live/reports`
- `/learner/live`
- `/instructor/live`
- `/academy/live`
- `/organization/live`
- `/api/live/webhook`
- `/api/live/sessions/[sessionId]/ics`

## Database Migration

- `supabase/migrations/0007_solco_live_learning.sql`

## What Was Tested

- Attendance reconnect merging, status thresholds, and learning-hour caps.
- ICS generation and join-window state.
- Provider adapter room creation and role-token generation.
- Live session, registration, and incident validation.
- Next.js typecheck, lint, tests, production build.
- Supabase migration push.

## Unverified Until Staging

- Real video provider room provisioning.
- Browser microphone/camera/screen-share permissions.
- Real recording start/stop/retrieval.
- Real provider webhook signature format and retry behavior.
- Live captions/transcripts from a provider.
- Whiteboard and breakout-room provider feature parity.

## Staging Verification

1. Select a real provider and implement an adapter beside the mock adapter.
2. Configure provider API keys and webhook secret.
3. Create a staging live session and confirm room creation.
4. Join as host and learner; verify different role permissions.
5. Trigger provider webhooks for join, leave, recording ready, and room ended.
6. Confirm attendance, recordings, and provider events are normalized.
7. Test a child-focused session with waiting room, private chat disabled, and recording restrictions.

## Known Limitations

- The virtual classroom is a premium Solco shell and adapter integration point, not native WebRTC.
- Chat is persisted and sanitized, but real-time delivery is not yet implemented.
- Polls and live quizzes have storage/actions, but no live streaming UI.
- Recording and transcript records are ready, but real provider media processing is unverified.
- Background jobs are represented by reminders/status tables; a queue runner is deferred.

## Deferred to Prompt 8

- Capabilities requested by Prompt 8 should continue from this live-learning foundation without replacing the provider-adapter architecture.
