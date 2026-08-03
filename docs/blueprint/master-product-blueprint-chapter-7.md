# Solva Academy Master Product Blueprint

## Chapter 7: Solco Live Classroom Architecture, Real-Time Communication, Messaging, Events, Attendance, Recordings, Coaching, and Collaboration

**Platform name:** Solva Academy  
**Repository / project name:** `solva-academy`  
**Production domain:** `academy.solvaone.co.ke`  
**Parent ecosystem:** SolvaOne / Solva Business Group  
**Main SolvaOne platform:** `solvaone.co.ke`  
**Chapter status:** Product and system blueprint only. No production code.

---

## 1. Executive Summary

Solco should be the native live classroom and collaboration layer of Solva Academy, not a simple embedded meeting link. Chapters 1 through 6 established Solva Academy as a standalone learning ecosystem with academies, instructors, learners, enterprise workspaces, courses, certificates, communities, and practical labs. Chapter 7 defines how Solco powers live teaching, coaching, office hours, oral assessments, events, attendance, recordings, messaging, and real-time engagement.

The live learning journey should be:

**Discover Session -> Register or Receive Assignment -> Get Reminder -> Join Room -> Participate -> Be Recorded as Attended -> Receive Notes and Resources -> Complete Follow-Up Work -> Continue Learning**

Solco should remain a distinct Solva product with reusable real-time capabilities across the wider Solva ecosystem, while feeling seamless inside Solva Academy. Solva Academy owns the learning context, access, progress, payments, assignments, and certificates. Solco owns or provides the real-time classroom infrastructure: audio, video, presence, chat, reactions, raise hand, polls, breakouts, captions, recordings, AI notes, and real-time event streams.

This chapter defines integration boundaries, session types, scheduling, calendars, registration, waiting rooms, classroom UI, host controls, participant controls, low-bandwidth mode, attendance, recordings, AI notes, captions, polls, Q&A, chat, breakouts, whiteboards, screen sharing, resources, oral assessments, mock interviews, music and dance lessons, coaching, office hours, events, messaging, child safety, corporate live training, reliability, moderation, analytics, admin controls, conceptual data, phased delivery, risks, acceptance criteria, and future dependencies.

---

## 2. Solco Classroom Philosophy

Solco should make live learning feel native to Solva Academy. Learners should not feel redirected to an unrelated application or lose course context when joining a class.

Solco should support:

- Live classes.
- One-on-one coaching.
- Group coaching.
- Office hours.
- Tutorials.
- Workshops.
- Webinars.
- Corporate training.
- Parent-teacher consultations.
- Oral assessments.
- Mock interviews.
- Music lessons.
- Dance lessons.
- Academic tutoring.
- Community discussions.
- Instructor training.
- Internal organization sessions.
- Large events.

The classroom experience should be mobile-first, low-data aware, accessible, safe for children, useful for professionals, and integrated with course progress, assignments, certificates, and attendance.

---

## 3. Integration Boundaries

Solva Academy and Solco should integrate through clean API and event boundaries so either product can evolve independently.

### Solva Academy Owns

Solva Academy should own:

- Course context.
- Session scheduling.
- Enrollment eligibility.
- Payment access.
- Academy ownership.
- Learner assignments.
- Certificate rules.
- Course progress.
- Attendance requirements.
- Follow-up activities.
- Notifications.

### Solco Owns or Provides

Solco should own or provide:

- Real-time audio.
- Real-time video.
- Screen sharing.
- Participant presence.
- Live chat.
- Reactions.
- Raise hand.
- Polls.
- Breakout rooms.
- Captions.
- Session recordings.
- Meeting artifacts.
- AI notes.
- Real-time event stream.

### Integration Principles

The integration should use stable identifiers, event callbacks, signed join tokens, scoped access, and audit logs. Solva Academy should never rely only on hidden frontend buttons to protect session access.

---

## 4. Session Types

Session types should be administrator-configurable.

Initial session types:

1. Course live lesson.
2. Revision class.
3. Tutor office hour.
4. One-on-one coaching.
5. Group coaching.
6. Workshop.
7. Webinar.
8. Bootcamp session.
9. Corporate training.
10. Internal staff briefing.
11. Oral assessment.
12. Mock interview.
13. Music practical.
14. Dance practical.
15. Parent consultation.
16. Mentorship session.
17. Community event.
18. Instructor onboarding.
19. Academy team meeting.
20. Public event.
21. Paid event.
22. Free event.
23. Invite-only event.
24. Recorded premiere.
25. Hybrid physical and online event.

Each type should define allowed access rules, recording defaults, attendance rules, capacity, payment eligibility, chat defaults, child safety settings, and reporting behavior.

---

## 5. Session Creation

Tutors, academy owners, and authorized organization users should create sessions from:

- Course page.
- Learning path.
- Instructor dashboard.
- Academy calendar.
- Corporate workspace.
- Coaching service.
- Community.
- Event page.

### Session Setup Fields

Session setup should include:

- Title.
- Description.
- Session type.
- Related course.
- Related academy.
- Related organization.
- Host.
- Co-hosts.
- Teaching assistants.
- Date.
- Start time.
- End time.
- Time zone.
- Capacity.
- Price where applicable.
- Access rules.
- Waiting room.
- Recording preference.
- Chat rules.
- Screen sharing rules.
- Participant microphone rules.
- Camera rules.
- Breakout room settings.
- Poll settings.
- Attendance rules.
- Minimum attendance duration.
- Parent approval requirement.
- Age restrictions.
- Preparation materials.
- Follow-up assignment.
- Reminder schedule.
- Cancellation policy.

Session creation should support draft, preview, publish, notify, duplicate, and recurring setup.

---

## 6. Status Model

Live session statuses should be auditable.

Statuses:

- Draft.
- Scheduled.
- Registration Open.
- Full.
- Waitlisted.
- Registration Closed.
- Starting Soon.
- Live.
- Paused.
- Ended.
- Recording Processing.
- Recording Ready.
- Cancelled.
- Rescheduled.
- No-Show.
- Archived.
- Under Review.
- Suspended.

Status changes should record actor, reason, previous status, new status, timestamp, workspace, linked course or organization, and notification impact.

---

## 7. Calendar Architecture

Solva Academy should provide a unified calendar for:

- Learners.
- Tutors.
- Academy owners.
- Corporate learners.
- Corporate trainers.
- Parents.
- Moderators.
- Super Admin.

### Calendar Views

Views:

- Day.
- Week.
- Month.
- Agenda.
- Upcoming.
- Live now.

### Calendar Items

Calendar items:

- Live classes.
- Coaching.
- Assignment deadlines.
- Assessment deadlines.
- Course releases.
- Events.
- Office hours.
- Corporate sessions.
- Certificate renewal.
- Parent consultations.

### Future Sync

Support future synchronization with:

- Google Calendar.
- Microsoft Outlook.
- Apple Calendar.
- iCal download.

Calendar permissions must respect personal, academy, organization, parent-child, and instructor boundaries.

---

## 8. Registration and Access

Live session access should support multiple entry paths and server-side eligibility checks.

### Access Paths

Support:

- Automatic access through course enrollment.
- Manual registration.
- Paid registration.
- Invitation.
- Corporate assignment.
- Parent-approved registration.
- Public registration.
- Private registration.
- Academy-only access.
- Organization-only access.
- Member-only access.
- Scholarship access.
- Coupon access.
- Waitlist.

### Join Checks

Before joining, verify:

- Session eligibility.
- Payment status.
- Enrollment status.
- Age or parent approval.
- Device readiness.
- Session capacity.
- Suspension status.
- Region or time restrictions where configured.

Denied access should show a clear reason and next step.

---

## 9. Waiting Room

The waiting room should be part of the learning experience, not a blank holding page.

It should support:

- Academy branding.
- Session title.
- Host name.
- Start time.
- Device test.
- Microphone test.
- Camera test.
- Speaker test.
- Display name confirmation.
- Code of conduct.
- Consent notice.
- Recording notice.
- Parent notice.
- Session resources.
- Join queue.
- Host admission.
- Automatic admission where allowed.
- Access denial reason.

The waiting room should have a lightweight low-bandwidth variant.

---

## 10. Classroom Interface

The classroom interface should adapt to session type and device.

### Core Interface

Include:

- Main video area.
- Participant list.
- Chat.
- Questions.
- Polls.
- Reactions.
- Raise hand.
- Screen sharing.
- Resources.
- Notes.
- Captions.
- Breakout rooms.
- Attendance indicator.
- Session agenda.
- Timer.
- Host controls.
- Recording indicator.
- Help and reporting.

### Responsive Modes

The interface should adapt for:

- Phone.
- Tablet.
- Desktop.
- Low bandwidth.
- Audio-only mode.
- Child learner mode.
- Webinar mode.
- One-on-one coaching.

---

## 11. Host Controls

Hosts need strong controls for safety, teaching flow, and classroom management.

Hosts should control:

- Start session.
- End session.
- Admit participants.
- Remove participants.
- Mute participant.
- Mute all.
- Disable camera.
- Allow microphone.
- Allow screen sharing.
- Promote co-host.
- Assign teaching assistant.
- Create breakout rooms.
- Launch polls.
- Pin speaker.
- Spotlight speaker.
- Lock room.
- Enable waiting room.
- Pause chat.
- Delete inappropriate messages.
- Record session.
- Pause recording.
- Stop recording.
- Take attendance snapshot.
- Mark participant status.
- Share files.
- Publish follow-up task.
- Trigger emergency moderation.

High-risk host actions should be logged.

---

## 12. Co-Hosts and Teaching Assistants

Live sessions should support scoped helper roles.

Roles:

- Lead host.
- Co-host.
- Teaching assistant.
- Moderator.
- Technical support.
- Interpreter.
- Assessor.
- Guest speaker.

Each role should have scoped permissions. A guest speaker should not automatically access private learner records, academy financial information, or organization reports.

---

## 13. Participant Controls

Participants should have useful controls within the limits of session rules.

Participants should be able to:

- Join audio.
- Join video.
- Leave audio.
- Turn camera on or off.
- Raise hand.
- React.
- Answer poll.
- Ask question.
- Use chat.
- Download approved resource.
- Request help.
- Report issue.
- Select captions.
- Choose audio-only mode.
- Change display name where allowed.
- Move between breakout rooms where allowed.
- Leave session.

Child account controls should be more restricted by default.

---

## 14. Low-Bandwidth Experience

Solco integration must support Kenyan connectivity realities.

Provide:

- Audio-only joining.
- Low-resolution video.
- Camera-off default option.
- Adaptive quality.
- Reduced participant video display.
- Chat-only fallback.
- Dial-in future support.
- Data usage indicator.
- Reconnect handling.
- Session continuity after brief disconnection.
- Background audio future mobile support.
- Lightweight waiting room.
- Recording playback at lower quality.
- Downloadable audio version where allowed.

The classroom should recover gracefully from unstable connections.

---

## 15. Attendance Architecture

Attendance should not rely only on joining the room.

Track:

- Registration.
- Join time.
- Leave time.
- Rejoin events.
- Total minutes present.
- Percentage of session attended.
- Breakout participation.
- Participation signals.
- Host manual adjustment.
- Device or connection interruptions.
- Late arrival.
- Early exit.

### Attendance Statuses

Statuses:

- Registered.
- Present.
- Partially Present.
- Late.
- Excused.
- Absent.
- Removed.
- Technical Disruption.
- Pending Review.

Attendance data should feed course progress, corporate reports, certificate eligibility, and parent visibility where authorized.

---

## 16. Attendance Rules and Corrections

Organizations, academies, and tutors should configure attendance rules.

### Attendance Rules

Rules may include:

- Minimum attendance percentage.
- Grace period.
- Late threshold.
- Early departure threshold.
- Required camera use where lawful and appropriate.
- Required poll or confirmation.
- Manual attendance option.
- Parent confirmation.
- Certificate attendance requirement.
- Assessment attendance requirement.
- Corporate compliance rules.

Do not use invasive participation tracking. Attendance should be transparent and proportionate.

### Corrections

Allow:

- Tutor correction.
- Corporate manager review.
- Learner appeal.
- Parent query.
- Technical issue evidence.
- Admin correction.
- Audit trail.

Corrections should preserve original data and reason.

---

## 17. Recording Architecture

Recording should be configurable per session and privacy-aware.

Support:

- Cloud recording.
- Audio recording.
- Video recording.
- Screen-share recording.
- Chat capture where permitted.
- Transcript.
- Captions.
- AI summary.
- Chapter markers.
- Download control.
- Stream-only access.
- Expiry.
- Archive.
- Replacement.
- Deletion request workflow.

Recording storage should enforce tenant, course, organization, and child-safety access boundaries.

---

## 18. Recording Consent and Access

Consent must be visible and specific.

### Consent Notice

Before joining a recorded session, show:

- Recording notice.
- Purpose.
- Who can access it.
- Retention period.
- Whether chat is included.
- Whether participant audio or video may appear.
- How to raise concerns.
- Child or parent consent requirements.

Do not rely on hidden consent.

### Access Options

Recording access options:

- Public.
- Registered participants.
- Enrolled learners.
- Course members.
- Academy members.
- Organization members.
- Host only.
- Admin only.
- Paid replay.
- Time-limited replay.
- Parent-controlled access.
- No replay.

Support access revocation.

---

## 19. Recording Post-Processing

After a session:

1. Recording enters processing.
2. Audio and video are prepared.
3. Transcript is generated.
4. Captions are generated.
5. AI summary is drafted.
6. Chapters are suggested.
7. Host reviews artifacts.
8. Sensitive sections may be trimmed.
9. Final recording is published to eligible users.
10. Follow-up activities are attached.

Nothing AI-generated should be treated as final before host review where accuracy matters.

---

## 20. AI Notes

Solco AI should support useful post-session artifacts.

AI notes may include:

- Session summary.
- Key points.
- Questions asked.
- Decisions made.
- Action items.
- Assignment reminders.
- Important timestamps.
- Glossary.
- Revision notes.
- Attendance summary.
- Frequently asked questions.

AI output should be clearly labelled and editable. For sensitive topics, human review should be required before learner release.

---

## 21. Captions and Transcripts

Captions and transcripts improve accessibility, revision, search, and low-data learning.

Support:

- Live captions.
- Post-session captions.
- Transcript.
- Speaker labels where available.
- Searchable transcript.
- Download control.
- Translation future support.
- Tutor correction.
- Learner accessibility use.

Transcripts should not become public by default.

---

## 22. Polls and Knowledge Checks

Hosts should create live polls and checks.

Types:

- Single-choice poll.
- Multiple-choice poll.
- Yes/no poll.
- Rating poll.
- Knowledge check.
- Anonymous poll.
- Named poll.
- Attendance confirmation.
- Feedback poll.

Poll results may be:

- Visible immediately.
- Visible after close.
- Host only.
- Included in course progress.
- Included in corporate reports.
- Excluded from grading.

---

## 23. Questions and Answers

Structured Q&A should be distinct from chat.

Features:

- Submit question.
- Anonymous question where enabled.
- Upvote.
- Mark answered.
- Assign to speaker.
- Written response.
- Live response.
- Follow-up answer.
- Export FAQ.
- Convert to course FAQ.
- Send unanswered questions to tutor inbox.

Q&A should support classroom learning, post-class follow-up, and AI-approved FAQ creation.

---

## 24. Classroom Chat

Chat should be useful, moderated, and configurable.

Support:

- Session-wide chat.
- Host messages.
- Announcements.
- Resource links.
- Reactions.
- Replies.
- Moderation.
- Slow mode.
- Disable chat.
- Export where permitted.
- Post-session availability.
- Report abuse.

Private participant-to-participant chat should be configurable and restricted for children.

---

## 25. Breakout Rooms

Breakout rooms should support group work and coaching.

Support:

- Automatic assignment.
- Manual assignment.
- Self-selection where enabled.
- Timed rooms.
- Room instructions.
- Room-specific resources.
- Host broadcast.
- Teaching assistant assignment.
- Return countdown.
- Room attendance.
- Room report.
- Random reshuffle.

Breakout room use for children should require stricter supervision and controls.

---

## 26. Whiteboard and Collaboration

Plan for collaborative teaching tools.

Capabilities may include:

- Shared whiteboard.
- Instructor whiteboard.
- Drawing.
- Text.
- Shapes.
- Images.
- Page navigation.
- Export.
- Save to course.
- Restricted editing.
- Breakout whiteboards.

This may be phased if Solco does not currently support all capabilities.

---

## 27. Screen Sharing

Screen sharing should be flexible and controlled.

Support:

- Entire screen.
- Application window.
- Browser tab.
- Host-only sharing.
- Participant sharing by approval.
- Multiple presenters future support.
- Shared audio.
- Mobile screen sharing.
- Stop-share control.
- Sensitive content warning.

Hosts should be able to stop participant sharing immediately.

---

## 28. Resource Sharing

During sessions, hosts may share:

- PDF.
- Slides.
- Images.
- Worksheets.
- Templates.
- Links.
- Assignments.
- Polls.
- Practice files.

Resources should save back into:

- Course.
- Lesson.
- Event.
- Coaching session.
- Corporate workspace.

Access rules should persist after the session.

---

## 29. Oral Assessments

Solco should support oral and practical assessments.

Use cases:

- Oral exams.
- Interviews.
- Music performance.
- Dance performance.
- Presentation assessment.
- Viva.
- Coaching evaluation.
- Language speaking assessment.

Support:

- Assessment rubric.
- Assessor panel.
- Recording consent.
- Candidate waiting room.
- Time limits.
- Private session.
- Score submission.
- Notes.
- Appeals.
- Moderation.

---

## 30. Mock Interviews

Mock interview sessions should support career readiness.

Features:

- Job role.
- Interview type.
- Interview panel.
- Question bank.
- Timed sections.
- Recording.
- AI transcript.
- Tutor feedback.
- Scorecard.
- Learner reflection.
- SolvaOne CV context where authorized.
- Follow-up interview preparation plan.

---

## 31. Music and Dance Lessons

Solco should support practical creative learning.

Requirements:

- High-quality audio mode where possible.
- Performance spotlight.
- Full-body camera guidance.
- Repetition markers.
- Practice file sharing.
- Tutor demonstrations.
- Learner submissions.
- Parent observation mode.
- Small group classes.
- One-on-one lessons.
- Recital events.
- Performance feedback.

These experiences may need special camera, audio, feedback, and recording settings.

---

## 32. Coaching and Booking

Coaching should be integrated from discovery through follow-up.

Support:

- Service listing.
- Tutor availability.
- Calendar.
- Booking.
- Payment.
- Session preparation.
- Solco room.
- Reminder.
- Cancellation.
- Rescheduling.
- Notes.
- Follow-up tasks.
- Rating.
- Refund rules.

Prevent double booking through calendar and availability checks.

---

## 33. Office Hours

Tutors should create:

- Open office hours.
- Appointment-based office hours.
- Course-specific office hours.
- Group office hours.
- Free or paid office hours.
- Recurring office hours.

Support waiting queue, capacity, reminders, and post-session notes.

---

## 34. Event Architecture

Solco should support events beyond courses.

Event types:

- Conference.
- Webinar.
- Public lecture.
- Career fair.
- Music recital.
- Dance showcase.
- Competition.
- Instructor summit.
- Corporate town hall.
- Community event.
- Graduation.
- Certificate ceremony.
- Product demonstration.
- Solva Academy open day.

Events may have:

- Multiple sessions.
- Speakers.
- Sponsors.
- Tickets.
- Agenda.
- Tracks.
- Exhibitors future support.
- Recordings.
- Certificates.
- Feedback.

---

## 35. Ticketing

Event and session registration should support flexible ticketing.

Support:

- Free ticket.
- Paid ticket.
- Invitation.
- Academy member access.
- Corporate access.
- Student discount.
- Group ticket.
- Scholarship ticket.
- Coupon.
- Early bird.
- Capacity.
- Waitlist.
- Check-in.

Ticketing should connect to payments, access rules, refunds, and attendance.

---

## 36. Recurring Sessions

Recurring sessions should support cohort, office hour, and term patterns.

Support recurrence:

- Daily.
- Weekly.
- Monthly.
- Custom days.
- Fixed number of sessions.
- Term schedule.
- Cohort schedule.
- Office hour schedule.

Allow:

- Edit one session.
- Edit this and following.
- Edit entire series.
- Cancel one session.
- Reschedule occurrence.
- Replace host.

---

## 37. Messaging Architecture

Messaging should work across Solva Academy and Solco contexts.

### Message Contexts

Contexts:

- Course.
- Academy.
- Coaching.
- Organization.
- Community.
- Support.
- Live session.
- Parent-tutor.
- Tutor team.
- Corporate manager.

### Message Features

Support:

- Direct message.
- Group message.
- Announcement.
- Thread.
- Attachment.
- Voice note where allowed.
- Read status.
- Mute.
- Archive.
- Report.
- Block.
- Retention settings.

Messaging must obey child safety, organization boundaries, academy scope, and user privacy.

---

## 38. Child Safety

Live learning for children requires stricter defaults.

For child learners:

- Parent approval.
- Safe display name.
- Restricted private chat.
- No public contact details.
- Controlled camera permissions.
- Controlled microphone permissions.
- Tutor verification.
- Session recording rules.
- Parent observation option.
- Report button.
- Moderator role.
- Attendance visibility.
- No unsupervised breakout room by default.
- Clear safeguarding escalation.

Child safety settings should be configurable by age group and jurisdiction policy.

---

## 39. Corporate Live Training

Organizations should use Solco for live workforce learning.

Organizations should be able to:

- Schedule mandatory sessions.
- Assign departments.
- Track attendance.
- Record sessions.
- Issue follow-up assessments.
- Download attendance reports.
- Escalate absence.
- Invite external trainers.
- Restrict recording access.
- Apply organization branding.
- Link training to compliance requirements.

Corporate live training should feed dashboards, reports, compliance records, and certificate rules.

---

## 40. Notifications

Live session notifications should be timely and channel-aware.

Notifications should include:

- Registration confirmation.
- Payment confirmation.
- Upcoming session.
- 24-hour reminder.
- 1-hour reminder.
- Starting now.
- Host delayed.
- Rescheduled.
- Cancelled.
- Recording ready.
- Notes ready.
- Assignment posted.
- Attendance recorded.
- Certificate available.
- Missed session follow-up.

Users should control channels where appropriate. Critical corporate, safety, and payment notices may have limited opt-out.

---

## 41. Reliability and Recovery

The platform should plan for failure and communicate clearly.

Plan for:

- Host disconnection.
- Participant disconnection.
- Session server failure.
- Recording failure.
- Duplicate join.
- Device change.
- Browser crash.
- Network instability.
- Rejoin.
- Backup host.
- Session continuation.
- Partial recording recovery.
- Incident reporting.

Learners and hosts should understand whether attendance, recording, or progress were affected.

---

## 42. Moderation

Live session moderation should support immediate safety and later review.

Support:

- Report participant.
- Remove participant.
- Temporary mute.
- Disable chat.
- Lock room.
- Escalate to platform moderation.
- Save evidence.
- Block rejoin.
- Emergency end session.
- Child safety escalation.
- Host misconduct report.

Moderation decisions must be auditable and appealable where appropriate.

---

## 43. Live Analytics

Live analytics should measure engagement and reliability without pretending that activity equals learning.

Track:

- Registrations.
- Attendance.
- No-show rate.
- Join time.
- Duration attended.
- Rejoin rate.
- Chat participation.
- Poll participation.
- Questions asked.
- Reactions.
- Recording views.
- Follow-up completion.
- Learner feedback.
- Tutor performance.
- Technical quality.
- Device types.
- Connection quality.
- Low-bandwidth usage.

Analytics should support tutors, academies, organizations, and platform operations.

---

## 44. Session Quality

Create an explainable session quality score.

Factors may include:

- Attendance.
- Session completion.
- Technical success.
- Learner feedback.
- Host preparation.
- Follow-up completion.
- Recording quality.
- Complaint rate.

Do not unfairly penalize:

- Small sessions.
- Technical outages outside tutor control.
- Advanced classes.
- Child sessions with restricted interaction.
- One-on-one coaching.

Show contributing factors and recommended improvements.

---

## 45. Admin Controls

Super Admin should configure live classroom rules without hardcoding.

Configurable items:

- Session types.
- Default durations.
- Capacity limits.
- Recording defaults.
- Retention periods.
- Child safety settings.
- Waiting room rules.
- Chat defaults.
- Breakout room rules.
- Attendance rules.
- Minimum participation.
- Event ticket types.
- Cancellation policies.
- Coaching rules.
- AI note settings.
- Transcript settings.
- Host permissions.
- Guest speaker permissions.
- Moderation policies.
- Session quality factors.
- Notification templates.

Configuration changes should be permission-protected and audited.

---

## 46. Conceptual Data Model

This chapter introduces conceptual entities only. SQL and physical schema design should come later.

### Session Entities

- `live_sessions`: Scheduled sessions.
- `live_session_types`: Configurable session type definitions.
- `live_session_hosts`: Host and co-host assignments.
- `live_session_participants`: Participant records.
- `live_session_registrations`: Registration records.
- `live_session_waitlists`: Waitlist entries.
- `live_session_access_rules`: Access and eligibility rules.
- `live_session_settings`: Session-specific classroom settings.

### Attendance and Interaction Entities

- `live_session_attendance`: Attendance summary records.
- `attendance_events`: Join, leave, reconnect, and participation events.
- `attendance_adjustments`: Manual corrections and appeals.
- `live_session_chat_messages`: Session chat records.
- `live_session_questions`: Structured Q&A.
- `live_session_polls`: Poll definitions.
- `live_session_poll_responses`: Poll responses.
- `breakout_rooms`: Breakout room definitions.
- `breakout_room_participants`: Breakout participation records.
- `session_resources`: Files and links shared during sessions.

### Recording and AI Entities

- `session_recordings`: Recording records.
- `recording_assets`: Audio, video, screen share, and derivative files.
- `recording_access_rules`: Replay permissions.
- `recording_consents`: Consent acknowledgements.
- `session_transcripts`: Transcript records.
- `session_captions`: Caption records.
- `session_ai_summaries`: AI-generated notes and summaries.

### Coaching, Events, Calendar, and Messaging Entities

- `coaching_services`: Coaching products.
- `coaching_slots`: Available coaching times.
- `coaching_bookings`: Booked coaching sessions.
- `office_hours`: Office hour definitions.
- `events`: Event records.
- `event_sessions`: Event session schedule.
- `event_tickets`: Ticket types.
- `event_registrations`: Event registration records.
- `session_moderation_reports`: Live safety reports.
- `live_session_incidents`: Reliability and safety incidents.
- `live_session_analytics`: Aggregated analytics.
- `session_quality_scores`: Explainable quality scores.
- `calendar_events`: Calendar records.
- `calendar_sync_connections`: Calendar integration settings.
- `messaging_threads`: Message thread records.
- `messaging_participants`: Thread participants.
- `messages`: Message records.
- `message_attachments`: Message file attachments.

### Boundaries

The model should define ownership, course and academy linkage, organization linkage, Solco identifiers, tenant isolation, recording privacy, child safety, financial access, and audit requirements.

---

## 47. MVP and Future Phasing

Solco integration should be delivered in phases.

### MVP

MVP should include:

- Schedule class.
- Join Solco room.
- Audio/video.
- Chat.
- Raise hand.
- Reactions.
- Screen share.
- Attendance.
- Recording reference.
- Session reminders.
- Basic AI notes.
- Course-linked sessions.
- Coaching booking.
- Mobile-responsive classroom.

### Phase 2

Phase 2 should include:

- Breakout rooms.
- Polls.
- Question queue.
- Advanced recordings.
- Transcript correction.
- Calendar sync.
- Recurring office hours.
- Event ticketing.
- Corporate live dashboards.

### Phase 3

Phase 3 should include:

- Whiteboard.
- Advanced audio for music.
- Dial-in.
- Real-time translation.
- Large conferences.
- Hybrid events.
- Advanced proctoring where lawful.
- AI chaptering.
- Mobile background audio.
- Custom enterprise deployment.

Do not block MVP on all future functionality.

---

## 48. Risks and Mitigations

### Risk: Solco Feels Like an External Link

Mitigation:

- Keep course context, waiting room branding, attendance, recordings, notes, resources, and follow-up tasks inside Solva Academy.

### Risk: Live Sessions Fail for Low-Bandwidth Learners

Mitigation:

- Provide audio-only mode, adaptive quality, reconnect handling, low-quality recording playback, and lightweight waiting room.

### Risk: Recording Privacy Issues

Mitigation:

- Require visible consent, access rules, retention settings, revocation, and audit logs.

### Risk: Child Safety Incidents

Mitigation:

- Parent approval, restricted chat, tutor verification, parent observation, no unsupervised breakouts by default, and escalation workflows.

### Risk: Attendance Disputes

Mitigation:

- Track detailed attendance events, allow corrections and appeals, preserve original records, and log reasons.

### Risk: Feature Scope Blocks Launch

Mitigation:

- Use the MVP, Phase 2, and Phase 3 roadmap. Launch the core live classroom first.

---

## 49. Acceptance Criteria

Chapter 7 should be considered satisfied when the blueprint supports:

- Solco as native live classroom, not a simple link.
- Clear Solva Academy and Solco integration boundaries.
- Configurable session types.
- Complete session creation model.
- Auditable status model.
- Unified calendar.
- Registration and access checks.
- Waiting room with consent and device tests.
- Responsive classroom interface.
- Host, co-host, assistant, and participant controls.
- Low-bandwidth experience.
- Attendance tracking, rules, and corrections.
- Recording architecture, consent, access, and post-processing.
- AI notes, captions, transcripts, polls, Q&A, chat, breakouts, and resources.
- Oral assessment, mock interview, music, dance, coaching, office hours, and event support.
- Messaging architecture.
- Child safety and corporate live training.
- Notifications, reliability, moderation, analytics, and session quality.
- Admin configuration.
- Conceptual data model without SQL.
- MVP and phased delivery.

---

## 50. Dependencies for Later Chapters

Later chapters should define:

- Solco API contracts and event webhooks.
- Authentication and signed join token flow.
- Recording storage and retention implementation.
- Real-time infrastructure requirements.
- Mobile app classroom behavior.
- Detailed accessibility testing.
- Child safety policy for live sessions.
- Enterprise attendance report formats.
- Payment and ticketing implementation.
- Incident response playbooks.
- QA plans for live sessions, reconnection, attendance, recording consent, and tenant isolation.

---

## 51. Final Recommendations

Solco should be treated as the live classroom, coaching, events, attendance, recording, and real-time collaboration engine of Solva Academy. It should remain a distinct Solva product, but learners, tutors, parents, and organizations should experience it as a native part of the academy journey.

The strongest product direction is:

- Keep learning context in Solva Academy.
- Let Solco provide real-time communication and artifacts.
- Prioritize mobile and low-data access.
- Make attendance and recordings transparent.
- Protect children by default.
- Support coaching, oral assessments, music, dance, corporate training, and events.
- Phase advanced features without blocking MVP.

Chapter 7 should guide Solva Academy and Solco toward a deeply integrated live learning experience that is practical, safe, accessible, auditable, and reusable across the wider Solva ecosystem.

