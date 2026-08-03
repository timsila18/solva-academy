# Solva Academy Master Product Blueprint

## Chapter 8: AI Architecture, AI Tutor, AI Mentor, AI Course Creator, AI Assessment Support, Career Guidance, Grounding, Safety, Cost Control, and Provider Abstraction

**Platform name:** Solva Academy  
**Repository / project name:** `solva-academy`  
**Production domain:** `academy.solvaone.co.ke`  
**Parent ecosystem:** SolvaOne / Solva Business Group  
**Main SolvaOne platform:** `solvaone.co.ke`  
**Chapter status:** Product and system blueprint only. No production code.

---

## 1. Executive Summary

AI in Solva Academy should be a governed assistance layer, not a decorative chatbot and not the entire value proposition. Chapters 1 through 7 define Solva Academy as a standalone learning ecosystem with academies, learners, instructors, enterprise workspaces, Solco live learning, certificates, practice labs, and practical Solva ecosystem integrations. Chapter 8 defines how AI supports these experiences while preserving human accountability, affordability, privacy, child safety, and platform independence from any single provider.

AI should strengthen human teaching, practical learning, accessibility, career development, enterprise training, learner support, course creation, moderation, analytics, and platform operations. It should not replace instructors, professional judgment, high-stakes grading, child safeguarding decisions, legal advice, medical advice, financial advice, institutional accountability, human moderation, or verified practical assessment.

The core principle is:

**AI assists, humans remain accountable.**

This chapter defines AI philosophy, provider abstraction, AI gateway architecture, context retrieval, retrieval-augmented generation, source trust levels, AI Tutor, AI Mentor, study planner, revision coach, practice partner, course creator, content transformation, feedback support, assessment boundaries, career and interview coaching, enterprise AI, Solco AI, moderation support, prompt management, structured outputs, privacy, prompt injection defense, tool permissions, cost management, usage ledger, quality evaluation, bias, child safety, high-stakes controls, transparency, admin controls, incident management, audit logs, availability, phasing, and conceptual data entities.

---

## 2. AI Philosophy

Solva Academy should treat AI as:

- A learning assistant.
- A tutor support tool.
- A study planner.
- A content creation assistant.
- A practice partner.
- A feedback assistant.
- A translation and accessibility tool.
- A career guidance assistant.
- A platform operations assistant.
- A discovery and recommendation assistant.

AI should not replace:

- Human instructors.
- Professional judgment.
- Final high-stakes grading.
- Child safeguarding decisions.
- Legal advice.
- Medical advice.
- Financial advice.
- Institutional accountability.
- Human mentorship.
- Human moderation.
- Verified practical assessment.

The platform must remain valuable even if AI models become widely available, cheaper, more capable, or interchangeable. Solva Academy's advantage is not merely "having AI"; it is using AI with course context, permissions, learning goals, practice labs, Solco sessions, instructor rules, and local Kenyan realities.

---

## 3. Value Beyond Generic AI

Solva Academy's AI should provide value that a generic public chatbot cannot easily replicate because it can safely understand platform-specific context.

### Contextual Understanding

With permission, AI should understand:

- Learner's enrolled courses.
- Current lesson.
- Course curriculum.
- Instructor-approved materials.
- Tutor teaching rules.
- Learner goals.
- Assessment history.
- Assignment feedback.
- Skills profile.
- Corporate assignments.
- Learning path.
- Upcoming Solco sessions.
- Practice lab history.
- Platform permissions.
- User age group.
- Preferred language.
- Accessibility preferences.
- Organization context where authorized.

### Permission-Aware Value

The AI should only use context the user is allowed to access. It should not blend private employer data, child records, academy drafts, or instructor-only materials into unauthorized responses.

---

## 4. AI Capability Families

Each AI capability must have defined purpose, allowed inputs, allowed outputs, user roles, safety rules, cost controls, audit requirements, human review requirements, and data access boundaries.

### Capability Families

1. Learner AI Tutor.
2. Learner AI Mentor.
3. AI Study Planner.
4. AI Revision Coach.
5. AI Practice Partner.
6. AI Course Creator.
7. AI Lesson Assistant.
8. AI Quiz Generator.
9. AI Assignment Generator.
10. AI Rubric Assistant.
11. AI Feedback Drafting.
12. AI Assessment Support.
13. AI Career Coach.
14. AI Interview Coach.
15. AI Skills Gap Assistant.
16. AI Corporate Learning Advisor.
17. AI Translation Assistant.
18. AI Captioning and Transcription.
19. AI Accessibility Assistant.
20. AI Search and Discovery.
21. AI Recommendation Engine.
22. AI Community Assistant.
23. AI Support Assistant.
24. AI Moderation Assistance.
25. AI Analytics Interpreter.
26. AI Solco Session Assistant.
27. AI Content Quality Assistant.
28. AI Compliance Update Assistant.
29. AI Course Maintenance Assistant.
30. AI Admin Assistant.

Capabilities should be enabled by role, tenant, feature plan, age group, and risk category.

---

## 5. Provider Abstraction

Solva Academy must not be built around one permanent AI provider.

### Supported Provider Types

Design an abstraction layer supporting:

- OpenAI.
- Anthropic.
- Google.
- Open-source models.
- Locally hosted models.
- Specialist transcription models.
- Specialist translation models.
- Specialist moderation models.
- Future African-language models.

### Routing Capabilities

The platform should support:

- Provider selection.
- Model selection.
- Fallback provider.
- Routing by use case.
- Routing by cost.
- Routing by latency.
- Routing by safety level.
- Routing by language.
- Routing by organization preference.
- Model deprecation handling.
- Version tracking.
- Prompt versioning.
- Output comparison.
- Provider outage fallback.

Provider-specific logic should stay inside the AI gateway and adapter layer, not scattered throughout the application.

---

## 6. AI Gateway

All AI features should use a centralized AI gateway rather than calling providers directly from the frontend.

### Gateway Responsibilities

The AI gateway should handle:

- Authentication.
- Permission checks.
- Model routing.
- Prompt assembly.
- Context retrieval.
- Safety filtering.
- Cost estimation.
- Token limits.
- Rate limits.
- Caching.
- Logging.
- Audit records.
- Response storage rules.
- PII redaction where appropriate.
- Error handling.
- Provider fallback.
- Output validation.
- Human review routing.

The gateway should be treated as a platform service boundary with clear contracts and observability.

---

## 7. Context Architecture

AI context should be structured, permission-aware, and minimized.

### Platform Context

Includes:

- Platform policies.
- General help content.
- Approved FAQs.
- Public feature documentation.

### Course Context

Includes:

- Curriculum.
- Lessons.
- Instructor notes.
- Resources.
- Assessment rules.
- Approved explanations.

### Learner Context

Includes:

- Current lesson.
- Progress.
- Goals.
- Weak areas.
- Preferred language.
- Accessibility needs.

### Academy Context

Includes:

- Academy policies.
- Teaching tone.
- Course catalogue.
- Instructor guidance.
- Community rules.

### Organization Context

Includes:

- Assigned courses.
- Internal policies.
- Department learning requirements.
- Authorized training material.

### Solco Context

Includes:

- Session agenda.
- Transcript.
- Notes.
- Questions.
- Follow-up assignments.

Context should be retrieved only when the user has permission and only when needed.

---

## 8. Retrieval-Augmented Generation

Retrieval-augmented generation should ground AI responses in approved sources.

### RAG Pipeline

Define:

- Document ingestion.
- Text extraction.
- Chunking.
- Metadata.
- Embeddings.
- Search.
- Reranking.
- Permission-aware retrieval.
- Course-version awareness.
- Source freshness.
- Source priority.
- Citation generation.
- Source revocation.
- Content reindexing.

### Source Priority for Course Questions

For course questions, prefer:

1. Current course version.
2. Instructor-approved resources.
3. Academy-approved references.
4. Platform-approved official sources.
5. General model knowledge only when necessary.

The AI should cite or identify sources where practical.

---

## 9. Source Trust

Source trust levels should guide retrieval, disclaimers, and high-stakes controls.

### Trust Levels

Create source trust levels such as:

- Official Regulatory Source.
- Platform Verified Source.
- Instructor Approved Source.
- Academy Approved Source.
- Organization Internal Source.
- Learner Uploaded Source.
- Community Source.
- General AI Knowledge.

AI should disclose when it relies on lower-trust or general knowledge. High-stakes topics should prioritize official and reviewed sources.

---

## 10. AI Tutor

The AI Tutor helps within a specific course or lesson.

### Capabilities

The AI Tutor can:

- Explain lesson content.
- Simplify concepts.
- Give examples.
- Compare ideas.
- Generate practice questions.
- Create flashcards.
- Summarize lesson.
- Translate explanation.
- Suggest revision.
- Identify relevant resources.
- Guide practice.
- Answer course FAQs.
- Escalate to tutor.

### Restrictions

The AI Tutor should not:

- Provide hidden quiz answers where prohibited.
- Complete graded assignments on behalf of learners.
- Claim to be the human instructor.
- Override course rules.
- Invent official requirements.
- Issue certificates.
- Change grades.
- Make safeguarding decisions.

---

## 11. AI Mentor

The AI Mentor operates across the learner journey.

### Capabilities

It can:

- Help set goals.
- Build study plan.
- Monitor deadlines.
- Recommend next action.
- Encourage progress.
- Identify missed learning.
- Suggest revision.
- Recommend tutor support.
- Suggest a learning path.
- Connect learning to careers or business outcomes.
- Support return after inactivity.

### Tone and Safety

The Mentor should remain supportive and not manipulative.

Avoid:

- Shame.
- Excessive pressure.
- False urgency.
- Fear-based retention.
- Emotional dependency.
- Pretending to be a human friend or therapist.

---

## 12. Study Planner

The AI Study Planner should produce realistic plans based on learner context.

### Inputs

Use:

- Available time.
- Course duration.
- Deadlines.
- Live session schedule.
- Assignment dates.
- Learner pace.
- Missed sessions.
- Preferred days.
- Rest periods.

### Capabilities

It can:

- Create schedule.
- Recalculate plan.
- Warn about overload.
- Prioritize deadlines.
- Break large tasks into steps.
- Add revision time.
- Suggest achievable weekly targets.
- Export to calendar future capability.

---

## 13. Revision Coach

The AI Revision Coach should help learners prepare without confusing practice with official assessment.

### Capabilities

It can:

- Generate revision plan.
- Create flashcards.
- Generate practice quizzes.
- Identify weak topics.
- Explain wrong answers.
- Suggest lesson review.
- Run oral revision.
- Create short revision sessions.
- Simulate examination questions.
- Produce topic summaries.

The system should distinguish practice, formative assessment, graded assessment, and official examination preparation.

---

## 14. Practice Partner

The AI Practice Partner should support skill rehearsal.

### Examples

HR:

- Simulate disciplinary hearing.
- Ask interview questions.
- Review payroll calculations.
- Present employee relations case.

Music:

- Suggest practice routine.
- Give theory questions.
- Review uploaded notes where supported.

Dance:

- Suggest practice sequence.
- Compare learner reflection to rubric.
- Prepare session goals.

Tutoring:

- Give mathematics practice.
- Explain errors.
- Adjust question difficulty.

Business:

- Challenge business assumptions.
- Review business plan sections.
- Simulate client questions.

Practice outputs should be clearly labelled as practice, not official evaluation.

---

## 15. Course Creator

The AI Course Creator helps instructors turn materials into structured courses.

### Inputs

Inputs may include:

- Notes.
- PDFs.
- PowerPoint slides.
- Word documents.
- Audio transcripts.
- Existing course outlines.
- Policy manuals.
- Training manuals.
- Recorded sessions.

### Draft Outputs

Outputs may include drafts of:

- Course title.
- Description.
- Target learner.
- Learning outcomes.
- Modules.
- Lessons.
- Activities.
- Quizzes.
- Assignments.
- Rubrics.
- Flashcards.
- Summaries.
- Promotional copy.
- Instructor notes.
- Course FAQs.

Everything must remain editable and unpublished until approved.

---

## 16. Content Transformation

AI should help transform content while preserving source traceability.

Support:

- Notes to course.
- Video transcript to lesson.
- Lesson to quiz.
- Lesson to summary.
- Lesson to flashcards.
- Course to revision guide.
- Course to audio summary.
- Course to Kiswahili draft.
- Live session to follow-up lesson.
- Policy document to training module.
- SOP to onboarding course.
- Job description to skills path.

Every generated artifact should link back to source material and prompt version.

---

## 17. Quiz and Assignment Generation

AI can draft quizzes, questions, assignments, and rubrics.

### Quiz Generation Inputs

Generate question drafts based on:

- Lesson.
- Module.
- Difficulty.
- Skill.
- Learning outcome.
- Question type.
- Age group.
- Language.

### Controls

Controls:

- Number of questions.
- Difficulty.
- Answer explanation.
- Distractor quality.
- Topic coverage.
- Prohibited topics.
- Randomization.
- Reviewer approval.

Generated questions should not automatically enter high-stakes exams.

### Assignment and Rubric Support

AI may draft:

- Assignment instructions.
- Project briefs.
- Case studies.
- Marking rubrics.
- Performance criteria.
- Sample responses.
- Feedback guidance.

The instructor remains responsible for accuracy, difficulty, fairness, relevance, publication, and final grading policy.

---

## 18. AI Feedback

AI may assist tutors by drafting feedback.

### Inputs

Feedback drafts may use:

- Learner submission.
- Rubric.
- Course content.
- Tutor notes.

### Tutor Controls

The tutor should be able to:

- Edit.
- Approve.
- Reject.
- Add audio feedback.
- Add personal guidance.

### Labelling

The system should label whether feedback was:

- Human authored.
- AI drafted and human approved.
- AI generated for practice only.

Do not falsely present AI feedback as direct tutor feedback.

---

## 19. Assessment Boundaries

AI assessment use should vary by stakes.

### Low-Stakes

AI may automatically score:

- Multiple choice.
- True/false.
- Matching.
- Basic short responses.
- Practice questions.

### Medium-Stakes

AI may assist but require review:

- Written assignments.
- Case studies.
- Audio submissions.
- Video reflections.
- Practical reports.

### High-Stakes

Require human or authorized assessor decision:

- Professional certification.
- Final practical demonstration.
- Oral examination.
- Child safeguarding-related assessment.
- Legal or medical competency.
- Employment selection decision.
- Certificate revocation.

---

## 20. Academic Integrity

Each course should define acceptable AI use.

### Integrity Controls

Support:

- AI-use policy per course.
- Allowed AI assistance.
- Prohibited AI assistance.
- Learner declaration.
- Citation guidance.
- Assignment originality review.
- Suspicious pattern detection.
- Human investigation.
- Appeal.

Do not assume AI-detection tools are conclusive. Avoid automatic punishment based only on AI detection.

---

## 21. Career Coach

The AI Career Coach should help learners plan careers without promising employment.

### Capabilities

It can help learners:

- Explore career paths.
- Identify skills gaps.
- Build learning roadmaps.
- Prepare CV through SolvaOne.
- Prepare cover letter.
- Improve LinkedIn profile.
- Practice interviews.
- Identify portfolio projects.
- Understand job requirements.
- Match learning to opportunities.
- Plan career progression.
- Prepare promotion discussions.

Recommendations should be explainable and permission-aware.

---

## 22. Interview Coach

The AI Interview Coach should support text, voice, and Solco practice.

### Capabilities

Support:

- Job role selection.
- Industry selection.
- Interview type.
- Question generation.
- Voice or text practice.
- Timed responses.
- Follow-up questions.
- Feedback.
- Confidence-building suggestions.
- Solco mock interview booking.
- CV context through SolvaOne with user permission.

Do not use protected characteristics in scoring.

---

## 23. Skills Gap Assistant

The AI Skills Gap Assistant should help learners and employers understand development needs.

### For Learners

It can:

- Compare goals to demonstrated skills.
- Recommend courses.
- Recommend practice.
- Suggest projects.

### For Employers

It can:

- Summarize aggregate skills gaps.
- Recommend learning plans.
- Identify training priorities.

Do not present inferred skill as verified competency.

---

## 24. Corporate Learning Advisor

The AI Corporate Learning Advisor should help authorized organization users build practical training systems.

Capabilities:

- Build onboarding programs.
- Select compliance courses.
- Create department learning paths.
- Suggest refresher cycles.
- Interpret completion reports.
- Identify low adoption.
- Draft reminders.
- Suggest Solva practice labs.

The AI must not claim that completion equals legal compliance.

---

## 25. Translation and Localization

AI translation should support Kenyan-first and Africa-ready learning while preserving meaning.

### Supported Translation

Support:

- English to Kiswahili.
- Kiswahili to English.
- Future local and African languages.
- Caption translation.
- Transcript translation.
- Lesson translation drafts.
- Interface assistance.
- Glossary preservation.

Translation workflows should support human review. Specialized terms should use instructor-approved glossaries.

---

## 26. Accessibility Assistant

AI can help make content more accessible, but it does not guarantee compliance by itself.

### Capabilities

Support:

- Simplify text.
- Produce audio summary.
- Create transcript.
- Create captions.
- Generate image descriptions draft.
- Reformat content.
- Explain complex language.
- Produce step-by-step version.
- Adjust reading level.
- Support screen-reader-friendly summaries.

Do not misrepresent accessibility compliance solely because AI generated alternatives.

---

## 27. Solco AI Assistant

AI should support live learning before, during, and after Solco sessions.

### Before Session

- Draft agenda.
- Generate poll.
- Prepare revision questions.
- Suggest breakout activities.

### During Session

- Live captions.
- Question grouping.
- Poll support.
- Note capture.
- Time reminders.
- Technical help assistant.

### After Session

- Summary.
- Action items.
- FAQ.
- Chapter markers.
- Follow-up assignment draft.
- Revision notes.
- Attendance summary.

Host review should be required before publishing sensitive summaries.

---

## 28. Search and Discovery

AI-powered search should understand natural-language intent.

### Example Queries

Examples:

- "I want to learn payroll from scratch."
- "Find affordable piano classes for an eight-year-old."
- "I need a short course for supervisors."
- "Show me a Kiswahili business course under KSh 1,000."

### Search Scope

The system should search:

- Courses.
- Academies.
- Tutors.
- Learning paths.
- Live classes.
- Resources.
- Marketplace products.
- Corporate packages.

Results should remain transparent and not be dominated only by paid promotion.

---

## 29. Recommendations

AI recommendations should support learner outcomes and institutional needs.

### Recommendation Inputs

Use:

- Goals.
- Interests.
- Progress.
- Skills gaps.
- Budget.
- Language.
- Age group.
- Employer assignment.
- Previous learning.
- Quality.
- Course relevance.
- Completion likelihood.

Paid or sponsored recommendations must be labelled. Revenue should not override relevance entirely.

---

## 30. Community Assistance

AI may help communities stay useful and manageable.

### Capabilities

AI may:

- Summarize long discussions.
- Identify unanswered questions.
- Suggest duplicate threads.
- Draft FAQ.
- Flag possible abuse.
- Route questions to tutor.
- Translate posts.
- Suggest community resources.

AI should not silently moderate sensitive disputes without human oversight.

---

## 31. Support Assistant

The AI Support Assistant should help users navigate platform issues.

### Capabilities

It may help with:

- Account access.
- Course navigation.
- Payments.
- Certificates.
- Solco joining.
- Instructor setup.
- Enterprise workspace guidance.
- Refund process explanation.
- Technical troubleshooting.

### Escalation

Escalate when:

- Financial action is required.
- Account ownership is disputed.
- Safety issue is reported.
- Legal complaint is raised.
- Human judgment is necessary.

---

## 32. Moderation Assistance

AI may assist moderation but should not become judge and jury.

### Detection Areas

AI may detect:

- Spam.
- Harassment.
- Hate speech.
- Fraud indicators.
- Unsafe child communication.
- Plagiarized marketplace descriptions.
- Suspicious reviews.
- Off-platform payment pressure.

AI flags should be reviewed proportionately. Do not automatically suspend users solely on ambiguous AI output.

---

## 33. Content Quality

AI can help instructors and reviewers identify course quality issues.

### Quality Checks

AI may identify:

- Missing learning outcomes.
- Weak assessment coverage.
- Poor lesson sequencing.
- Outdated references.
- Inconsistent terminology.
- Low-quality quiz distractors.
- Accessibility gaps.
- Missing captions.
- Overly long lessons.
- Mismatch between outcomes and assessments.

The AI should suggest, not silently rewrite published content.

---

## 34. Course Maintenance

AI can help maintain course freshness.

### Maintenance Signals

The system should help identify:

- Outdated course version.
- Broken link.
- Old tax or statutory rate.
- Expired policy reference.
- Course not reviewed recently.
- Low learner ratings.
- High drop-off.
- Repeated learner confusion.
- Assessment inconsistency.

For regulated subjects, trigger human review.

---

## 35. Regulatory Update Assistance

AI may assist with monitoring approved official sources for possible updates.

### Sensitive Areas

Areas include:

- Labour law.
- PAYE.
- SHIF.
- NSSF.
- Data protection.
- Financial compliance.

### Workflow

1. Change detected.
2. Source captured.
3. Affected course identified.
4. Reviewer notified.
5. Human review.
6. Course update drafted.
7. Course version approved.
8. Learners notified where necessary.

The system must not automatically rewrite or publish legal or compliance content.

---

## 36. Prompt Management

Prompts should be managed centrally, not scattered throughout frontend code.

### Prompt System

Support:

- Prompt templates.
- Prompt versions.
- Use-case tags.
- Model compatibility.
- Language variants.
- Academy-specific prompts.
- Organization-specific prompts.
- Safety instructions.
- Test cases.
- Approval status.
- Rollback.
- Performance comparison.

Prompt changes should be reviewed, versioned, and auditable for high-risk features.

---

## 37. Structured Outputs

Where possible, AI should return validated structured output.

### Structured Use Cases

Use schema validation for:

- Course outlines.
- Quizzes.
- Rubrics.
- Recommendations.
- Study plans.
- Skills analysis.
- Session summaries.
- Moderation flags.
- Support classifications.

Invalid output should be handled gracefully through retry, fallback, human review, or user-friendly error messages.

---

## 38. Conversation Storage

AI conversation storage should be transparent and configurable.

### Storage Policies

Define storage policies for:

- Learner tutor chats.
- Instructor AI Studio sessions.
- Career coaching chats.
- Support chats.
- Corporate AI interactions.
- Solco AI artifacts.

### User Transparency

Users should know:

- What is stored.
- Why it is stored.
- How long it is stored.
- Who can access it.
- Whether it is used for model improvement.
- How to delete it where applicable.

Do not use private course or organization content to train external models without appropriate agreements and consent.

---

## 39. Privacy and Data Minimization

The AI gateway should avoid sending unnecessary information.

### Controls

Use:

- PII redaction.
- Sensitive field exclusion.
- Minimum context.
- Permission-aware retrieval.
- Organization data isolation.
- Child data restrictions.
- Financial data restrictions.
- Health-related data restrictions.
- Prompt injection defense.
- Secret filtering.

AI features should follow least-context principles.

---

## 40. Prompt Injection Defense

Retrieved documents and user content must be treated as untrusted input.

### Threats

Protect against:

- Malicious uploaded documents.
- Instructions hidden in course materials.
- Learner attempts to override safety rules.
- Cross-tenant data extraction.
- System prompt disclosure attempts.
- Tool misuse.
- Unsafe URL retrieval.
- Data exfiltration.

### Separation

Separate:

- User instructions.
- Retrieved content.
- System policy.
- Tool permissions.

The gateway should sanitize inputs, restrict tools, and enforce tenant boundaries.

---

## 41. Tool Permissions

AI agents may use platform tools only with explicit permission.

### Possible Tools

Tools may include:

- Search course materials.
- Read learner progress.
- Create draft study plan.
- Create draft quiz.
- Schedule reminder.
- Recommend course.
- Draft message.
- Open SolvaOne tool.
- Book Solco coaching.
- Create support ticket.

### High-Risk Restrictions

High-risk actions should require user confirmation. AI should not independently:

- Make payments.
- Issue refunds.
- Change grades.
- Publish courses.
- Suspend accounts.
- Approve payouts.
- Revoke certificates.
- Access another tenant's data.

---

## 42. Cost Management

AI affordability is essential.

### Cost Controls

Support:

- Per-feature model routing.
- Token limits.
- Daily quotas.
- Monthly quotas.
- Free-tier limits.
- Premium AI allowances.
- Enterprise AI pools.
- Instructor AI credits.
- Caching.
- Response reuse.
- Smaller models for simple tasks.
- Batch processing.
- Summary compression.
- Context pruning.
- Rate limiting.
- Cost alerts.
- Budget caps.

AI costs should be visible to authorized administrators.

---

## 43. AI Pricing

AI pricing should balance affordability and sustainability.

### Possible Pricing Approaches

Support:

- Limited free AI tutor.
- Course-included AI allowance.
- Membership AI allowance.
- Pay-as-you-go AI credits.
- Instructor AI Studio credits.
- Academy AI package.
- Enterprise AI package.
- Sponsor-funded AI access.

Essential accessibility features should not become unaffordable.

---

## 44. Usage Ledger

The AI usage ledger should support cost attribution, abuse prevention, and operational analysis.

Track:

- User.
- Workspace.
- Feature.
- Model.
- Provider.
- Tokens or units.
- Estimated cost.
- Actual cost where available.
- Date.
- Course.
- Academy.
- Organization.
- Success or failure.
- Cached response.
- Safety flag.
- User feedback.

Do not expose internal provider details unnecessarily to ordinary users.

---

## 45. Rate Limits

Rate limits should protect cost, safety, and platform stability.

### Abuse Risks

Protect against:

- Automated scraping.
- Prompt flooding.
- Resource exhaustion.
- Account sharing abuse.
- AI credit fraud.
- Mass content generation spam.
- Cross-tenant probing.
- Unsafe content generation.
- Repeated policy evasion.

### Controls

Use:

- User limits.
- Workspace limits.
- Feature limits.
- IP/device signals where lawful.
- Cost ceilings.
- Anomaly detection.
- Manual review.
- Appeal process.

---

## 46. Quality Evaluation

AI features should be evaluated continuously.

### Evaluation Dimensions

Evaluate:

- Accuracy.
- Groundedness.
- Citation correctness.
- Helpfulness.
- Safety.
- Bias.
- Language quality.
- Latency.
- Cost.
- Escalation correctness.
- User satisfaction.
- Tutor satisfaction.
- Learning impact.

### Evaluation Sets

Create evaluation sets for:

- HR.
- Payroll.
- Labour law.
- Music.
- Dance.
- Academic tutoring.
- Business.
- Corporate training.
- Child learning.
- Kiswahili.

---

## 47. Feedback Loops

Users should provide direct feedback on AI outputs.

### Feedback Types

Support:

- Helpful/not helpful.
- Incorrect.
- Outdated.
- Unsafe.
- Too complex.
- Too simple.
- Missing source.
- Needs tutor review.

### Feedback Use

Feedback should feed:

- Prompt improvement.
- Course update.
- Source correction.
- Model routing.
- Safety review.
- Instructor notification.

---

## 48. Bias and Fairness

AI should be reviewed for unfair outcomes.

### Review Areas

Review AI for unfair outcomes related to:

- Gender.
- Disability.
- Age.
- County.
- School background.
- Language.
- Nationality.
- Employment status.
- Income.
- Device type.

Career and assessment tools must not make discriminatory decisions. Recommendations should be explainable.

---

## 49. Child Safety

Child AI features require stricter controls.

### Child Controls

Support:

- Parent visibility settings.
- Age-appropriate responses.
- Restricted topics.
- No emotional dependency design.
- No unrestricted private AI relationship.
- No solicitation of private contact information.
- Escalation for safety concerns.
- Tutor or parent review where appropriate.
- Limited conversation retention.
- Safe language.

The AI should never claim to be a child's human friend, teacher, parent, counselor, or guardian.

---

## 50. High-Stakes Controls

High-stakes topics require stronger controls.

### Topics

For:

- Legal.
- Health.
- Finance.
- Employment decisions.
- Child safety.
- Professional certification.
- Government compliance.

Require stronger:

- Source grounding.
- Disclaimers.
- Human review.
- Restricted outputs.
- Audit logging.
- Version control.
- Escalation.

---

## 51. Transparency

Users should know when and how AI is involved.

### Transparency Requirements

Users should know:

- When they are interacting with AI.
- When content was AI-generated.
- When content was human-reviewed.
- What sources were used.
- When information may be uncertain.
- When tutor review is recommended.

Avoid anthropomorphic deception.

---

## 52. Admin Console

Super Admin should manage AI centrally.

### Platform Controls

Super Admin should manage:

- Providers.
- Models.
- Routing rules.
- Feature availability.
- Quotas.
- Budgets.
- Prompt templates.
- Safety policies.
- Source trust levels.
- AI-enabled schools.
- AI-enabled courses.
- Age restrictions.
- High-stakes restrictions.
- Enterprise AI settings.
- Academy AI settings.
- Usage reports.
- Quality reports.
- Incident review.
- Model deprecation.
- Fallback rules.

Academy owners and enterprise admins should receive scoped controls.

---

## 53. Incident Management

AI incidents should have a clear operational workflow.

### Incident Types

Incidents may include:

- Unsafe response.
- Cross-tenant data leak.
- Incorrect high-stakes guidance.
- Harmful child response.
- Provider outage.
- Cost spike.
- Prompt injection.
- Hallucinated source.
- Biased recommendation.
- Unauthorized tool action.

### Workflow

1. Detect.
2. Contain.
3. Record.
4. Notify relevant team.
5. Disable affected feature if necessary.
6. Investigate.
7. Correct.
8. Review impact.
9. Communicate where required.
10. Prevent recurrence.

---

## 54. Audit Trail

AI audit logs should support safety, accountability, cost review, and incident investigation.

### Audit Events

Log:

- User request.
- Feature.
- Model/provider.
- Prompt version.
- Sources retrieved.
- Tool calls.
- Safety checks.
- Response status.
- Human review.
- Cost.
- Feedback.
- Incident linkage.

Avoid retaining sensitive raw content longer than necessary.

---

## 55. Availability and Failure Handling

Solva Academy must remain useful when AI is unavailable.

### Failure Behavior

When AI is unavailable:

- Course learning should continue.
- Videos and resources should remain available.
- Manual search should work.
- Tutors should still teach.
- Assessments should still function where not AI-dependent.
- Draft AI work should save.
- Users should see a clear message.
- The system should retry or use fallback provider where allowed.

Solva Academy must never become unusable because an AI provider is down.

---

## 56. MVP and Future Phasing

AI should be delivered in phases.

### MVP

MVP should include:

- Course-grounded AI Tutor.
- Lesson summaries.
- Practice questions.
- AI course outline drafts.
- Quiz draft generation.
- Transcript and caption support.
- Basic study planner.
- Support assistant.
- Usage limits.
- Provider abstraction.
- Logging and cost controls.

### Phase 2

Phase 2 should include:

- AI Mentor.
- Skills gap assistant.
- Career coach.
- Interview coach.
- AI feedback drafts.
- Translation.
- Solco summaries.
- Recommendation engine.
- Course quality assistant.
- Enterprise learning advisor.

### Phase 3

Phase 3 should include:

- Voice tutor.
- Advanced simulations.
- Local-language expansion.
- Advanced practice agents.
- AI-generated interactive labs.
- Proactive regulatory update detection.
- Multimodal music and dance feedback.
- Organization-specific private models.
- On-device AI for selected mobile use cases.

Do not block MVP on advanced AI.

---

## 57. Conceptual Data Model

This chapter introduces conceptual entities only. SQL and physical schema design should come later.

### Provider and Routing Entities

- `ai_providers`: Provider records.
- `ai_models`: Model records.
- `ai_model_capabilities`: Model capability definitions.
- `ai_routing_rules`: Use-case routing rules.
- `ai_feature_definitions`: AI feature catalogue.
- `ai_feature_settings`: Feature availability and configuration.

### Prompt and Context Entities

- `ai_prompt_templates`: Prompt templates.
- `ai_prompt_versions`: Versioned prompt records.
- `ai_context_sources`: Context source definitions.
- `ai_source_documents`: Indexed documents.
- `ai_document_chunks`: Chunked document content.
- `ai_embeddings`: Embedding references.
- `ai_retrieval_events`: Retrieval logs.
- `ai_source_trust_levels`: Source trust configuration.

### Conversation and Artifact Entities

- `ai_conversations`: Conversation sessions.
- `ai_messages`: AI and user messages.
- `ai_generated_artifacts`: Draft courses, quizzes, summaries, plans, and other AI outputs.
- `ai_tool_permissions`: Tool permission records.
- `ai_tool_calls`: Tool call audit records.

### Usage, Safety, Evaluation, and Settings Entities

- `ai_usage_ledger`: Usage and cost records.
- `ai_credit_balances`: AI credit balances.
- `ai_rate_limits`: Rate limit rules.
- `ai_safety_policies`: Safety policy definitions.
- `ai_safety_events`: Safety-related events.
- `ai_feedback`: User feedback on AI outputs.
- `ai_evaluation_sets`: Evaluation datasets.
- `ai_evaluation_runs`: Evaluation run records.
- `ai_quality_scores`: Quality metrics.
- `ai_incidents`: AI incidents.
- `ai_audit_logs`: Audit records.
- `ai_course_settings`: Course-level AI settings.
- `ai_academy_settings`: Academy-level AI settings.
- `ai_organization_settings`: Organization-level AI settings.
- `ai_learner_preferences`: Learner AI preferences.
- `ai_guardian_settings`: Parent or guardian AI controls.
- `ai_regulatory_change_alerts`: Regulatory update alerts.

### Boundaries

The model must define ownership, relationships, tenant separation, access rules, retention, cost attribution, auditability, versioning, and privacy boundaries.

---

## 58. Risks and Mitigations

### Risk: AI Becomes the Whole Product

Mitigation:

- Keep courses, instructors, Solco, practice labs, communities, certificates, and enterprise learning valuable without AI.

### Risk: One Provider Lock-In

Mitigation:

- Use provider abstraction, routing rules, prompt versioning, and fallback providers.

### Risk: Hallucinated High-Stakes Guidance

Mitigation:

- Use source grounding, disclaimers, human review, and restricted outputs for high-stakes topics.

### Risk: Cross-Tenant Data Leakage

Mitigation:

- Use permission-aware retrieval, tenant isolation, context minimization, and audit logs.

### Risk: AI Costs Become Unsustainable

Mitigation:

- Use quotas, caching, smaller models, context pruning, budgets, cost alerts, and usage ledgers.

### Risk: Child AI Safety Failure

Mitigation:

- Use age restrictions, parent controls, safe language, limited retention, and escalation.

### Risk: AI Bias in Career or Assessment Tools

Mitigation:

- Evaluate for fairness, avoid protected characteristics in scoring, and require human review for consequential decisions.

---

## 59. Acceptance Criteria

Chapter 8 should be considered satisfied when the blueprint supports:

- AI as assistance, not replacement.
- Value beyond generic chatbots through permission-aware context.
- Defined AI capability families.
- Provider abstraction and fallback routing.
- Central AI gateway.
- Context architecture and RAG.
- Source trust levels.
- AI Tutor, Mentor, Study Planner, Revision Coach, Practice Partner, Course Creator, and Career Coach.
- AI assessment boundaries and academic integrity rules.
- Translation, accessibility, Solco AI, search, recommendations, community, support, moderation, quality, maintenance, and regulatory assistance.
- Prompt management and structured outputs.
- Conversation storage transparency.
- Privacy and data minimization.
- Prompt injection defense.
- Tool permissions.
- Cost management, pricing, usage ledger, and rate limits.
- Quality evaluation and feedback loops.
- Bias, child safety, and high-stakes controls.
- Transparency, admin console, incident management, audit trail, failure handling, and phased delivery.
- Conceptual data model without SQL.

---

## 60. Dependencies for Later Chapters

Later chapters should define:

- Physical AI data schema and retention policies.
- Provider contracts and procurement.
- Detailed AI gateway API specification.
- RAG indexing pipeline implementation.
- AI evaluation datasets and testing harness.
- Prompt review workflow.
- Cost dashboards and billing integration.
- AI incident response playbooks.
- Child AI safety policy.
- Data protection impact assessment.
- Legal terms for AI-generated content.
- QA scenarios for AI safety, grounding, permissions, and failure handling.

---

## 61. Final Recommendations

Solva Academy should build AI as a modular, governed, transparent, affordable, course-grounded, permission-aware assistance layer. It should strengthen human teaching, practical learning, accessibility, career development, enterprise training, Solco live learning, and the wider Solva ecosystem.

The strongest direction is:

- Centralize AI through a gateway.
- Avoid provider lock-in.
- Ground course answers in approved materials.
- Keep humans accountable for high-stakes decisions.
- Make AI useful but not required for the platform to function.
- Protect children and sensitive data by default.
- Control cost aggressively.
- Label AI clearly.
- Evaluate quality continuously.
- Treat AI incidents as real operational events.

Chapter 8 should guide Solva Academy toward an AI architecture that remains valuable beyond the current AI era because it is connected to trusted learning context, human educators, practical labs, enterprise workflows, and learner outcomes.

