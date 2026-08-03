# Solva Academy Master Product Blueprint

## Chapter 2: Identity, Authentication, User Roles, Permissions, Schools, Academies, Organizations, and Multi-Tenant Architecture

**Platform name:** Solva Academy  
**Repository / project name:** `solva-academy`  
**Production domain:** `academy.solvaone.co.ke`  
**Parent ecosystem:** SolvaOne / Solva Business Group  
**Main SolvaOne platform:** `solvaone.co.ke`  
**Chapter status:** Product and system blueprint only. No production code.

---

## 1. Executive Summary

Solva Academy must be built around a flexible identity and tenancy model that can support a national-scale learning ecosystem, not a basic learning management system. Chapter 1 established Solva Academy as a standalone platform where people can learn, teach, create academies, earn income, train organizations, verify skills, and connect learning to opportunity. Chapter 2 defines the identity, role, workspace, academy, school, organization, and security foundation needed to make that vision practical.

The central principle is one person, one account, multiple capabilities. A user should not create separate accounts because they are a learner, parent, tutor, academy owner, employer, reviewer, moderator, or platform administrator. One authenticated identity should support many roles, many workspaces, and many contexts.

This chapter defines:

- Authentication and future Solva Single Sign-On readiness.
- Registration flows for learners, parents, instructors, academy owners, and organizations.
- Central user profiles with separated private, public, professional, financial, child-related, and administrative data.
- Configurable roles and granular permissions.
- Role switching and workspace switching.
- Founding Super Admin protection for Timothy Sila at `timsila18@gmail.com`.
- Configurable schools, categories, taxonomy, age groups, and learning classifications.
- Academy architecture as instructor-owned or organization-owned learning businesses.
- Organization and corporate learning workspaces.
- Parent and child learning safety.
- Instructor verification and course reviewer architecture.
- Approval workflows and user lifecycle management.
- Trust, safety, privacy, support access, audit trails, and multi-tenant isolation.
- Conceptual data entities for future schema design.

The architecture must not rely on frontend hiding, hardcoded roles, hardcoded categories, or fragile email-only checks. Solva Academy needs database-backed identity, permission, workspace, and tenant boundaries supported by Row Level Security, server-side authorization, audit logging, and administrator-configurable rules.

---

## 2. Identity Philosophy

Solva Academy should use a one-person, one-account, multiple-capabilities model.

One authenticated identity represents one real person or one managed account holder. That identity may hold several roles at the same time and may operate across several workspaces.

Examples:

- A teacher can learn HR, teach Mathematics, own a tutoring academy, and moderate their academy community.
- An HR manager can learn advanced payroll, teach recruitment, manage corporate employee learning, and verify employee certificates.
- A parent can buy a music course, manage a child profile, enroll in a business course, and later become an instructor.
- A founder can administer the platform, test learner flows, own an academy, review courses, and act as a support agent.

The platform should treat identity, role, and workspace as related but separate concepts:

- **Identity:** Who the person is.
- **Profile:** How the person appears and manages preferences.
- **Role:** What capabilities the person has.
- **Permission:** The specific action the person can perform.
- **Workspace:** The context in which the person is acting.
- **Tenant boundary:** The data scope the person is allowed to access.

This distinction prevents role confusion, supports future growth, and allows users to evolve over time without creating duplicate accounts.

### Identity Principles

- One person should have one primary account.
- One account can hold multiple roles.
- Roles should be scoped to a platform, academy, organization, school, course, or personal workspace.
- Users should switch roles without logging out.
- Switching roles changes experience, navigation, dashboards, notifications, and available actions.
- Switching roles must never delete or silently weaken underlying permissions.
- Sensitive actions must check actual permissions, not just the visible selected role.
- The system should support future shared identity across the Solva ecosystem while remaining independently functional.

---

## 3. Authentication Architecture

Solva Academy should launch with secure independent authentication while remaining ready for future shared Solva identity.

### First-Release Authentication

The first release should support:

- Email and password.
- Email verification.
- Password reset.
- Secure session management.
- Google sign-in.
- Session history.
- Logout from individual devices.
- Logout from all devices.
- Configurable password policies.
- Configurable session duration.
- Account recovery flow.

### Future Authentication Capabilities

The architecture should be ready for:

- Microsoft sign-in.
- Apple sign-in.
- Phone number sign-in.
- OTP authentication.
- Passkeys.
- Multi-factor authentication.
- Trusted devices.
- Device risk signals.
- Step-up authentication for sensitive actions.
- Shared Solva identity.

### Session Management

Session design should support:

- Device list visible to users.
- Last active time.
- Approximate location where legally appropriate.
- Browser or device metadata.
- Logout current session.
- Logout selected session.
- Logout all sessions.
- Forced logout after password reset or high-risk security event.
- Admin-triggered session revocation for compromised accounts.

### Future Solva Single Sign-On Strategy

Solva Academy should be designed for eventual shared identity across:

- SolvaOne.
- Solva Academy.
- Solco.
- Solva HR.
- Solva POS.
- SolvaFlow.
- SolvaStay.
- Future Solva products.

The recommended strategy is:

1. Launch Solva Academy with independent auth that uses stable user IDs, identity provider records, and clean profile separation.
2. Design a future Solva identity provider or shared SSO layer that can issue tokens accepted by each Solva product.
3. Map product-specific roles and permissions inside each product rather than forcing every product to share identical authorization logic.
4. Support account linking so an existing SolvaOne user can connect to Solva Academy without duplicate identity confusion.
5. Keep product data separate while allowing shared profile basics, shared wallet where appropriate, and shared ecosystem analytics with consent and governance.

Solva Academy must not be blocked by unfinished shared identity systems. It should remain fully functional independently.

---

## 4. Registration Flows

Registration should be progressive. The platform should collect only what is needed for the current intent, then request more information when the user applies for higher-trust capabilities such as instructing, owning an academy, managing children, or administering an organization.

### Individual Learner Registration

Collect only necessary information:

- Full name.
- Email or phone number.
- Password where applicable.
- Country.
- Preferred language.
- Learning interests.
- Optional profile photo.
- Age bracket.

Learners should be able to explore the platform with minimal friction. Optional fields should not block discovery unless required by safety, payment, or compliance rules.

### Parent or Guardian Registration

A parent or guardian should create their own adult account first. After that, they can add child learner profiles.

Parent or guardian capabilities:

- Create child profiles.
- Manage child enrollments.
- Pay for courses.
- View child progress.
- View assignments.
- Receive tutor updates.
- Manage communication permissions.
- Approve live class participation where required.
- Control child profile visibility.
- Remove or archive child profiles subject to retention rules.

### Instructor Applicant Registration

Instructor application should be configurable by Super Admin. Not every field should be mandatory for every category.

Potential fields:

- Full name.
- Professional display name.
- Profile photograph.
- Biography.
- Areas of expertise.
- Qualifications.
- Professional certifications.
- Work experience.
- Teaching experience.
- Languages.
- Proposed course topics.
- Sample lesson or introduction video.
- Supporting documents.
- Social or professional links.
- Preferred payout method.
- Tax information where legally necessary.
- Acceptance of instructor terms.

The system should support draft applications, saved progress, submitted applications, review comments, changes requested, approval, conditional approval, and rejection.

### Academy Owner Applicant Registration

An academy owner applicant may be an individual, organization, school, company, church, NGO, or other institution.

Potential fields:

- Individual or organization name.
- Proposed academy name.
- Academy description.
- Learning category.
- Target learners.
- Logo.
- Banner.
- Proposed courses.
- Academy team.
- Registration information where applicable.
- Payment and payout information.
- Terms acceptance.

The academy application should not automatically grant public visibility. It should enter a review workflow.

### Organization Registration

Organization registration should support:

- Companies.
- Schools.
- Universities.
- TVET institutions.
- NGOs.
- Churches.
- SACCOs.
- CBOs.
- Government institutions.
- Professional associations.
- Training companies.

Potential fields:

- Organization name.
- Organization type.
- Contact person.
- Email.
- Phone.
- Country.
- County.
- Industry.
- Number of expected learners.
- Training needs.
- Organization logo.
- Billing details.
- Optional registration documents.

Organization accounts may require approval before access to enterprise features.

---

## 5. User Profile Model

Each user should have one central profile that can support personal learning, professional teaching, academy ownership, organization membership, and public skills identity.

### Central Profile Fields

The central profile may include:

- Full name.
- Display name.
- Profile photo.
- Biography.
- Country.
- County.
- Preferred language.
- Time zone.
- Learning interests.
- Skills.
- Education.
- Experience.
- Certificates.
- Badges.
- Courses.
- Academies.
- Instructor profile where applicable.
- Employer profile where applicable.
- Public profile settings.
- Privacy settings.
- Notification preferences.
- Accessibility preferences.

### Data Separation

The platform should separate:

- Private account data.
- Public profile data.
- Professional profile data.
- Financial data.
- Child-related data.
- Administrative data.

This separation helps protect privacy, reduce accidental exposure, and support future compliance requirements.

### Public Profile Control

Users should control what appears publicly:

- Name or display name.
- Profile photo.
- Bio.
- Certificates.
- Skills.
- Courses completed.
- Academies associated with.
- Instructor profile.
- Reviews and ratings.
- Portfolio items.
- Employer visibility.
- Search visibility.

Privacy defaults should be conservative, especially for children.

---

## 6. Role Architecture

Solva Academy should use configurable roles. Roles are named bundles of permissions, but access decisions should ultimately rely on permissions and scopes.

### Initial System Roles

Initial roles should include:

1. Visitor.
2. Learner/Student.
3. Parent/Guardian.
4. Child Learner.
5. Tutor/Instructor.
6. Teaching Assistant.
7. Academy Owner.
8. Academy Administrator.
9. Academy Finance Manager.
10. Academy Content Manager.
11. Academy Community Moderator.
12. Corporate Learner.
13. Corporate Trainer.
14. Employer Administrator.
15. HR/Learning Manager.
16. Department Manager.
17. School Administrator.
18. Organization Administrator.
19. Course Reviewer.
20. Subject Matter Reviewer.
21. Quality Assurance Reviewer.
22. Platform Moderator.
23. Finance Officer.
24. Support Agent.
25. Marketing Manager.
26. Content Curator.
27. Platform Administrator.
28. Super Admin.
29. Founding Super Admin.

### Configurable Role Management

Authorized administrators should be able to:

- Create custom roles.
- Rename display labels.
- Duplicate roles.
- Add permissions.
- Remove permissions.
- Set role scope.
- Activate roles.
- Deactivate roles.
- Assign roles.
- Revoke roles.
- Set temporary roles.
- Set role expiry dates.

### Protected System Roles

Some roles should be protected:

- Founding Super Admin.
- Super Admin.
- Platform Administrator.
- Finance Officer.
- Support Agent.
- Platform Moderator.

Protected roles may restrict deletion, dangerous permission changes, or assignment by lower-level administrators.

---

## 7. Permission Architecture

Permissions should be granular and structured. Role names are not enough for a platform with academies, schools, organizations, children, payments, certificates, and platform governance.

### Permission Format

Permissions should follow a pattern:

`resource.action.scope`

Examples:

- `course.create.own`
- `course.edit.own`
- `course.publish.academy`
- `course.approve.platform`
- `student.view.academy`
- `payment.view.own`
- `payout.approve.platform`
- `academy.manage.own`
- `academy.staff.assign`
- `certificate.issue.course`
- `certificate.revoke.platform`
- `community.moderate.academy`
- `user.suspend.platform`
- `analytics.view.organization`
- `settings.manage.platform`

### Permission Scopes

Permission scopes should include:

- Own.
- Assigned.
- Course.
- Academy.
- Organization.
- School.
- Platform.

### Permission Groups

Permission groups should organize related permissions:

- User management.
- Course management.
- Lesson management.
- Academy management.
- School management.
- Organization management.
- Payments and payouts.
- Certificates.
- Reviews and approvals.
- Communities and moderation.
- Child safety.
- Analytics.
- Settings.
- Support access.
- Audit logs.

### Permission Dependencies

Some permissions should require other permissions. Examples:

- A user cannot approve payouts without permission to view payout requests.
- A reviewer cannot approve a course without permission to view course review materials.
- A support agent cannot open a support access session without permission to create support access logs.

### Permission Inheritance and Overrides

The system should support:

- Role-based permission inheritance.
- Workspace-scoped permissions.
- Temporary permission overrides.
- Explicit deny rules for sensitive restrictions.
- Emergency permission revocation.
- Delegated permissions with expiry.

Explicit deny rules should take priority where safety requires it.

---

## 8. Multi-Role Experience

The interface should let users clearly switch roles and workspaces without logging out.

### Role and Workspace Switcher

Example profile menu:

**Current experience:** Timothy Sila - Super Admin

Switch to:

- Student.
- Tutor.
- Timothy Sila HR Academy.
- Employer Workspace.
- Corporate Trainer.
- Reviewer.
- Moderator.

### What Switching Changes

Switching mode should change:

- Dashboard.
- Navigation.
- Available actions.
- Notifications.
- Analytics.
- Workspace context.
- Default filters.
- Quick actions.

Switching should not remove underlying permissions. Sensitive actions must still check real authorization.

### Remembered Context

The system should remember:

- Last selected role.
- Last selected academy.
- Last selected organization.
- Recent workspaces.
- Last dashboard view where appropriate.

### Avoiding Accidental Wrong-Context Actions

The interface should show:

- Active role.
- Active workspace.
- Admin mode indicator.
- Academy or organization name.
- High-risk action confirmations.
- Clear visual separation between personal learning and administration.

---

## 9. Workspace Architecture

Role and workspace are separate.

A user may have several roles and several workspaces. A workspace is the context in which the user is acting.

### Workspace Types

Workspace types should include:

- Personal learner workspace.
- Tutor workspace.
- Academy owner workspace.
- Academy staff workspace.
- Corporate workspace.
- School workspace.
- Organization workspace.
- Platform administration workspace.
- Reviewer workspace.
- Moderator workspace.
- Support workspace.

### Example

Timothy Sila may have:

Roles:

- Super Admin.
- Tutor.
- Learner.

Workspaces:

- Solva Academy Platform Administration.
- Timothy Sila HR Academy.
- Personal Learning.
- Solva Business Group Corporate Learning.

### Workspace Requirements

Each workspace should define:

- Workspace type.
- Owner or parent entity.
- Members.
- Member roles.
- Permission scope.
- Default dashboard.
- Navigation configuration.
- Audit context.
- Status.

Workspace IDs should be used for authorization, audit logging, analytics filtering, and tenant isolation.

---

## 10. Founding Super Admin Design

The founding platform account is:

**Name:** Timothy Sila  
**Email:** `timsila18@gmail.com`

This account must be recognized as the founding Super Admin account.

### Required Capabilities

The account should operate as:

- Founding Super Admin.
- Platform Administrator.
- Academy Owner.
- Tutor/Instructor.
- Student/Learner.
- Parent/Guardian where applicable.
- Reviewer.
- Moderator.
- Finance Viewer.
- Employer User.
- Corporate Trainer.
- Platform Tester.
- Support Agent.

### Secure Switch Role / View As

The founding account should have secure role and view switching. Current modes may include:

- Super Admin.
- Tutor.
- Student.
- Academy Owner.
- Reviewer.
- Moderator.
- Employer.
- Corporate Trainer.

Switching mode changes dashboard, navigation, available actions, notifications, analytics, and workspace context.

### Protection Rules

The founding role must be protected from:

- Accidental deletion.
- Suspension.
- Demotion.
- Lockout.
- Permission removal that prevents recovery.
- Role expiry.
- Automated deactivation.

High-risk changes involving the founding account must require:

- Re-authentication.
- Clear confirmation.
- Audit logging.
- Recovery safeguards.
- Permission checks by another authorized Super Admin where appropriate.

### Database-Level Strategy

Do not rely only on hardcoding the email address in the frontend.

The secure strategy should include:

- A database-backed protected user record.
- A protected system role assignment.
- A founding admin flag or protected account marker controlled by migration or secure admin process.
- Server-side enforcement preventing destructive changes.
- Database constraints or guarded procedures for high-risk operations where practical.
- Audit logs for all changes.
- Recovery process documentation.

Frontend checks may improve the experience, but backend and database safeguards must provide real protection.

---

## 11. School Architecture

A School is a top-level learning classification managed by the platform. Schools organize discovery, curriculum strategy, reviewer assignment, category structure, and homepage presentation.

### Initial School Examples

Initial examples may include:

- School of Human Resources.
- School of Business.
- School of Music.
- School of Dance.
- School of Technology.
- School of Academic Tutoring.
- School of Languages.
- School of Creative Arts.
- School of Finance.
- School of Agriculture.
- School of Hospitality.
- School of Leadership.
- School of Public Service.
- School of Faith and Ministry.
- School of Entrepreneurship.
- School of Artificial Intelligence.
- School of Personal Development.

These must not be hardcoded.

### School Configuration

Super Admin should manage:

- School name.
- Slug.
- Description.
- Logo.
- Icon.
- Banner.
- Theme.
- Featured image.
- Visibility.
- Display order.
- School administrator.
- School reviewers.
- Categories.
- Subcategories.
- Featured academies.
- Featured instructors.
- Featured courses.
- SEO metadata.
- Status.

### School Statuses

Statuses:

- Draft.
- Active.
- Hidden.
- Archived.
- Retired.

Status changes should be logged.

---

## 12. Taxonomy Architecture

The taxonomy system should be flexible and administrator-configurable.

### Configurable Taxonomy Objects

Super Admin should create unlimited:

- Schools.
- Categories.
- Subcategories.
- Subjects.
- Topics.
- Skills.
- Tags.
- Levels.
- Course types.
- Learning formats.
- Languages.
- Age groups.

### Hierarchy Examples

School of Human Resources:

- Payroll.
- Kenyan Payroll.
- PAYE.
- NSSF.
- SHIF.
- Payroll Reporting.

School of Music:

- Instruments.
- Piano.
- Beginner Piano.
- Piano for Children.

### Taxonomy Requirements

The taxonomy system should support:

- Parent-child hierarchy.
- Slugs.
- Display order.
- Visibility.
- SEO metadata.
- Icon or image.
- Related skills.
- School association.
- Age suitability.
- Reviewer requirements.
- Risk level.
- Migration or merging of categories.

Taxonomy changes should not require code changes.

---

## 13. Academy Architecture

An Academy is an instructor-owned or organization-owned learning business operating within Solva Academy.

Examples:

- Timothy Sila HR Academy.
- Sarah Music Academy.
- Yvonne Dance Academy.
- CBC Excellence Academy.
- Kenya Coding Academy.

### Academy Data

Each academy should contain:

- Academy name.
- Slug.
- Logo.
- Banner.
- Description.
- Mission.
- Vision.
- Academy story.
- Academy owner.
- Academy staff.
- Tutors.
- Courses.
- Learning paths.
- Live classes.
- Communities.
- Events.
- Marketplace products.
- Certificates.
- Reviews.
- Student count.
- Completion statistics.
- Public contact information.
- Social links.
- Support information.
- Policies.
- Refund rules.
- Revenue settings.
- Payout settings.
- Analytics.
- Public academy page.

### Academy URLs

Primary platform path:

`academy.solvaone.co.ke/academy/timothy-sila-hr`

Future optional subdomain:

`timothy.academy.solvaone.co.ke`

Future custom domains:

`learn.exampleacademy.co.ke`

Custom domains should be a future premium capability.

### URL and Domain Rules

The system should define:

- Slug uniqueness.
- Reserved names.
- Domain verification.
- SSL requirements.
- Domain ownership.
- Redirect behavior.
- Canonical URLs.
- SEO considerations.
- Abuse prevention.

---

## 14. Academy Creation Workflow

Academy creation should be reviewed and governed.

### Workflow

1. User selects "Start Your Academy."
2. User completes academy application.
3. User selects academy category.
4. User enters branding information.
5. User explains intended courses.
6. User uploads verification information where required.
7. Application enters review.
8. Reviewer evaluates application.
9. Reviewer may request changes.
10. Applicant updates information.
11. Academy is approved, conditionally approved, or rejected.
12. Academy owner receives onboarding checklist.
13. Academy launches in draft mode.
14. Academy owner creates courses.
15. Courses undergo relevant quality review.
16. Academy becomes publicly discoverable.

### Academy Application Statuses

Statuses:

- Draft.
- Application Incomplete.
- Submitted.
- Under Review.
- Changes Requested.
- Conditionally Approved.
- Approved.
- Active.
- Restricted.
- Suspended.
- Archived.
- Rejected.

All status changes must be logged with actor, timestamp, reason, previous status, and new status.

---

## 15. Academy Ownership and Teams

Academies may have different ownership structures.

### Ownership Types

Support:

- Individual-owned academy.
- Jointly owned academy.
- Organization-owned academy.
- School-owned academy.
- Company-owned academy.
- Church-owned academy.
- NGO-owned academy.

### Academy Team Roles

Define:

- Primary owner.
- Co-owner.
- Administrator.
- Finance manager.
- Content manager.
- Tutor.
- Teaching assistant.
- Moderator.
- Support officer.

### Team Invitations

Academy owners should invite team members. Invitations should include:

- Email.
- Role.
- Scope.
- Expiry.
- Acceptance status.
- Inviting user.
- Workspace.

### Academy Staff Permissions

Academy owners should control academy-level staff permissions.

Academy Administrator may:

- Manage courses.
- Manage students.
- Manage staff.
- View academy analytics.

Finance Manager may:

- View sales.
- View earnings.
- Request payouts.
- Download financial reports.

Content Manager may:

- Create courses.
- Edit lessons.
- Upload resources.

Tutor may:

- Teach assigned courses.
- Host live classes.
- Review assignments.
- Message enrolled students.

Moderator may:

- Manage discussions.
- Review reports.
- Remove inappropriate content.

Platform permissions must remain separate from academy permissions. An academy owner must never gain access to another academy's private information.

---

## 16. Organization Architecture

Organizations represent structured entities that use Solva Academy for internal learning, external training, sponsored programs, or academy ownership.

### Organization Types

Support:

- Employer.
- Company.
- School.
- University.
- TVET.
- Government institution.
- NGO.
- Church.
- SACCO.
- Professional association.
- Training company.

### Organization Data

Organizations should include:

- Name.
- Type.
- Slug.
- Country.
- County.
- Industry.
- Logo.
- Billing details.
- Primary contact.
- Administrators.
- Members.
- Units or departments.
- Training needs.
- Workspace settings.
- Approval status.
- Subscription or plan where applicable.
- Reporting settings.

### Organization Membership

Members may include:

- Employees.
- Contractors.
- Interns.
- Volunteers.
- Students.
- External trainees.
- Managers.
- Trainers.
- Administrators.

Access should be scoped to the organization workspace.

---

## 17. Corporate Learning Workspaces

Organizations must have separate learning workspaces.

### Capabilities

Organization workspace capabilities should include:

- Add employees or learners.
- Create departments.
- Create teams.
- Assign courses.
- Create mandatory learning.
- Track completion.
- Set deadlines.
- View reports.
- Upload internal courses.
- Create onboarding journeys.
- Create compliance training.
- Issue internal certificates.
- Schedule Solco classes.
- Manage organization tutors.
- View learning analytics.

### Corporate Structure

The platform should support configurable structure:

Organization -> Branch -> Department -> Unit -> Team

Example:

Kenya Forest Service -> Headquarters -> Human Resource Management -> Payroll -> Payroll Processing Team

Organizations should configure their own structure. Do not hardcode organizational levels. Allow custom names and arbitrary depth within reasonable limits.

### Corporate User Management

Organizations should add learners through:

- Individual invitation.
- Bulk email invitation.
- CSV/Excel import.
- Employee number.
- Future Solva HR integration.
- API integration.
- Secure enrollment link.

The system should support active employees, contractors, interns, volunteers, students, and external trainees.

---

## 18. Parent and Child Learning

Solva Academy should support safe child learning without making unsupported legal assumptions. Country-specific child protection settings should be configurable in the future after jurisdiction review.

### Parent or Guardian Capabilities

A parent or guardian should:

- Create a child profile.
- Manage enrollment.
- Approve payments.
- View progress.
- View assignments.
- Receive updates.
- Manage communication permissions.
- Approve live class participation.
- Control profile visibility.

### Child Learner Protections

Child learners should have:

- Age-appropriate interface.
- Restricted communication.
- Safe discovery.
- Protected profile.
- No public personal contact information.
- No unrestricted private messaging.
- Controlled live class access.
- Report and block functions.

### Configurable Age Groups

Child age groups should be configurable by Super Admin. The platform should avoid hardcoded age assumptions until policy and jurisdiction review define them.

### Child Safety Settings

Configurable child safety settings may include:

- Parent approval requirements.
- Live class permission rules.
- Messaging restrictions.
- Community participation rules.
- Instructor verification requirements.
- Recording visibility.
- Report escalation rules.
- Profile visibility defaults.
- Search visibility defaults.

---

## 19. Instructor Verification

Instructor verification should be configurable and transparent.

### Verification Levels

Initial verification levels:

- Level 0: Unverified Applicant.
- Level 1: Identity Verified.
- Level 2: Qualification Verified.
- Level 3: Professional Experience Verified.
- Level 4: Solva Verified Instructor.
- Level 5: Expert Instructor.

### Verification Evidence

Verification may include:

- Document review.
- Identity review.
- Qualification review.
- Experience review.
- Sample lesson review.
- Background checks where legally appropriate.

### Verification Badge Rules

Badges must clearly explain what was verified. The platform should not imply that Solva guarantees every claim unless the relevant claim was specifically verified.

Example badge language should be precise:

- "Identity verified."
- "Qualification documents reviewed."
- "Sample lesson approved."
- "Solva Verified Instructor."

---

## 20. Reviewer Architecture

Course and academy review should be configurable by subject area and risk.

### Reviewer Types

Reviewer types may include:

- Course Reviewer.
- Subject Matter Reviewer.
- Quality Assurance Reviewer.
- Child Safety Reviewer.
- Legal or Compliance Reviewer.
- Finance or Tax Reviewer.
- Marketplace Product Reviewer.

### Category Examples

HR courses may require:

- HR professional.
- Labour law reviewer.
- Payroll reviewer.

Music courses may require:

- Music instructor.

Academic tutoring may require:

- Subject teacher.

Health courses may require:

- Qualified professional.

Finance courses may require:

- Accountant or tax expert.

### Reviewer Assignment Rules

Super Admin should assign reviewer requirements by:

- School.
- Category.
- Course type.
- Risk level.
- Age group.
- Certificate type.
- Marketplace product type.

---

## 21. Approval Workflows

Approval workflows should be configurable rather than hardcoded.

### Workflow Types

Create configurable workflows for:

- Instructor applications.
- Academy applications.
- Course publication.
- Course updates.
- Certificate templates.
- Marketplace products.
- Instructor payouts.
- Refund requests.
- Corporate account approval.
- Custom domain requests.

### Workflow Patterns

Support:

- One-step approval.
- Multi-step approval.
- Parallel approval.
- Sequential approval.
- Automatic approval for trusted users.
- Conditional approval.
- Changes requested.
- Escalation.

### Workflow Records

Each workflow request should track:

- Request type.
- Requester.
- Resource.
- Current status.
- Required steps.
- Assigned reviewers.
- Decisions.
- Comments.
- Evidence.
- Time submitted.
- Time resolved.
- Escalation status.
- Audit log link.

---

## 22. User Lifecycle

The user lifecycle should support normal growth, risk management, recovery, and privacy obligations.

### User Statuses

Lifecycle statuses:

- Invited.
- Registered.
- Email Unverified.
- Active.
- Limited.
- Under Review.
- Temporarily Suspended.
- Suspended.
- Deactivated.
- Archived.
- Deleted.
- Anonymized.

### Lifecycle Operations

Define:

- User activation.
- Account verification.
- Account recovery.
- Suspension.
- Appeal.
- Reactivation.
- Voluntary account closure.
- Data export.
- Data deletion.
- Data retention.
- Anonymization.

### Suspension and Appeal

Suspensions should include:

- Reason.
- Scope.
- Duration.
- Actor.
- Evidence.
- User notification.
- Appeal option where appropriate.
- Reinstatement conditions.

### Deletion and Anonymization

Deletion and anonymization must consider:

- Course records.
- Certificates.
- Payments.
- Legal retention.
- Child profiles.
- Organization reports.
- Audit logs.
- Marketplace purchases.
- Instructor payout records.

---

## 23. Trust and Safety

Trust and safety tools should be platform-wide.

### Reportable Subjects

Users should be able to report:

- Users.
- Courses.
- Academies.
- Messages.
- Reviews.
- Live classes.
- Marketplace products.
- Certificates.
- Payments or suspected fraud.

### Safety Workflows

The platform should support:

- Reporting users.
- Reporting courses.
- Reporting academies.
- Reporting messages.
- Reporting reviews.
- Blocking users.
- Content moderation.
- Instructor misconduct review.
- Academic integrity review.
- Child safety escalation.
- Fraud review.
- Payment dispute review.

### Report Fields

Reports should include:

- Category.
- Description.
- Evidence.
- Reporter.
- Subject.
- Priority.
- Status.
- Assigned reviewer.
- Resolution.
- Appeal.

### Moderation Statuses

Moderation statuses may include:

- Submitted.
- Triaged.
- Under Review.
- Escalated.
- Action Taken.
- No Violation Found.
- Resolved.
- Appealed.
- Closed.

---

## 24. Privacy

Privacy should be user-controlled and role-aware.

### User Controls

Users should control:

- Public profile visibility.
- Certificate visibility.
- Skill visibility.
- Course activity visibility.
- Academy membership visibility.
- Learning progress visibility.
- Employer visibility.
- Search visibility.
- Direct message permissions.

### Organization Access Boundaries

Organizations must only see information they are authorized to access. For example, an employer may see progress for courses assigned through the organization workspace but should not automatically see a user's personal learning outside the organization.

### Academy Access Boundaries

Academy owners should only see relevant learner information for their academy. They should not see unrelated learner activity, private profile data, or other academy memberships unless the user has made that information public.

### Child Privacy Defaults

Child profiles should default to protected visibility. Public discovery should be disabled unless a later policy explicitly allows specific safe cases.

---

## 25. Support Access

Platform support may need temporary access to help users, but uncontrolled impersonation is dangerous.

### Secure Support Access

Support access should include:

- User consent where possible.
- Time-limited access.
- Reason required.
- Visible indicator.
- Audit log.
- Restricted sensitive actions.
- No access to passwords.
- No silent financial actions.
- No hidden certificate or payout changes.

### View As

The Founding Super Admin and authorized platform testers may use "View As" for testing. All such sessions must be auditable and visually marked.

### Restricted Actions During Support Access

Support access should block or require elevated approval for:

- Password changes.
- Payment method changes.
- Payout method changes.
- Certificate revocation.
- Role assignment.
- Child safety setting changes.
- Organization billing changes.
- Deleting user data.

---

## 26. Audit Architecture

Audit logs are a core security and governance requirement.

### Events to Log

Log:

- Sign-ins.
- Failed sign-ins where useful.
- Role changes.
- Permission changes.
- Workspace changes.
- Academy approvals.
- Instructor approvals.
- Course approvals.
- User suspensions.
- Payout approvals.
- Certificate issuance.
- Certificate revocation.
- Support access.
- Sensitive data changes.

### Audit Fields

Audit logs should include:

- Actor.
- Action.
- Resource.
- Previous value.
- New value.
- Date.
- Time.
- IP/device information where legally appropriate.
- Reason.
- Workspace.
- Tenant.
- Request ID or correlation ID.

### Audit Access

Audit logs should be visible only to authorized roles. Sensitive audit records should have additional access controls.

---

## 27. Admin Configuration

Super Admin should configure identity, role, school, academy, organization, safety, and approval rules.

### Configurable Items

Super Admin should configure:

- Registration methods.
- Required profile fields.
- Instructor application fields.
- Academy application fields.
- Organization application fields.
- Roles.
- Permissions.
- Approval workflows.
- Schools.
- Categories.
- Verification levels.
- Age groups.
- Child safety rules.
- Profile visibility defaults.
- Account status rules.
- Invitation expiry.
- Session duration.
- MFA requirements.
- Password policies.
- Trusted instructor rules.
- Reviewer requirements.

### Configuration Governance

Configuration changes should be:

- Permission-protected.
- Validated.
- Audited.
- Reversible where practical.
- Tested in draft mode for high-risk workflows.

Avoid hardcoding.

---

## 28. Multi-Tenant Security

Solva Academy must enforce strict tenant isolation.

### Academy Isolation

Academies must not access:

- Other academies' private students.
- Other academies' earnings.
- Other academies' drafts.
- Other academies' internal analytics.
- Other academies' staff records.
- Other academies' private course review comments.

### Organization Isolation

Organizations must not access:

- Other organizations' employees.
- Other organizations' learning data.
- Other organizations' reports.
- Other organizations' billing details.
- Other organizations' internal courses.

### Technical Controls

Use:

- Tenant IDs.
- Workspace IDs.
- Role assignments.
- Permission scopes.
- Row Level Security.
- Server-side authorization.
- Audit logging.
- Least-privilege database policies.
- Secure file access controls.

Do not rely only on frontend hiding.

### File and Media Isolation

Private files should respect tenant boundaries:

- Course drafts.
- Assignment submissions.
- Instructor documents.
- Organization reports.
- Child learner files.
- Payout documents.
- Verification documents.

Signed URLs should be time-limited and authorization-aware.

---

## 29. Conceptual Data Model

This chapter introduces conceptual entities only. SQL and physical schema design should come later.

### Core Identity Entities

- `users`: Authenticated account owner.
- `profiles`: User profile and display information.
- `identities`: Linked identity providers such as email, Google, phone, or future Solva SSO.
- `user_preferences`: Notification, accessibility, privacy, and interface preferences.

### Role and Permission Entities

- `roles`: Configurable role definitions.
- `permissions`: Granular permission definitions.
- `role_permissions`: Permission bundles assigned to roles.
- `user_role_assignments`: User role assignments with scope and expiry.

### Workspace Entities

- `workspaces`: Contexts such as platform admin, personal learning, academy, or organization.
- `workspace_members`: Users who belong to workspaces.
- `workspace_roles`: Roles scoped to a workspace.

### Learning Classification Entities

- `schools`: Top-level learning classifications.
- `categories`: Taxonomy categories.
- `subjects`: Subject-level groupings.
- `skills`: Skills taught, assessed, or certified.
- `tags`: Flexible discovery labels.

### Academy Entities

- `academies`: Academy records.
- `academy_members`: Academy staff and member roles.
- `academy_applications`: Academy application workflow records.

### Instructor Entities

- `instructor_profiles`: Professional instructor details.
- `instructor_applications`: Instructor application records.
- `instructor_verifications`: Verification level and evidence records.

### Organization Entities

- `organizations`: Organization accounts.
- `organization_members`: Organization users and roles.
- `organization_units`: Configurable branches, departments, units, and teams.

### Workflow and Governance Entities

- `invitations`: User, academy, and organization invitations.
- `approval_workflows`: Configurable workflow definitions.
- `approval_steps`: Steps within workflows.
- `approval_requests`: Active or historical approval records.
- `moderation_reports`: Trust and safety reports.
- `user_blocks`: User-level blocking records.
- `support_access_sessions`: Time-limited support or view-as sessions.
- `audit_logs`: Immutable or append-only audit events.

### Ownership Boundaries

Relationships should enforce:

- Users can belong to many workspaces.
- Workspaces can belong to academies, organizations, platform administration, or personal contexts.
- Roles can be assigned globally or scoped.
- Academies own their private academy data.
- Organizations own their private organization data.
- Schools classify content but do not automatically own learner data.
- Approval workflows govern sensitive transitions.
- Audit logs record sensitive changes across all tenants.

---

## 30. Risks and Mitigations

### Risk: Role Confusion

Users with many roles may accidentally act in the wrong context.

Mitigation:

- Clear role and workspace switcher.
- Active context indicator.
- High-risk confirmations.
- Separate dashboards.
- Audit logs.

### Risk: Permission Sprawl

Highly granular permissions can become hard to manage.

Mitigation:

- Permission groups.
- Role templates.
- Clear naming conventions.
- Permission dependencies.
- Admin UI warnings for risky combinations.

### Risk: Tenant Data Leakage

Academy or organization data could leak if authorization is weak.

Mitigation:

- Row Level Security.
- Server-side authorization.
- Workspace and tenant IDs.
- Security tests.
- Audit logging.
- Least-privilege design.

### Risk: Founding Admin Lockout

The founding account could be accidentally demoted, suspended, or deleted.

Mitigation:

- Protected database-backed role assignment.
- Guarded destructive operations.
- Re-authentication for high-risk changes.
- Recovery safeguards.
- Audit logs.

### Risk: Child Safety Failure

Child-facing learning introduces serious trust and safety obligations.

Mitigation:

- Parent-controlled child profiles.
- Restricted messaging.
- Safe discovery.
- Verified child-facing instructors.
- Child safety escalation.
- Configurable age groups.
- Country-specific policy readiness.

### Risk: Over-Hardcoding Early Decisions

Hardcoded roles, schools, categories, workflows, or age groups would limit growth.

Mitigation:

- Admin-configurable taxonomy.
- Configurable roles and permissions.
- Configurable workflows.
- Configurable profile and application fields.

### Risk: Support Access Abuse

Uncontrolled impersonation could violate privacy and trust.

Mitigation:

- Time-limited access.
- Reason required.
- Visible indicator.
- Audit logs.
- Restricted sensitive actions.

---

## 31. Acceptance Criteria

Chapter 2 should be considered satisfied when product, design, engineering, security, and QA teams can agree that the platform foundation supports the following:

- One account can hold multiple roles.
- A user can switch roles without logging out.
- Role and workspace are clearly separate.
- Timothy Sila's founding Super Admin account is protected beyond frontend email checks.
- Authentication supports first-release needs and future Solva SSO readiness.
- Learner, parent, instructor, academy owner, and organization registration flows are defined.
- Profile data is separated into private, public, professional, financial, child-related, and administrative areas.
- Roles are configurable and protected roles have safeguards.
- Permissions are granular and scoped.
- Schools and taxonomy are configurable.
- Academies are treated as learning businesses.
- Academy creation has a review workflow.
- Academy staff permissions are scoped to the academy.
- Organizations have separate workspaces and configurable structures.
- Parent and child learning safety is addressed.
- Instructor verification levels are defined.
- Reviewer requirements can vary by school, category, course type, and risk.
- Approval workflows are configurable.
- User lifecycle statuses are defined.
- Trust and safety reporting is defined.
- Privacy controls are defined.
- Support access is controlled and audited.
- Audit logging covers sensitive events.
- Multi-tenant security is explicit.
- Conceptual data entities are introduced without writing SQL.

---

## 32. Dependencies for Later Chapters

Later chapters should build on this chapter by defining:

- Full database schema and RLS policy design.
- Detailed user journeys and screen-level UX.
- Course, module, lesson, assessment, and certificate architecture.
- Payment, wallet, revenue share, refund, and payout architecture.
- AI tutor and AI course builder rules.
- Solco live classroom integration.
- Marketplace product architecture.
- Corporate learning reports and analytics.
- Child safety policy and country-specific compliance settings.
- Notification templates and communication preferences.
- Search, discovery, recommendations, and homepage configuration.
- Mobile app and offline learning architecture.
- QA test plans for permissions and tenant isolation.
- Operational playbooks for support, moderation, appeals, and incidents.

---

## 33. Final Recommendations

Solva Academy should treat identity, roles, permissions, workspaces, and tenants as foundational product architecture, not secondary admin features.

The most important decisions are:

- Use one account with multiple roles.
- Keep role, permission, and workspace separate.
- Protect the founding Super Admin account with database-backed safeguards.
- Build configurable roles, permissions, schools, categories, workflows, age groups, and verification rules.
- Enforce tenant isolation with Row Level Security, server-side authorization, and audit logs.
- Make academies full learning businesses with their own teams, public pages, courses, live classes, communities, certificates, marketplace products, and earnings.
- Give organizations private learning workspaces with flexible structures and reporting.
- Design child learning with safety and parent oversight from the beginning.
- Prepare for future Solva SSO without blocking the first release.

This chapter gives Solva Academy the operating foundation needed to become a trusted Kenyan-first and Africa-ready learning ecosystem where learners, instructors, academies, employers, institutions, and the wider Solva ecosystem can grow together without losing security, flexibility, or trust.

