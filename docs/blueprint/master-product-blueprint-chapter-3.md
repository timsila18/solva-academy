# Solva Academy Master Product Blueprint

## Chapter 3: Course Builder, Curriculum Engine, Lessons, Assessments, Assignments, Practice Labs, Certificates, and Learning Products

**Platform name:** Solva Academy  
**Repository / project name:** `solva-academy`  
**Production domain:** `academy.solvaone.co.ke`  
**Parent ecosystem:** SolvaOne / Solva Business Group  
**Main SolvaOne platform:** `solvaone.co.ke`  
**Chapter status:** Product and system blueprint only. No production code.

---

## 1. Executive Summary

Solva Academy must not be built as a basic video library or a simple course upload system. It should be a flexible learning engine for Kenya and Africa, designed to support self-paced learning, live Solco classes, hybrid programs, children’s learning, corporate training, AI-assisted course creation, practice labs, verified credentials, educational marketplace products, and long-term Solva ecosystem integration.

Chapters 1 and 2 established Solva Academy as a standalone national-scale education, skills, employment, and instructor monetization platform with multi-role identity, academies, organizations, schools, configurable permissions, and multi-tenant security. Chapter 3 defines the core learning architecture that will turn that platform foundation into real learner outcomes.

Every learning experience should move learners through this journey:

**Discover -> Enroll -> Learn -> Practice -> Get Feedback -> Demonstrate Skill -> Earn Credential -> Apply Skill -> Access Opportunity**

This means courses should not stop at passive content consumption. The platform must support structured curriculum, practical work, feedback, assessment, skills evidence, certification, and future pathways to employment, entrepreneurship, internal promotion, or community impact.

Chapter 3 defines:

- Learning product types.
- Course creation workflow.
- Course statuses and metadata.
- Curriculum hierarchy and release rules.
- Lesson types.
- Video, audio, and low-data learning.
- Resource libraries.
- Assessments, quizzes, assignments, projects, and rubrics.
- Practice labs connected to Solva products.
- Learning paths.
- Certificates and public credential verification.
- Pricing models and access rules.
- Reviews, ratings, quality review, and versioning.
- AI support for course creation.
- Child and corporate learning requirements.
- Marketplace educational products.
- Search, discovery, enrollment, and progress tracking.
- Conceptual data entities for future schema work.
- Admin configuration requirements, risks, acceptance criteria, and later dependencies.

The outcome should be a learning engine that product designers, frontend developers, backend developers, database engineers, AI engineers, QA engineers, and future mobile app developers can use as a shared reference.

---

## 2. Learning Philosophy

Solva Academy’s learning philosophy should be outcome-first. The platform should help learners move from interest to capability, not merely from payment to video access.

### Core Journey

Every meaningful learning product should support some version of this journey:

1. Discover a relevant learning opportunity.
2. Enroll through a suitable access model.
3. Learn through content, live teaching, resources, and guidance.
4. Practice through assignments, labs, simulations, exercises, or projects.
5. Get feedback from tutors, peers, parents, managers, reviewers, or AI assistance.
6. Demonstrate skill through assessments, projects, live demonstrations, or practical outputs.
7. Earn a credential where appropriate.
8. Apply the skill in school, work, entrepreneurship, community service, or personal growth.
9. Access future opportunities through certificates, skills profiles, employer verification, scholarships, jobs, gigs, or further learning paths.

### Supported Learning Modes

The platform should support:

- Self-paced courses.
- Live Solco classes.
- Hybrid courses.
- Cohort-based programs.
- Micro-courses.
- Professional certificates.
- Children’s lessons.
- Corporate training.
- Practice labs.
- Assignments.
- Projects.
- Assessments.
- Verified certificates.
- Learning paths.
- Marketplace educational products.

### Design Principle

The course engine should be configurable enough to serve many domains: HR, payroll, business, music, dance, academic tutoring, AI, technology, hospitality, faith and ministry, agriculture, finance, public service, and future schools.

---

## 3. Learning Product Types

Learning product types should be configurable by Super Admin. They should not be hardcoded as fixed business rules.

### Initial Product Types

The platform should support at least:

1. Free lesson.
2. Short course.
3. Full course.
4. Micro-course.
5. Masterclass.
6. Workshop.
7. Bootcamp.
8. Cohort program.
9. Live class series.
10. One-on-one coaching.
11. Group coaching.
12. Corporate training program.
13. Internal organization training.
14. Children’s program.
15. School holiday program.
16. Exam revision program.
17. Professional certificate.
18. Skill badge.
19. Learning path.
20. Bundle.
21. Membership-only course.
22. Downloadable resource.
23. Template pack.
24. Practice lab.
25. Challenge or competition.
26. Webinar.
27. CPD-style program.
28. Mentorship program.

### Product Type Configuration

Each product type should define configurable rules:

- Display name.
- Description.
- Allowed delivery modes.
- Whether curriculum is required.
- Whether live sessions are allowed.
- Whether assessments are required.
- Whether certificates are available.
- Whether pricing is allowed.
- Whether enrollment requires approval.
- Whether age-group restrictions apply.
- Whether parent approval is required.
- Whether corporate assignment is supported.
- Whether marketplace download rules apply.
- Review requirements.
- Default access period.
- Default completion rules.

This allows the platform to expand without engineering new product logic for every new learning format.

---

## 4. Course Creation Workflow

Course creation should be a guided, saveable workflow. Instructors and academy owners should be able to build gradually, save drafts, collaborate with staff, and submit for review when ready.

### Suggested Workflow

1. Tutor clicks "Create Course."
2. Select academy.
3. Select school, category, and subcategory.
4. Select learning product type.
5. Enter course title.
6. Enter subtitle.
7. Add description.
8. Define target learners.
9. Define learning outcomes.
10. Define prerequisites.
11. Select level.
12. Select language.
13. Select age group.
14. Select delivery mode.
15. Add course thumbnail.
16. Add promotional video.
17. Add curriculum.
18. Add pricing.
19. Add certificate setting.
20. Add assignments and assessments.
21. Add live class schedule if applicable.
22. Add resources.
23. Add AI tutor settings.
24. Submit for review.
25. Reviewer approves, requests changes, or rejects.
26. Course is published.

### Draft Support

The system must support:

- Save draft.
- Autosave where practical.
- Completion checklist.
- Missing-field warnings.
- Preview as learner.
- Preview as reviewer.
- Internal academy review before platform review.
- Version notes.
- Review comments.
- Resubmission after changes.

### Collaboration

Academy teams should be able to collaborate according to permissions:

- Owner approves submission.
- Content manager edits lessons.
- Tutor adds teaching material.
- Reviewer comments.
- Finance manager reviews pricing where allowed.
- Child safety reviewer checks child-facing courses.

---

## 5. Course Status Model

Course status should describe both production state and access state. Every status change must be logged.

### Course Statuses

Initial statuses:

- Draft.
- Incomplete.
- Ready for Review.
- Under Review.
- Changes Requested.
- Approved.
- Scheduled.
- Published.
- Unlisted.
- Private.
- Invite Only.
- Enrollment Closed.
- Archived.
- Suspended.
- Retired.

### Status Rules

The system should define:

- Who can move a course between statuses.
- Which required fields are needed for each status.
- Whether learners can enroll.
- Whether existing learners retain access.
- Whether certificates can still be issued.
- Whether the course appears in search.
- Whether reviews remain visible.
- Whether changes create a new version.

### Audit Requirements

Every status change should log:

- Actor.
- Previous status.
- New status.
- Date and time.
- Reason.
- Workspace.
- Course version.
- Review request where applicable.

---

## 6. Course Metadata

Course metadata should support discovery, access control, quality review, pricing, credentials, analytics, and future mobile experiences.

### Required and Optional Metadata

Each course should support:

- Title.
- Slug.
- Subtitle.
- Description.
- Academy.
- Instructor or instructors.
- School.
- Category.
- Subcategory.
- Tags.
- Skills taught.
- Level.
- Age group.
- Language.
- Duration.
- Delivery mode.
- Learning product type.
- Enrollment type.
- Price.
- Discount eligibility.
- Certificate availability.
- Assessment requirement.
- Course requirements.
- Course outcomes.
- Thumbnail.
- Trailer video.
- Intro video.
- SEO title.
- SEO description.
- Visibility.
- Rating.
- Review count.
- Student count.
- Completion rate.
- Last updated date.
- Version number.

### Metadata Governance

Super Admin should configure:

- Required fields by product type.
- Required fields by school or category.
- Allowed levels.
- Allowed languages.
- Allowed age groups.
- Allowed delivery modes.
- Review rules by risk category.

---

## 7. Curriculum Engine

The curriculum engine must support flexible hierarchy. It should not assume every course has exactly one module layer or only a flat lesson list.

### Hierarchy

Default conceptual hierarchy:

Course -> Section -> Module -> Lesson -> Activity

The implementation should allow some levels to be skipped or renamed in the experience where appropriate.

### Curriculum Patterns

Courses may need:

- Simple lesson list.
- Module-based structure.
- Weekly cohort structure.
- Term-based school structure.
- Level-based music progression.
- Corporate onboarding sequence.
- Bootcamp sprint structure.
- Challenge-based sequence.
- Practice-lab-first structure.

### Curriculum Rules

The engine must allow:

- Reordering.
- Locking.
- Drip release.
- Prerequisites.
- Completion rules.
- Mandatory lessons.
- Optional lessons.
- Preview lessons.
- Hidden lessons.
- Scheduled release.
- Sequential learning.
- Free navigation.
- Time-limited access.

### Completion Rules

Completion should be configurable:

- Complete all mandatory lessons.
- Watch minimum percentage of videos.
- Pass quizzes.
- Submit assignments.
- Receive tutor approval.
- Attend required live sessions.
- Complete practice labs.
- Complete final project.
- Achieve minimum score.
- Meet corporate compliance rule.

---

## 8. Lesson Types

Lesson types should be configurable by Super Admin and enabled by product type, school, academy, or plan where appropriate.

### Supported Lesson Types

The platform should support:

- Video lesson.
- Audio lesson.
- Text lesson.
- PDF lesson.
- Slide lesson.
- Download lesson.
- Interactive lesson.
- Quiz lesson.
- Assignment lesson.
- Project lesson.
- Solco live lesson.
- Recorded live class.
- Practice lab.
- Case study.
- Reflection exercise.
- External link.
- Embedded content.
- Discussion prompt.
- Poll.
- Survey.
- Flashcards.
- AI practice session.
- Simulation.
- Observation task.
- Parent-reviewed child activity.

### Lesson Metadata

Each lesson should support:

- Title.
- Description.
- Type.
- Duration.
- Required or optional flag.
- Preview flag.
- Release date.
- Completion rule.
- Resources.
- Transcript or notes.
- Assessment links.
- Discussion setting.
- Age suitability.
- Accessibility settings.

---

## 9. Video and Audio Learning

Video and audio learning must be designed for mobile-first, data-conscious Kenyan usage.

### Video Lesson Requirements

Video lessons should support:

- Upload video.
- Embed video.
- Streaming-ready storage.
- Adaptive playback future support.
- Low-data mode.
- Download for offline mobile future support.
- Captions.
- Transcript.
- Chapters.
- Notes.
- Playback speed.
- Resume playback.
- Completion tracking.
- Watch percentage.
- Anti-abuse controls.
- Preview marking.
- Watermarking future support.
- Expiry-controlled access.

### Audio Learning Requirements

Audio-first learning should support:

- Audio lessons.
- Audio summaries.
- Podcast-style courses.
- Background playback in future mobile app.
- Download for offline listening.
- Transcript.
- Notes.
- Audio-only mode for video courses.
- Low-bandwidth option.

### Accessibility and Low-Data Principle

Every major media lesson should aim to provide lower-bandwidth alternatives where possible:

- Transcript.
- Audio-only version.
- Compressed video option.
- Downloadable notes.
- Clear file sizes.

---

## 10. Resource Library

Each course should support a resource library that can hold learning files, templates, practice files, and supplementary materials.

### Resource Types

Supported resources:

- PDFs.
- Word documents.
- Excel templates.
- PowerPoint slides.
- Images.
- Audio files.
- Video files.
- ZIP packages.
- Practice files.
- Case study files.
- Policy templates.
- Payroll templates.
- Music sheets.
- Dance practice tracks.
- Revision papers.
- Lesson notes.

### Resource Access Rules

Resources may be:

- Free.
- Course-only.
- Paid add-on.
- Instructor-only.
- Parent-only.
- Corporate-only.
- Downloadable.
- View-only.

### Resource Governance

Resource uploads should support:

- File type rules.
- File size limits.
- Virus or malware scanning future support.
- Copyright declaration.
- Versioning where appropriate.
- Download tracking.
- Expiry-controlled access.
- Tenant-aware storage permissions.

---

## 11. Assessment Architecture

Assessments should measure understanding, skill, participation, compliance, or practical performance depending on product type.

### Assessment Types

Support:

- Quiz.
- Timed quiz.
- Practice test.
- Final exam.
- Assignment.
- Project.
- Oral assessment through Solco.
- Practical demonstration.
- Video submission.
- Audio submission.
- File submission.
- Case analysis.
- Reflection.
- Peer review.
- Tutor review.
- AI-assisted review.
- Corporate compliance test.

### Question Types

Support:

- Multiple choice.
- Multiple answer.
- True/false.
- Short answer.
- Long answer.
- File upload.
- Audio response.
- Video response.
- Matching.
- Ordering.
- Fill-in-the-blank.
- Calculation.
- Scenario response.
- Rubric-based assessment.

### Assessment Use Cases

Assessments may be used for:

- Practice.
- Lesson completion.
- Module completion.
- Final certification.
- Corporate compliance.
- Placement or diagnostic tests.
- Scholarship eligibility.
- Skills verification.
- Instructor evaluation.

---

## 12. Quiz Engine

The quiz engine should support both simple learning checks and serious exam-style assessments.

### Core Quiz Capabilities

The quiz engine should support:

- Question banks.
- Random questions.
- Difficulty levels.
- Time limits.
- Attempt limits.
- Passing score.
- Retake rules.
- Immediate feedback.
- Delayed feedback.
- Explanation after answer.
- Shuffle questions.
- Shuffle answers.
- Negative marking optional.
- Certificate gating.
- Anti-cheating rules.
- AI-generated practice questions.
- Manual reviewer-approved questions.

### Question Bank Management

Question banks should support:

- School and category association.
- Skill association.
- Difficulty level.
- Review status.
- Author.
- Last updated date.
- Usage count.
- Retirement of outdated questions.

### Anti-Cheating Options

Anti-cheating settings may include:

- Time limits.
- Randomized question order.
- Randomized answer order.
- Large question pools.
- Attempt limits.
- Delayed answer explanations.
- Browser focus warnings future support.
- Identity confirmation for high-stakes assessments future support.

---

## 13. Assignment Engine

Assignments should support practical submission, feedback, revision, and evidence of skill.

### Assignment Capabilities

Assignments should support:

- Instructions.
- Due dates.
- File upload.
- Text submission.
- Audio submission.
- Video submission.
- Link submission.
- Rubric.
- Points.
- Tutor comments.
- AI feedback.
- Resubmission.
- Late submission rules.
- Peer review.
- Parent review for child learning.
- Corporate manager review.
- Plagiarism checks future support.

### Rubrics

Rubrics should support:

- Criteria.
- Performance levels.
- Points.
- Weighting.
- Reviewer comments.
- Learner-visible feedback.
- Internal reviewer notes.

### Submission Statuses

Assignment submissions may be:

- Not Started.
- Draft.
- Submitted.
- Late Submitted.
- Under Review.
- Changes Requested.
- Passed.
- Failed.
- Resubmitted.
- Excused.

---

## 14. Practice Labs

Practice labs are a major differentiator for Solva Academy. They turn learning into guided practical work using Solva ecosystem tools and simulated real-world tasks.

### MVP Approach

In the MVP, labs may be simulated rather than fully integrated. A simulated lab can include:

- Scenario instructions.
- Sample data.
- Guided steps.
- Screenshots or mock interfaces.
- Downloads.
- Submission tasks.
- Tutor review.
- AI-assisted practice prompts.
- Completion checklist.

### Future Integration Approach

Over time, labs should integrate with real Solva products through safe training environments:

- No production customer data.
- Sandbox datasets.
- Resettable learner workspaces.
- API-based task tracking.
- Completion events.
- Instructor review.
- Audit logs.

### HR Practice Lab

Connected to Solva HR concepts:

- Create employee records.
- Process payroll sample.
- Calculate PAYE.
- Apply SHIF.
- Apply NSSF.
- Generate payslip.
- Draft warning letter.
- Conduct recruitment simulation.
- Run performance review.
- Manage disciplinary case.

### SolvaOne Document Lab

Learners can:

- Generate CV.
- Create cover letter.
- Create business plan.
- Create company profile.
- Create proposal.
- Improve document using AI.

### Solva POS Lab

Learners can:

- Take customer order.
- Process sale.
- Manage stock.
- Generate receipt.
- Review waiter sales.

### SolvaFlow Lab

Learners can:

- Record field visit.
- Track delivery.
- Confirm receipt.
- Manage dispatch.
- Record payment.

### Solco Lab

Learners can:

- Join live class.
- Present assignment.
- Conduct mock interview.
- Attend group discussion.

### Lab Completion

Lab completion may require:

- Step completion.
- Uploaded evidence.
- System event completion.
- Tutor approval.
- AI practice completion.
- Reflection submission.
- Final score.

---

## 15. Learning Paths

A learning path is a structured journey toward an outcome.

### Examples

Learning paths may include:

- Become an HR Officer.
- Become a Payroll Assistant.
- Learn Piano Level 1.
- KCSE Mathematics Revision.
- Start a Small Business.
- Become a Dance Instructor.
- Restaurant Operations Basics.
- AI for Business Owners.

### Learning Path Contents

Learning paths should include:

- Courses.
- Assessments.
- Live sessions.
- Assignments.
- Projects.
- Practice labs.
- Certificates.
- Milestones.
- Badges.
- Final outcome.

### Access Models

Learning paths may be:

- Free.
- Paid.
- Membership-only.
- Corporate assigned.
- Invite-only.
- Scholarship-supported.

### Path Progress

Progress should show:

- Completed items.
- Current milestone.
- Upcoming work.
- Skill progress.
- Required assessments.
- Certificate eligibility.
- Recommended next step.

---

## 16. Certificates and Credentials

Credentials should provide trusted evidence of learning, participation, achievement, or skill demonstration.

### Credential Types

Support:

- Completion certificate.
- Achievement certificate.
- Professional certificate.
- Skill badge.
- Micro-credential.
- Participation certificate.
- Live class attendance certificate.
- Corporate certificate.
- Academy certificate.
- Platform verified certificate.

### Certificate Fields

Each certificate should support:

- Learner name.
- Course name.
- Academy name.
- Instructor name.
- Completion date.
- Certificate ID.
- QR verification code.
- Verification URL.
- Skills covered.
- Score where applicable.
- Credential type.
- Expiry date where applicable.
- Renewal requirement where applicable.
- Signature.
- Seal.
- Certificate template.
- Download PDF.
- Share link.

### Issuance Requirements

Certificate issuance may require:

- Course completion.
- Passing final assessment.
- Assignment submission.
- Tutor approval.
- Attendance percentage.
- Practice lab completion.
- Payment clearance.

### Certificate Governance

Super Admin should configure:

- Certificate templates.
- Credential types.
- Required completion rules.
- Academy branding rules.
- Platform verification rules.
- Revocation rules.
- Expiry and renewal rules.

---

## 17. Certificate Verification

Solva Academy should provide public certificate verification while protecting private learner data.

### Verification Methods

A verifier should be able to:

- Enter Certificate ID.
- Scan QR code.
- Open verification URL.

### Verification Page

The verification page should show:

- Certificate validity.
- Learner name.
- Course title.
- Academy.
- Date issued.
- Skills covered.
- Status.

It should not expose unnecessary private learner information such as email, phone, full course activity, scores unless configured for that credential, or unrelated learning history.

### Certificate Statuses

Certificate statuses:

- Valid.
- Expired.
- Revoked.
- Replaced.
- Under Review.
- Not Found.

### Revocation and Replacement

Revocation or replacement should require proper permissions and audit logging. Reasons may include fraud, course correction, duplicate issuance, learner request, or policy violation.

---

## 18. Pricing Models

Course pricing must be flexible and administrator-configurable.

### Supported Pricing Models

Support:

- Free.
- One-time payment.
- Subscription access.
- Membership access.
- Pay per module.
- Pay per live class.
- Bundle pricing.
- Corporate seat pricing.
- Sponsored access.
- Scholarship access.
- Coupon access.
- Affiliate discount.
- Early bird pricing.
- Installment payment future support.

### Pricing Controls

Pricing should support:

- Currency.
- Price.
- Sale price.
- Start and end dates.
- Coupon eligibility.
- Scholarship eligibility.
- Revenue share.
- Refund rules.
- Tax readiness.
- Corporate seat rate.
- Group discount rules.

### Affordability Alignment

Pricing should honor Chapter 1’s Kenyan affordability philosophy, including free intro lessons, low-cost micro-courses, standard courses, professional courses, corporate plans, scholarships, and mobile money readiness.

---

## 19. Access Rules

Access rules determine who can discover, enroll, view, continue, complete, and revisit a learning product.

### Access Types

Support:

- Public.
- Free preview.
- Paid enrollment.
- Invite-only.
- Private academy.
- Corporate-only.
- Parent-approved.
- Age-restricted.
- Membership-only.
- Scholarship-only.
- Cohort-only.
- Time-limited access.
- Lifetime access.

### Access Enforcement

Access should be enforced server-side and supported by tenant-aware file permissions. Frontend hiding is not enough.

### Access Expiry

Courses should support:

- Fixed expiry date.
- Duration from enrollment.
- Cohort end date.
- Corporate assignment deadline.
- Membership cancellation behavior.
- Certificate access after course expiry.

---

## 20. Reviews and Ratings

Reviews and ratings should help learners make informed decisions while protecting instructors from abuse.

### Review Features

Support:

- Star rating.
- Written review.
- Course-specific review.
- Instructor review.
- Academy review.
- Verified learner badge.
- Review moderation.
- Abuse reporting.
- Instructor response.
- Review analytics.

### Review Integrity

To reduce fake reviews:

- Only enrolled learners should leave course reviews.
- Reviews should indicate verified enrollment.
- Suspicious review patterns should be reportable.
- Review edits should be tracked.
- Moderators should handle abusive, fraudulent, or irrelevant reviews.

### Review Visibility

Review visibility may depend on:

- Course status.
- Moderation status.
- Learner privacy.
- Child learning restrictions.
- Academy policy.

---

## 21. Course Quality Review

Course quality review protects learners, instructors, employers, children, and the Solva brand.

### Review Criteria

Before publication, courses should be reviewed based on:

- Accuracy.
- Structure.
- Audio quality.
- Video quality.
- Learning outcomes.
- Assessment quality.
- Child safety where applicable.
- Professional sensitivity.
- Legal or tax accuracy where applicable.
- HR or payroll accuracy where applicable.
- Misleading claims.
- Copyright compliance.
- Pricing fairness.
- Certificate suitability.

### Configurable Reviewer Requirements

Reviewer requirements should be configurable by:

- School.
- Category.
- Product type.
- Risk level.
- Age group.
- Credential type.
- Instructor verification level.

### Review Outcomes

Possible outcomes:

- Approved.
- Changes Requested.
- Rejected.
- Conditionally Approved.
- Escalated.
- Suspended after publication.

---

## 22. Versioning

Courses should support version control so changes can be audited, reviewed, and handled fairly for existing learners.

### Version Tracking

Track:

- Version number.
- Published date.
- Changes made.
- Author.
- Reviewer.
- Previous version.
- Current version.
- Learners enrolled under each version.

### Version Rules

The system should define:

- Which edits create a draft version.
- Which edits require review.
- Which edits can publish immediately.
- Whether existing learners move to a new version.
- Whether certificates reference the version completed.
- Whether compliance learners must retake updated modules.

### Regulated or Compliance Courses

For regulated or compliance courses, learners may need to retake updated modules when major content changes. This should be configurable by course type and organization policy.

---

## 23. AI Course Creation Support

AI should help instructors create better learning products faster, but AI output should remain draft until reviewed by a human.

### AI-Assisted Creation

AI can help create:

- Course outlines.
- Lesson plans.
- Learning outcomes.
- Quizzes.
- Assignments.
- Summaries.
- Flashcards.
- Transcripts.
- Captions.
- Practice questions.
- Revision notes.
- Marketing descriptions.
- Certificate wording.

### Human Review Requirement

AI-generated content should be marked as draft until reviewed by the instructor.

For sensitive categories such as HR, payroll, tax, law, health, and finance, AI outputs should require human review before publication.

### AI Governance

Super Admin should configure:

- Which AI features are enabled.
- Which schools can use AI drafting.
- Which categories require extra review.
- AI usage limits.
- Cost controls.
- Prompt templates.
- Safety warnings.
- Audit logs for AI-generated content.

---

## 24. Child Learning Requirements

Children’s courses require special product, safety, and privacy rules.

### Required Child Learning Features

For children’s courses, support:

- Parent approval.
- Age bracket tagging.
- Safe communication.
- Tutor visibility controls.
- Parent progress reports.
- No uncontrolled private messaging.
- Live class attendance controls.
- Child-friendly interface.
- Restricted reviews.
- Parent-managed certificates.
- Safe media submission rules.

### Content Requirements

Child-facing content should be reviewed for:

- Age suitability.
- Safe language.
- Clear instructions.
- Appropriate media.
- Safe assignments.
- Tutor verification.
- Live class safety.

### Parent Visibility

Parents or guardians should be able to see:

- Enrolled child courses.
- Progress.
- Assignment status.
- Certificates.
- Live class attendance.
- Tutor updates.
- Communication settings.

---

## 25. Corporate Course Requirements

Corporate courses must support training accountability, deadlines, reporting, and internal learning workflows.

### Corporate Features

Corporate courses should support:

- Mandatory completion.
- Deadlines.
- Department assignment.
- Manager visibility.
- Compliance reports.
- Internal-only courses.
- Corporate certificates.
- Attendance reports.
- Completion reminders.
- Custom onboarding paths.
- Employee progress dashboard.

### Organization Controls

Organizations should configure:

- Assigned learners.
- Departments or teams.
- Deadline rules.
- Reminder schedules.
- Manager visibility.
- Certificate rules.
- Internal course visibility.
- Reporting exports.

### Corporate Privacy Boundary

Organizations should only see learning records tied to their workspace, assigned courses, and approved reporting scopes. Personal learning outside the organization should remain private unless the learner consents.

---

## 26. Marketplace Educational Products

The marketplace should let instructors and academies sell educational resources beyond courses.

### Product Types

Instructors and academies may sell:

- Templates.
- Notes.
- E-books.
- Revision papers.
- Music sheets.
- Dance routines.
- Practice tracks.
- Policy documents.
- Payroll sheets.
- Business templates.
- Lesson packs.
- Flashcard packs.

### Marketplace Product Fields

Marketplace products should support:

- Title.
- Description.
- Academy attribution.
- Instructor attribution.
- Category.
- Preview.
- Price.
- Files.
- License terms.
- Refund rules.
- Ratings.
- Reviews.
- Revenue share.
- Download controls.

### Marketplace Governance

Marketplace products may require review for:

- Copyright.
- Accuracy.
- Safety.
- Misleading claims.
- File security.
- Category suitability.
- Pricing fairness.

---

## 27. Search and Discovery

Search and discovery should help learners find relevant, affordable, trusted learning products.

### Discovery Surfaces

Learners should discover courses through:

- Search bar.
- Schools.
- Categories.
- Academies.
- Instructors.
- Tags.
- Skills.
- Learning paths.
- Trending courses.
- New courses.
- Free courses.
- Live now.
- Recommended for you.
- Corporate assigned.
- Popular in Kenya.
- Children’s courses.
- Professional courses.
- Low-cost courses.

### Search Filters

Search should support filters for:

- School.
- Category.
- Level.
- Price.
- Language.
- Delivery mode.
- Certificate availability.
- Rating.
- Duration.
- Age group.
- Academy.
- Instructor.
- Live or self-paced.
- Free preview.

### Recommendation Inputs

Recommendations may use:

- Learning interests.
- Enrollments.
- Skills.
- Completed courses.
- Location.
- Language.
- Corporate assignments.
- Age group.
- Search behavior.
- Similar learner behavior where privacy allows.

---

## 28. Enrollment

Enrollment connects a learner to a learning product and should record how access was granted.

### Enrollment Types

Enrollment should support:

- Free enrollment.
- Paid enrollment.
- Coupon enrollment.
- Bundle enrollment.
- Corporate enrollment.
- Parent enrollment for child.
- Scholarship enrollment.
- Admin enrollment.
- Bulk enrollment.
- Waitlist.
- Cohort enrollment.

### Enrollment Data

Track:

- Learner.
- Course or product.
- Enrollment source.
- Price paid or access source.
- Payment reference where applicable.
- Coupon or scholarship reference.
- Cohort.
- Organization workspace where applicable.
- Parent or guardian approval where applicable.
- Access start.
- Access expiry.
- Status.

### Enrollment Statuses

Enrollment statuses may include:

- Pending.
- Active.
- Waitlisted.
- Payment Pending.
- Parent Approval Required.
- Corporate Assigned.
- Scholarship Approved.
- Completed.
- Expired.
- Cancelled.
- Refunded.
- Revoked.

---

## 29. Progress Tracking

Progress tracking should support learner motivation, certificates, instructor insights, parent oversight, corporate reporting, and learning analytics.

### Progress Events

Track:

- Lessons started.
- Lessons completed.
- Watch progress.
- Quiz scores.
- Assignment status.
- Live class attendance.
- Practice lab completion.
- Certificate eligibility.
- Learning path progress.
- Streaks.
- Study time.
- Skill progress.
- Completion percentage.

### Progress Views

Progress should be visible to:

- Learner.
- Parent or guardian for child profiles.
- Instructor for assigned courses.
- Academy owner for academy courses.
- Corporate manager for organization-assigned courses.
- Super Admin for platform analytics.

Visibility must respect privacy and tenant boundaries.

### Skill Progress

Skill progress should connect course outcomes, assessments, labs, assignments, and certificates into the learner’s future skills passport.

---

## 30. Conceptual Data Model

This chapter introduces conceptual entities only. SQL and physical schema design should come in a later chapter.

### Core Learning Product Entities

- `learning_products`: Generic wrapper for courses, workshops, labs, bundles, resources, and other learning products.
- `courses`: Course-specific record and metadata.
- `course_versions`: Version history and publication records.
- `curriculum_nodes`: Flexible hierarchy nodes for sections, modules, lessons, and activities.
- `sections`: Optional course sections.
- `modules`: Optional course modules.
- `lessons`: Individual learning units.
- `lesson_assets`: Media and embedded lesson assets.
- `lesson_resources`: Downloadable or view-only lesson resources.
- `course_instructors`: Instructor associations and teaching roles.
- `course_pricing`: Pricing rules and offers.
- `course_access_rules`: Access and visibility rules.

### Enrollment and Progress Entities

- `enrollments`: Learner access records.
- `learner_progress`: Progress events and aggregate completion.

### Assessment Entities

- `assessments`: Quizzes, exams, assignments, projects, and reviews.
- `questions`: Assessment questions.
- `question_options`: Answer options.
- `question_banks`: Reusable question pools.
- `quiz_attempts`: Learner quiz attempts.
- `assignment_submissions`: Assignment and project submissions.
- `rubrics`: Assessment criteria.
- `rubric_scores`: Scores and feedback by rubric criterion.

### Practice Lab Entities

- `practice_labs`: Lab definitions.
- `lab_attempts`: Learner lab attempts, events, and completion.

### Learning Path Entities

- `learning_paths`: Structured journeys.
- `learning_path_items`: Courses, assessments, labs, live sessions, or milestones inside paths.

### Certificate Entities

- `certificates`: Issued credentials.
- `certificate_templates`: Configurable visual and data templates.
- `certificate_verifications`: Verification events and public lookup records.

### Quality and Marketplace Entities

- `course_reviews`: Learner reviews and ratings.
- `course_quality_reviews`: Reviewer checks before or after publication.
- `marketplace_products`: Educational resources for sale.
- `product_purchases`: Purchase records for marketplace products.

### Relationship Principles

- A course belongs to an academy and may be classified under a school and category.
- A course can have many versions.
- A course version can have many curriculum nodes.
- A lesson can have many assets and resources.
- A course can have many instructors.
- A learner can have many enrollments.
- Enrollment connects learner progress to a specific product or course version.
- Certificates should reference the completed course, version, learner, academy, and credential rules.
- Practice labs can belong to courses, learning paths, or standalone products.
- Marketplace products can belong to instructors or academies.

---

## 31. Admin Configuration Requirements

Super Admin should configure learning engine rules without code changes wherever practical.

### Configurable Learning Settings

Super Admin should manage:

- Learning product types.
- Course statuses.
- Required course metadata by product type.
- Curriculum node labels.
- Lesson types.
- Resource file rules.
- Assessment types.
- Question types.
- Quiz rules.
- Assignment rules.
- Lab types.
- Learning path templates.
- Certificate types.
- Certificate templates.
- Certificate issuance rules.
- Certificate verification display rules.
- Pricing models.
- Access rules.
- Review criteria.
- Reviewer requirements.
- Course quality workflows.
- AI course creation settings.
- Child learning settings.
- Corporate learning settings.
- Marketplace categories.
- Marketplace review rules.
- Discovery sections.
- Search filters.
- Enrollment sources.
- Progress tracking rules.

### Configuration Governance

Configuration changes should be:

- Permission-protected.
- Audited.
- Validated.
- Previewable where possible.
- Reversible where practical.

---

## 32. Risks and Mitigations

### Risk: Becoming a Passive Video Library

If Solva Academy focuses only on video upload, it will fail to deliver the Chapter 1 outcome vision.

Mitigation:

- Build practice, feedback, assessment, certification, and learning paths into the core engine.
- Encourage product types beyond basic courses.
- Measure completion, skill progress, and outcomes.

### Risk: Curriculum Engine Overcomplexity

Too much flexibility can make course creation confusing.

Mitigation:

- Provide templates by product type.
- Use guided creation.
- Hide advanced settings until needed.
- Offer AI-assisted outlines.

### Risk: Poor Course Quality

Low-quality courses damage trust.

Mitigation:

- Require quality review.
- Use reviewer rules by category and risk.
- Track ratings and completion.
- Allow course suspension.

### Risk: AI-Generated Inaccuracy

AI may create inaccurate content, especially in sensitive domains.

Mitigation:

- Mark AI outputs as drafts.
- Require human review.
- Require extra review for HR, payroll, tax, law, health, and finance.
- Audit AI usage.

### Risk: Certificate Credibility Problems

Certificates become weak if they are issued too easily.

Mitigation:

- Configure issuance rules.
- Tie certificates to assessments, attendance, assignments, or labs.
- Provide public verification.
- Support revocation.

### Risk: Child Safety Failures

Child-facing learning requires special safeguards.

Mitigation:

- Parent approval.
- Restricted communication.
- Child-safe review.
- Tutor verification.
- Safe live class rules.

### Risk: Tenant Data Leakage

Courses, resources, corporate training, and private academy data must remain isolated.

Mitigation:

- Use workspace and tenant IDs.
- Enforce server-side access.
- Use Row Level Security.
- Protect file access.
- Audit sensitive actions.

### Risk: Expensive Media Delivery

Video and audio can create high storage and bandwidth costs.

Mitigation:

- Use streaming-ready storage.
- Provide low-data modes.
- Support audio alternatives.
- Track media usage.
- Plan CDN and compression strategy.

---

## 33. Acceptance Criteria

Chapter 3 should be considered satisfied when the blueprint supports the following:

- Learning is defined as an outcome journey, not passive video access.
- Product types are configurable.
- Course creation workflow supports drafts, review, publication, and collaboration.
- Course statuses are defined and auditable.
- Course metadata supports discovery, review, pricing, and analytics.
- Curriculum hierarchy is flexible.
- Lesson types cover video, audio, text, live, interactive, assignments, labs, and child activities.
- Video and audio requirements support low-data Kenyan learners.
- Course resources support multiple file types and access models.
- Assessments, quizzes, assignments, projects, and rubrics are defined.
- Practice labs are defined as a Solva ecosystem differentiator.
- Learning paths support structured outcome journeys.
- Certificates and verification are credible and privacy-aware.
- Pricing models and access rules are configurable.
- Reviews and quality review protect trust.
- Versioning supports course changes and compliance.
- AI course creation support is governed.
- Child learning requirements are explicit.
- Corporate learning requirements are explicit.
- Marketplace educational products are included.
- Search, discovery, enrollment, and progress tracking are defined.
- Conceptual data entities are introduced without SQL.
- Admin configuration rules avoid hardcoding.

---

## 34. Dependencies for Later Chapters

Later chapters should define:

- Physical database schema and Row Level Security policies.
- Detailed payment, wallet, coupon, scholarship, refund, and payout logic.
- Solco live class integration architecture.
- AI tutor runtime behavior and learner-facing AI support.
- Mobile app offline learning and media download rules.
- Full certificate template design.
- Analytics dashboards for learners, instructors, academies, organizations, and Super Admin.
- Search and recommendation technical strategy.
- Notification templates for course activity.
- Marketplace fulfillment and licensing.
- Legal, copyright, refund, and child-safety policy documents.
- QA plans for curriculum, access, certificates, assessments, and tenant isolation.

---

## 35. Final Recommendations

Solva Academy should build its learning engine around practical outcomes, not content storage.

The strongest product direction is:

- Make every course part of a broader learning journey.
- Support many product types, not just video courses.
- Give instructors a guided course builder with AI assistance and human review.
- Keep curriculum flexible enough for self-paced courses, cohorts, bootcamps, school terms, music levels, corporate onboarding, and practice labs.
- Treat practice labs as a major Solva ecosystem advantage.
- Make certificates meaningful, verifiable, and tied to real completion rules.
- Protect children with parent oversight and safe communication.
- Support corporate training with deadlines, reporting, and internal-only learning.
- Keep pricing, access, product types, lesson types, certificates, workflows, and discovery rules configurable by Super Admin.

Chapter 3 should guide Solva Academy toward a flexible, credible, Kenyan-first and Africa-ready learning platform where learners do more than watch: they practice, receive feedback, demonstrate skill, earn credentials, and move toward real opportunities.

