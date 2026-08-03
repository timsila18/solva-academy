# Solva Academy Master Product Blueprint

## Chapter 4: Student Experience, Personalized Learning, AI Mentor, Communities, Gamification, Retention, Accessibility, and Learner Success

**Platform name:** Solva Academy  
**Repository / project name:** `solva-academy`  
**Production domain:** `academy.solvaone.co.ke`  
**Parent ecosystem:** SolvaOne / Solva Business Group  
**Main SolvaOne platform:** `solvaone.co.ke`  
**Chapter status:** Product and system blueprint only. No production code.

---

## 1. Executive Summary

Solva Academy must treat learners as active people pursuing goals, not passive video viewers. Chapters 1, 2, and 3 defined the platform vision, identity model, academy and organization architecture, and flexible learning engine. Chapter 4 defines the complete learner experience: how people discover learning, choose goals, receive guidance, use AI safely, participate in communities, stay motivated, learn in low-data environments, access support, and continue growing after completion.

The learner journey should be:

**Discover -> Choose a Goal -> Enroll -> Learn -> Practice -> Receive Feedback -> Complete -> Prove Skill -> Apply Skill -> Continue Growing**

This chapter covers:

- Learner segments and tailored experiences.
- Guided onboarding without blocking discovery.
- Personalized learner dashboard.
- Learning goals and study planning.
- Contextual AI Mentor.
- AI grounding, safety, and tutor controls.
- Recommendations that prioritize relevance over sales.
- Meaningful progress tracking and skills passport.
- Humane gamification, streaks, badges, and leaderboards.
- Communities, discussions, messaging, and Solco live learning.
- Retention interventions that help without shaming.
- Notifications, accessibility, low-data support, and localization.
- Parent, child, corporate, sponsored, and scholarship learner experiences.
- Support, feedback, analytics, privacy, ethical personalization, and admin configuration.
- Conceptual data entities for later schema design.

The goal is a learner experience that feels personal, practical, affordable, safe, mobile-first, human-supported, and useful for children, professionals, employers, and lifelong learners across Kenya and Africa.

---

## 2. Learner Experience Philosophy

Solva Academy should always help learners answer:

- What am I learning?
- Why does it matter?
- What should I do next?
- How am I progressing?
- Where am I struggling?
- What outcome am I working toward?
- What opportunity becomes available after completion?

The platform should feel:

- Personal.
- Encouraging.
- Practical.
- Mobile-first.
- Affordable.
- Low-data friendly.
- Easy to navigate.
- Safe for children.
- Useful for professionals.
- Valuable for employers.
- Motivating without becoming childish.
- Human even when AI is involved.

Learning design should avoid overwhelming dashboards, empty gamification, manipulative urgency, and sales-first recommendations. Every experience should move the learner closer to a practical outcome.

---

## 3. Learner Segments

Solva Academy should personalize onboarding, recommendations, notifications, progress displays, and support by learner segment.

### Segment Overview

1. **Casual learner:** Wants flexible, low-pressure learning for curiosity or personal growth.
2. **Career seeker:** Needs job skills, CV support, interview readiness, certificates, and visible skills.
3. **Working professional:** Wants promotion, compliance, CPD-style growth, and practical workplace skills.
4. **Corporate employee:** Completes employer-assigned learning with deadlines and manager visibility.
5. **Entrepreneur:** Needs business plans, finance basics, marketing, operations, AI tools, and templates.
6. **Parent:** Manages child learning and may also learn personally.
7. **Child learner:** Needs safe, simple, age-appropriate learning with guardian oversight.
8. **Primary school learner:** Needs foundational lessons, guided practice, and parent-visible progress.
9. **Junior secondary learner:** Needs academic support, revision, motivation, and safe community.
10. **Senior secondary learner:** Needs exam preparation, career guidance, and study planning.
11. **College or university student:** Needs employability, professional skills, projects, and certificates.
12. **Tutor-in-training:** Needs teaching skills, course creation guidance, and instructor pathway support.
13. **Music learner:** Needs practice routines, level progression, live coaching, and performance feedback.
14. **Dance learner:** Needs video practice, routines, feedback, live sessions, and safe media submissions.
15. **HR learner:** Needs HR, payroll, labour law, compliance, practice labs, and verified credentials.
16. **Technology learner:** Needs structured skills, projects, labs, AI support, and portfolio evidence.
17. **Faith-based learner:** Needs ministry, leadership, counseling, administration, and community courses.
18. **Retiree learner:** Needs accessible pacing, personal growth, mentorship, and simple navigation.
19. **Sponsored learner:** Needs clear sponsor-funded access, requirements, and support contacts.
20. **Scholarship learner:** Needs eligibility visibility, deadlines, progress expectations, and impact tracking.

Personalization should adapt to these contexts while respecting privacy and user control.

---

## 4. Learner Onboarding

Onboarding should be guided but skippable. A learner should not be forced through a long questionnaire before course discovery.

### Suggested Flow

1. Welcome message.
2. Select learner goals.
3. Select interests.
4. Select preferred language.
5. Select skill level.
6. Select available learning time.
7. Select preferred learning format.
8. Select budget range.
9. Choose whether certificates matter.
10. Choose whether job or business outcomes matter.
11. Recommend courses and learning paths.
12. Let learner skip optional steps.

### Possible Goals

- Get a job.
- Earn a promotion.
- Start a business.
- Improve professional skills.
- Help my child learn.
- Prepare for an exam.
- Learn a creative skill.
- Learn for personal growth.
- Train my staff.
- Become an instructor.

### Onboarding Principles

- Ask only what is useful.
- Save progress.
- Allow "skip for now."
- Allow learners to update interests later.
- Avoid shaming budget limitations.
- Use answers for helpful recommendations, not manipulative sales targeting.

---

## 5. Personalized Dashboard

The learner dashboard should be dynamic and prioritized. It should show the most urgent and relevant actions first.

### Dashboard Components

The dashboard may include:

- Greeting.
- Continue Learning.
- Current learning path.
- Next lesson.
- Upcoming Solco live class.
- Assignments due.
- Recent results.
- Skills being developed.
- Weekly learning goal.
- Learning streak.
- Certificates earned.
- Recommended next course.
- Messages from tutors.
- Community activity.
- Saved courses.
- Downloaded lessons.
- Scholarship or sponsorship status.
- Job or opportunity suggestions where applicable.

### Priority Rules

The dashboard should prioritize:

- Overdue assignments.
- Live classes starting soon.
- Current course continuation.
- Goal deadlines.
- Corporate mandatory deadlines.
- Child learner approvals for parents.
- Scholarship requirements.
- Certificate eligibility.

The dashboard should avoid clutter by hiding low-priority widgets behind "See more" or personalized sections.

---

## 6. Learning Goals

Learners should be able to create practical goals tied to courses, learning paths, skills, deadlines, or life outcomes.

### Example Goals

- Complete Payroll Masterclass by 30 September.
- Practice piano three times per week.
- Finish KCSE Mathematics revision before exams.
- Earn HR Officer learning path certificate.
- Complete employee onboarding by deadline.
- Prepare for a job interview.
- Build a business plan.

### Goal Fields

Goals should support:

- Goal title.
- Target date.
- Weekly commitment.
- Learning path connection.
- Course connection.
- Reminder preference.
- Progress percentage.
- Milestones.
- Status.

### Goal Statuses

- Planned.
- Active.
- At Risk.
- Completed.
- Paused.
- Abandoned.

### Humane Goal Support

The system should detect unrealistic goals and help the learner adjust without shame. Suggested language should be encouraging: reduce weekly workload, extend target date, focus on essentials, or switch to a smaller milestone.

---

## 7. AI Mentor Architecture

The AI Mentor should be contextual, grounded, configurable, and supportive. It should help learners understand, practice, revise, and stay consistent without replacing human tutors.

### Context the AI Mentor Should Understand

The AI Mentor should understand:

- Learner's active course.
- Current lesson.
- Previous lessons.
- Course resources.
- Instructor-approved content.
- Learner progress.
- Quiz performance.
- Assignment feedback.
- Learning goals.
- Preferred language.
- Weak areas.
- Upcoming deadlines.

### AI Mentor Capabilities

The AI Mentor should help with:

- Explaining difficult ideas.
- Simplifying content.
- Giving examples.
- Translating explanations.
- Creating revision questions.
- Creating flashcards.
- Suggesting study plans.
- Reviewing learner answers.
- Preparing for assessments.
- Summarizing lessons.
- Suggesting practice activities.
- Encouraging consistent learning.
- Recommending the next learning step.

### Boundaries

The AI Mentor should not replace:

- Tutor judgment.
- Final grading where human review is required.
- Professional legal advice.
- Medical advice.
- Financial advice.
- Child safeguarding decisions.
- Human mentoring.

---

## 8. AI Grounding and Safety

AI answers should be grounded in approved learning material whenever possible.

### Grounding Sources

The AI Mentor should primarily answer from:

- Course content.
- Instructor resources.
- Approved platform resources.
- Approved templates.
- Official reference sources where integrated.
- Prior approved course explanations.

### Transparency Labels

The learner should be told when an answer is:

- Based on course materials.
- A general explanation.
- Uncertain.
- Requiring tutor review.
- Potentially outdated.

### Sensitive Categories

Sensitive subjects require stronger controls:

- Kenyan labour law.
- Payroll.
- PAYE.
- SHIF.
- NSSF.
- Health.
- Finance.
- Law.
- Child learning.

Controls should include disclaimers, source restrictions, instructor review, update mechanisms, and escalation to tutors where appropriate.

---

## 9. Tutor AI Controls

Tutors should configure AI behavior in their courses.

### Tutor Controls

Tutor controls should include:

- Enable or disable AI.
- Allow lesson explanations.
- Allow quiz practice.
- Allow assignment hints.
- Block direct answers before submission.
- Allow translation.
- Allow summaries.
- Allow flashcards.
- Allow revision planning.
- Restrict answers to course content.
- Add preferred teaching tone.
- Add prohibited topics.
- Require tutor escalation.
- Add approved FAQs.

AI should reflect the course and instructor's teaching intent without deceptively impersonating the instructor.

### Course FAQ Reuse

Tutors should be able to convert frequent questions into:

- Approved AI responses.
- Course FAQ entries.
- Lesson notes.
- Announcements.

---

## 10. Recommendation Engine

Recommendations should prioritize learning relevance over revenue.

### Recommendation Inputs

Recommendations may use:

- Learner goals.
- Previous courses.
- Skills.
- Course progress.
- Search history.
- Saved courses.
- Ratings.
- Budget.
- Age group.
- Preferred language.
- Employer assignments.
- Career interests.
- Weak areas.

### Recommendation Types

The platform should recommend:

- Continue learning.
- Recommended next lesson.
- Recommended next course.
- Recommended learning path.
- Recommended live class.
- Recommended practice lab.
- Recommended tutor.
- Recommended free resource.
- Recommended Solva tool.

### Ethical Ranking

Recommendations should explain why they appear. Paid promotions, featured courses, and sponsored placements should be labelled clearly and should not crowd out learning relevance.

---

## 11. Study Planner

The learner should be able to create a realistic study plan based on time, deadlines, and learning goals.

### Planner Inputs

Support:

- Weekly schedule.
- Preferred days.
- Preferred time.
- Available minutes.
- Course deadlines.
- Live class schedule.
- Revision periods.
- Assignment deadlines.
- Break days.
- Exam dates.

### Planner Behavior

The system should:

- Suggest a plan.
- Adjust missed sessions.
- Reschedule lessons.
- Detect overload.
- Prioritize deadlines.
- Encourage breaks.
- Sync with future calendar integrations.
- Send reminders.

The planner should support mobile-first quick edits because many learners will adjust plans on the go.

---

## 12. Progress Tracking

Progress should be more meaningful than a single percentage.

### Tracked Signals

Track:

- Lesson completion.
- Video watch progress.
- Audio listen progress.
- Quiz attempts.
- Assessment scores.
- Assignment completion.
- Tutor feedback.
- Practice lab completion.
- Live class attendance.
- Discussion participation.
- Skills demonstrated.
- Learning path milestones.
- Study time.
- Streaks.
- Goal progress.

### Progress Views

Show both:

- Course completion.
- Skill confidence.

Skill mastery should not be presented as absolute unless properly assessed. Use careful language such as introduced, practiced, demonstrated, or tutor-verified.

---

## 13. Skills Passport

The learner skill profile should evolve into a skills passport that connects learning activity to evidence.

### Skill Fields

Each skill should show:

- Skill name.
- Source course.
- Evidence.
- Assessment score.
- Practice lab result.
- Tutor verification.
- Date achieved.
- Current level.
- Expiry or renewal date where applicable.
- Visibility setting.

### Skill Levels

Skill levels may include:

- Introduced.
- Developing.
- Practiced.
- Demonstrated.
- Verified.
- Advanced.

### Privacy

Employers should only see skills the learner chooses to make visible, except for authorized corporate training records tied to that employer's workspace.

---

## 14. Gamification Philosophy

Gamification should motivate, not manipulate.

Use it to encourage:

- Consistency.
- Practice.
- Completion.
- Reflection.
- Community contribution.
- Skill improvement.

Avoid:

- Pressure-based shame.
- Excessive competition.
- Misleading scarcity.
- Punishing missed days.
- Child-targeted spending pressure.

Gamification should feel mature for professionals, gentle for children, and configurable for corporate settings.

---

## 15. Gamification Features

Gamification should be configurable by Super Admin and adjustable by age group, course type, academy, organization, or learner preference.

### Supported Features

Support configurable:

- XP.
- Levels.
- Badges.
- Learning streaks.
- Weekly goals.
- Monthly challenges.
- Course milestones.
- Academy milestones.
- Skill achievements.
- Community contributor badges.
- Attendance badges.
- Practice badges.
- Completion badges.
- Tutor recognition.
- Team challenges.
- Corporate completion campaigns.

### Admin Controls

Super Admin should configure:

- Badge rules.
- XP values.
- Streak rules.
- Leaderboard rules.
- Reward eligibility.
- Age restrictions.

---

## 16. Streaks and Leaderboards

Streaks and leaderboards can motivate learners, but they must be humane and privacy-aware.

### Learning Streaks

Support:

- Daily streak.
- Weekly consistency.
- Practice streak.
- Attendance streak.
- Goal streak.

Include:

- Streak freeze.
- Rest day.
- Recovery challenge.
- Pause for illness or travel.
- Child-friendly encouragement.
- No public shaming.

Reward return, not perfection.

### Leaderboards

Leaderboards may exist for:

- Course.
- Academy.
- School.
- Corporate team.
- Challenge.
- Community.
- Country or county where appropriate.

Privacy controls must allow users to:

- Join.
- Opt out.
- Use display name.
- Hide score.
- Hide location.

Avoid public ranking for sensitive, child, remedial, or corporate compliance learning unless explicitly enabled.

---

## 17. Communities

Communities should provide belonging, help, practice, and accountability.

### Community Types

Support:

- Course community.
- Academy community.
- School community.
- Learning path community.
- Corporate team community.
- Study group.
- Parent community.
- Instructor community.
- Alumni community.

### Community Features

Support:

- Posts.
- Comments.
- Reactions.
- Questions.
- Announcements.
- Polls.
- Resources.
- Pinned posts.
- Events.
- Challenges.
- Study groups.
- Solco discussion rooms.
- Reporting.
- Moderation.

Communities should respect tenant, child safety, academy, and organization boundaries.

---

## 18. Discussions

Discussions should connect learning content with human support.

### Discussion Features

Discussions should allow:

- Lesson-linked questions.
- Course Q&A.
- Tutor answers.
- Peer answers.
- Accepted answer.
- Upvotes.
- Helpful marking.
- Attachments.
- Audio questions.
- Image questions.
- Threading.
- Search.
- Tags.

### Knowledge Reuse

Tutors should be able to convert frequently asked questions into:

- Course FAQ.
- Lesson note.
- AI-approved response.
- Announcement.

Moderators should be able to close, merge, hide, or escalate discussions when needed.

---

## 19. Messaging

Messaging should be controlled, contextual, and safe.

### Supported Communication

Support controlled communication between:

- Learner and tutor.
- Learner and academy support.
- Learner and corporate manager.
- Parent and tutor.
- Academy team members.
- Learner study groups.

### Messaging Features

Messaging should support:

- Text.
- File attachments.
- Voice notes where allowed.
- Course context.
- Response status.
- Reporting.
- Blocking.
- Office hours.
- Automated replies.
- Escalation to support.

Child accounts should not have unrestricted private messaging.

---

## 20. Solco Learner Experience

Solco should make live learning feel seamless inside Solva Academy.

### Before and During Class

Learners should be able to:

- Join live class.
- See upcoming sessions.
- Receive reminders.
- Enter waiting room.
- Raise hand.
- Use class chat.
- Answer polls.
- Join breakout room.
- Share screen where allowed.
- Access live captions.
- View attendance status.
- Access recording.
- Access class notes.
- Ask follow-up questions.
- Download approved resources.

### After Class

After the class, the course should automatically show:

- Attendance.
- Recording.
- AI summary.
- Tutor notes.
- Assignments.
- Poll results where appropriate.
- Next class.

Solco records should feed progress tracking and attendance-based certificate rules where appropriate.

---

## 21. Retention Engine

The retention engine should detect disengagement and offer supportive interventions.

### Risk Signals

Signals:

- No login.
- Missed live classes.
- Low lesson completion.
- Failed assessments.
- Overdue assignments.
- Reduced activity.
- Repeated course abandonment.

### Interventions

Support:

- Gentle reminder.
- AI study plan adjustment.
- Tutor message.
- Academy support message.
- Parent notification.
- Corporate manager notification.
- Recommended easier lesson.
- Revision activity.
- Pause option.
- Course switch suggestion.

Interventions should not use shame or manipulation. The platform should help learners recover momentum.

---

## 22. Notifications

Notifications should be useful, controllable, and channel-aware.

### Channels

Notification channels:

- In-app.
- Email.
- SMS.
- WhatsApp-ready future support.
- Push notifications.
- Calendar reminders.

### Notification Types

Notification types:

- Course reminder.
- Assignment due.
- Live class starting.
- Tutor reply.
- Assessment result.
- Certificate ready.
- Goal update.
- Streak reminder.
- New course recommendation.
- Scholarship update.
- Payment notice.
- Corporate deadline.
- Child progress update.

Users should control frequency and channel. Critical corporate or safeguarding notifications may have limited opt-out depending on policy.

---

## 23. Accessibility

Solva Academy should design for learners with different needs, devices, literacy levels, and contexts.

### Accessibility Features

Support:

- Keyboard navigation.
- Screen reader labels.
- Captions.
- Transcripts.
- Audio descriptions future support.
- Adjustable text size.
- High contrast options.
- Reduced motion.
- Dyslexia-friendly display option.
- Playback speed.
- Pause and resume.
- Alternative text.
- Downloadable notes.
- Audio lesson alternatives.
- Language support.
- Clear error messages.

Accessibility preferences should be saved per user.

### Design Requirements

Learning pages should use clear hierarchy, predictable navigation, readable text, and accessible form errors. Mobile accessibility is essential.

---

## 24. Low-Data and Offline Learning

Low-data design is a Kenyan-first requirement, not a nice-to-have.

### Low-Data Features

Support:

- Low-resolution video option.
- Audio-only mode.
- Download lesson for offline future app support.
- Compressed images.
- Text transcript alternative.
- Resume downloads.
- Avoid unnecessary autoplay.
- Data usage estimate.
- Wi-Fi-only download setting.
- Lightweight learner dashboard.
- Cached progress synchronization.

### Future Offline App

Future mobile apps should support offline lesson access with:

- Encrypted local storage where needed.
- Expiring access rules.
- Progress sync after reconnecting.
- Download quality selection.
- Storage management.

---

## 25. Language and Localization

Solva Academy should launch Kenyan-first and remain Africa-ready.

### Supported Languages

Support:

- English.
- Kiswahili.
- Future Kenyan languages.
- Future African languages.

### Localization Areas

Localization should include:

- Interface text.
- Captions.
- Transcripts.
- Course language.
- AI explanations.
- Dates.
- Currency.
- Time zones.
- Local examples.

### Course Language Options

Instructors may publish:

- Original-language course.
- Translated version.
- Subtitled version.
- Bilingual course.

Language settings should influence recommendations and AI Mentor responses.

---

## 26. Parent Experience

Parents should have a dashboard for managing child learning safely and practically.

### Parent Dashboard

Parents should see:

- Child courses.
- Progress.
- Assignments.
- Tutor messages.
- Upcoming live classes.
- Attendance.
- Certificates.
- Practice activity.
- Payment history.
- Learning goals.
- Safety controls.

### Parent Actions

Parents should be able to:

- Approve enrollments.
- Approve live classes.
- Manage notifications.
- View appropriate feedback.
- Report concerns.
- Pause or cancel access.
- Manage sibling profiles.

Parent experience should clearly separate the parent's own learning from child management.

---

## 27. Child Learner Experience

The child learner interface should be simple, visual, age-appropriate, and safe.

### Child Interface Principles

Child interface should be:

- Simple.
- Visual.
- Age-appropriate.
- Safe.
- Encouraging.
- Free from public personal details.
- Free from unrestricted direct messages.
- Clear about parent involvement.

### Child Features

Support:

- Parent-controlled profile.
- Safe avatar.
- Simplified navigation.
- Large action buttons.
- Tutor-approved community participation.
- Restricted uploads.
- Age-appropriate rewards.

Child learning should use stricter content review, messaging limits, and live class controls.

---

## 28. Corporate Learner Experience

Corporate learners need clarity on required learning, deadlines, and privacy boundaries.

### Corporate Learner Dashboard

Corporate learners should see:

- Assigned courses.
- Mandatory courses.
- Deadlines.
- Compliance status.
- Manager messages.
- Department learning path.
- Internal resources.
- Solco sessions.
- Certificates.
- Personal learning courses separate from corporate courses.

### Privacy Separation

Clearly separate:

- Employer-visible activity.
- Private personal learning.

Employers should see only authorized corporate learning records unless the learner chooses to share additional skills or certificates.

---

## 29. Sponsored Learning

Sponsored and scholarship learners should understand what is covered, expected, and reported.

### Learner View

Sponsored learners should see:

- Sponsor name where appropriate.
- Covered courses.
- Access period.
- Requirements.
- Progress expectations.
- Support contact.
- Completion status.

### Sponsor Reporting

Sponsors may receive:

- Aggregated impact reports.
- Completion data.
- Participation data.

Do not expose unnecessary private learner information.

---

## 30. Learning Support

Learner support should be easy to find and organized by issue type.

### Support Categories

Create learner support categories:

- Technical support.
- Course support.
- Payment support.
- Tutor support.
- Certificate support.
- Accessibility support.
- Child safety support.
- Corporate learning support.
- Refund support.

### Support Options

Support options:

- Help centre.
- Search.
- AI help assistant.
- Support ticket.
- Live support future.
- Academy support.
- Platform support.

Support cases should route to academy support, platform support, or specialized safety teams depending on issue type.

---

## 31. Learner Feedback

Feedback should be collected at useful moments without interrupting learning too frequently.

### Feedback Points

Collect feedback:

- After lesson.
- After module.
- After live class.
- After assignment.
- After course.
- After support request.
- After certificate.
- After practice lab.

### Feedback Measures

Feedback should measure:

- Content quality.
- Tutor quality.
- Difficulty.
- Practical value.
- Technical quality.
- AI usefulness.
- Confidence improvement.
- Likelihood to recommend.

Feedback should feed course quality, tutor improvement, academy analytics, and platform prioritization.

---

## 32. Learner Success Analytics

Learner success analytics should help learners, tutors, academies, organizations, and the platform improve outcomes.

### Metrics

Track:

- Enrollment-to-start rate.
- Start-to-completion rate.
- Course completion.
- Time to completion.
- Assessment performance.
- Assignment completion.
- Live attendance.
- AI Mentor engagement.
- Community participation.
- Repeat enrollment.
- Skill verification.
- Certificate sharing.
- Job or business outcomes where voluntarily reported.
- Corporate compliance completion.

### Analytics Views

Analytics should support:

- Platform view.
- Academy view.
- Course view.
- Tutor view.
- Corporate view.
- Learner view.

Analytics must respect privacy, child safety, and corporate data boundaries.

---

## 33. Privacy and Ethical Personalization

Personalization should be transparent and controllable.

### User Transparency

Users should know:

- Why a course is recommended.
- What data is used.
- How to adjust interests.
- How to disable some personalization.
- How to clear recommendation history where appropriate.

### Ethical Rules

Do not use sensitive personal information for commercial targeting without clear lawful basis and consent.

Personalization should support learning outcomes first. Revenue optimization must not override learner relevance, affordability, safety, or trust.

---

## 34. Admin Configuration

Super Admin should configure learner experience features without code changes where practical.

### Configurable Items

Super Admin should configure:

- Onboarding questions.
- Goal types.
- Recommendation rules.
- AI Mentor defaults.
- Gamification.
- XP values.
- Badge rules.
- Streak rules.
- Notification templates.
- Community types.
- Moderation rules.
- Accessibility settings.
- Supported languages.
- Low-data defaults.
- Parent controls.
- Child interface rules.
- Corporate learner visibility.
- Retention interventions.
- Feedback forms.

Configuration changes should be permission-protected, validated, and audited.

---

## 35. Conceptual Data Model

This chapter introduces conceptual entities only. SQL and physical schema design should come later.

### Learner Personalization Entities

- `learner_profiles`: Learner-specific experience settings and segment data.
- `learner_interests`: Selected interests, goals, and recommendation signals.
- `learner_goals`: Learning goals and progress.
- `study_plans`: Study plan headers.
- `study_plan_sessions`: Scheduled study blocks and completion.
- `learner_recommendations`: Recommendation records and reasons.

### Skills and AI Entities

- `learner_skills`: Skills associated with learners.
- `skill_evidence`: Evidence supporting skill levels.
- `ai_mentor_sessions`: AI Mentor conversation contexts.
- `ai_mentor_messages`: Messages exchanged with AI Mentor.
- `ai_mentor_feedback`: Learner feedback on AI usefulness and safety.

### Gamification Entities

- `gamification_rules`: XP, badge, streak, and challenge settings.
- `xp_transactions`: XP earned or adjusted.
- `badges`: Badge definitions.
- `badge_awards`: Badges granted to users.
- `streaks`: Streak tracking.
- `challenges`: Challenge definitions.
- `challenge_participants`: Learner participation in challenges.
- `leaderboards`: Leaderboard definitions and visibility rules.

### Community and Messaging Entities

- `communities`: Community spaces.
- `community_members`: Community membership and roles.
- `community_posts`: Posts.
- `comments`: Comments and replies.
- `reactions`: Likes, helpful marks, and other reactions.
- `discussions`: Course or lesson-linked discussions.
- `messages`: Controlled messaging records.

### Notification, Support, Feedback, and Access Entities

- `notifications`: Notification records.
- `notification_preferences`: User channel and frequency settings.
- `learner_support_tickets`: Support requests.
- `learner_feedback`: Feedback at lesson, course, live class, lab, and support moments.
- `accessibility_preferences`: User accessibility settings.
- `parent_child_links`: Guardian-child relationships.
- `sponsorships`: Sponsorship programs.
- `scholarship_awards`: Scholarship assignments and status.
- `learner_success_events`: Analytics events for learner success.

### Privacy Boundaries

Relationships should enforce:

- Parent access only to linked child learner records.
- Employer access only to authorized corporate training data.
- Academy access only to relevant learner activity in that academy.
- Learner control over public skill and certificate visibility.
- AI Mentor access limited to permitted learning context.
- Child records protected by stricter defaults.

---

## 36. Risks and Mitigations

### Risk: Generic Student Dashboard

A generic dashboard may show many widgets but fail to guide action.

Mitigation:

- Prioritize next best action.
- Personalize by segment and goal.
- Keep urgent items visible.
- Avoid clutter.

### Risk: AI Overreach

Learners may treat AI responses as final authority.

Mitigation:

- Ground AI in approved materials.
- Label uncertainty.
- Escalate to tutors.
- Restrict sensitive categories.
- Keep human grading where required.

### Risk: Manipulative Gamification

Gamification can shame learners or push unhealthy behavior.

Mitigation:

- Reward return, not perfection.
- Allow rest days and opt-outs.
- Avoid public ranking by default in sensitive contexts.
- Configure age restrictions.

### Risk: Privacy Leakage

Personalization, employer visibility, communities, and skills profiles may expose too much.

Mitigation:

- Strong privacy defaults.
- Clear visibility settings.
- Separate corporate and personal learning.
- Strict child profile protections.
- Audit sensitive access.

### Risk: Notification Fatigue

Too many notifications can make learners ignore important messages.

Mitigation:

- Let users control frequency and channels.
- Prioritize urgent notifications.
- Bundle low-priority updates.
- Keep critical safeguards distinct.

### Risk: Low-Data Learners Are Excluded

Heavy media experiences may fail for learners with limited data.

Mitigation:

- Low-resolution video.
- Audio-only mode.
- Transcripts.
- Lightweight dashboard.
- Offline-ready mobile architecture.

---

## 37. Acceptance Criteria

Chapter 4 should be considered satisfied when the blueprint supports:

- A learner journey from discovery to continued growth.
- Tailored learner segments.
- Skippable onboarding.
- Personalized dashboard.
- Learning goals and humane goal reset.
- Contextual AI Mentor with clear boundaries.
- AI grounding, safety, and tutor controls.
- Learning-first recommendations.
- Study planner.
- Progress tracking beyond percentages.
- Skills passport with evidence and privacy controls.
- Humane gamification, streaks, badges, and leaderboards.
- Communities, discussions, and controlled messaging.
- Solco learner experience before, during, and after class.
- Retention interventions without shame.
- User-controlled notifications.
- Accessibility preferences.
- Low-data and offline readiness.
- Language and localization readiness.
- Parent, child, corporate, sponsored, and scholarship learner experiences.
- Learner support and feedback.
- Learner success analytics.
- Ethical personalization.
- Admin-configurable learner experience settings.
- Conceptual data model without SQL.

---

## 38. Dependencies for Later Chapters

Later chapters should define:

- Detailed notification templates and delivery rules.
- AI Mentor technical architecture and provider strategy.
- Community moderation workflows.
- Solco live classroom integration details.
- Mobile app offline storage and sync rules.
- Analytics dashboards and event schemas.
- Parent-child safety policy.
- Sponsorship and scholarship reporting rules.
- Employer opportunity and learner consent workflows.
- UI wireframes for dashboards, learning pages, community, and AI Mentor.
- QA scenarios for accessibility, child safety, privacy, and recommendation correctness.

---

## 39. Final Recommendations

Solva Academy should make the learner experience feel guided, practical, and human. The strongest product direction is to treat every learner as someone working toward a real goal, whether that goal is passing an exam, helping a child, getting a job, learning music, completing corporate training, building a business, or growing personally.

The platform should:

- Personalize without becoming invasive.
- Use AI as a mentor, not a replacement for tutors.
- Motivate without shame.
- Support low-data and mobile-first learning.
- Protect children by design.
- Separate corporate visibility from personal privacy.
- Help learners show verified skills through evidence.
- Keep communities supportive and moderated.
- Make progress visible, meaningful, and tied to outcomes.

Chapter 4 should guide Solva Academy toward a learner experience that is affordable, accessible, AI-assisted, ethically personalized, and strong enough to serve children, professionals, corporate teams, scholarship learners, and lifelong learners across Kenya and Africa.

