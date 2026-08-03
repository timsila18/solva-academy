# Solva Academy Master Product Blueprint

## Chapter 6: Enterprise Learning, Employer Adoption, Corporate Academies, Compliance Training, Workforce Development, Schools, Churches, NGOs, Government, and Institutional Learning

**Platform name:** Solva Academy  
**Repository / project name:** `solva-academy`  
**Production domain:** `academy.solvaone.co.ke`  
**Parent ecosystem:** SolvaOne / Solva Business Group  
**Main SolvaOne platform:** `solvaone.co.ke`  
**Chapter status:** Product and system blueprint only. No production code.

---

## 1. Executive Summary

Solva Academy should serve institutions as an affordable learning operating system, not merely a bulk course purchasing tool. Chapters 1 through 5 established Solva Academy as a standalone learning ecosystem with identity, academies, curriculum, learner experience, instructors, revenue, and academy operations. Chapter 6 defines how employers, companies, schools, universities, TVETs, NGOs, churches, SACCOs, government agencies, professional associations, and other institutions adopt and use the platform.

The institutional experience should support:

**Assess -> Assign -> Learn -> Practice -> Verify -> Report -> Improve**

Institutions should use Solva Academy to answer:

- What skills do our people need?
- Which employees need training?
- What training is mandatory?
- Who has completed it?
- Who is struggling?
- What competencies have been demonstrated?
- What certifications are expiring?
- Is training improving performance?
- What does training cost?
- Which Solva tools can help staff apply what they learned?
- How can we train staff affordably without building our own learning platform?

This chapter defines enterprise subscriptions, onboarding, organization workspaces, structures, roles, learner imports, assignments, automated rules, corporate learning paths, compliance, internal academies, policy acknowledgement, Solco enterprise training, practice labs, skills frameworks, reporting, billing, institutional use cases, integrations, adoption, retention, admin configuration, and conceptual data entities.

---

## 2. Enterprise Learning Philosophy

Enterprise learning should help organizations develop people affordably and practically. It should combine training content, internal learning operations, live classes, compliance tracking, skills visibility, reporting, and practical labs.

The platform must remain affordable for:

- Micro-businesses.
- Small businesses.
- Medium-sized companies.
- Large employers.
- Schools.
- Churches.
- NGOs.
- SACCOs.
- County governments.
- National government institutions.
- Professional bodies.
- Training firms.

Enterprise features should not be limited to large companies. A small restaurant, church, SACCO, county department, school, or NGO program should be able to use Solva Academy without needing a custom enterprise LMS project.

---

## 3. Institutional Customer Types

Institution type must be administrator-configurable.

Initial supported customer types:

1. Micro-business.
2. Small business.
3. Medium enterprise.
4. Large enterprise.
5. Corporate group.
6. Franchise.
7. Government ministry.
8. State corporation.
9. County government.
10. Constitutional commission.
11. Public institution.
12. NGO.
13. International development organization.
14. Church.
15. Ministry organization.
16. SACCO.
17. Cooperative.
18. CBO.
19. Professional association.
20. Training company.
21. Primary school.
22. Secondary school.
23. College.
24. TVET institution.
25. University.
26. Private academy.
27. Hospital or healthcare institution.
28. Hospitality business.
29. Manufacturing company.
30. Retail business.

Each type may have different onboarding, terminology, billing, reporting, compliance, and hierarchy needs.

---

## 4. Enterprise Value Proposition

Solva Academy should offer institutions clear benefits:

- Affordable staff training.
- Faster onboarding.
- Mandatory compliance tracking.
- Skills gap visibility.
- Internal academy creation.
- Reduced trainer and travel costs.
- Centralized certificates.
- Live Solco classes.
- Reusable training content.
- Department-specific learning paths.
- Progress reporting.
- Practical training labs.
- Integration with Solva HR.
- Integration with other Solva products.
- Automated reminders.
- Renewal tracking.
- Employee development plans.
- Talent identification.
- Employer-branded learning.
- Mobile-first delivery.

The platform should position enterprise learning as a practical operational tool, not a luxury HR add-on.

---

## 5. Subscription Philosophy

Enterprise pricing must be flexible and affordable for Kenyan institutions. Pricing must be configurable by Super Admin and final prices should not be hardcoded.

### Supported Pricing Models

Support:

- Free trial.
- Pay per active learner.
- Pay per assigned seat.
- Pay per completed course.
- Monthly organization subscription.
- Annual organization subscription.
- Department package.
- Course bundle package.
- Compliance package.
- Custom enterprise package.
- Sponsored organization package.
- NGO-funded package.
- Government framework agreement.
- Church or community package.
- School package.

### Recommended Initial Positioning

Initial bands may include:

- Micro Employer: Up to 10 learners.
- Small Employer: 11-50 learners.
- Growing Employer: 51-150 learners.
- Medium Employer: 151-500 learners.
- Large Employer: 501-2,000 learners.
- Enterprise: More than 2,000 learners.

### Billing Definitions

The system should distinguish:

- **Active learners:** Users currently counted for subscription or usage billing.
- **Invited learners:** Users invited but not yet activated; may be free or partially counted based on plan.
- **Archived learners:** Historical users retained for records; should not usually count as active seats.
- **External trainees:** Non-employees included in training; may count differently depending on contract.

Billing rules must be visible and auditable.

---

## 6. Organization Onboarding

Organization onboarding should be guided and adaptable.

### Suggested Flow

1. Organization creates account.
2. Selects organization type.
3. Adds organization details.
4. Selects workforce or learner size.
5. Identifies training goals.
6. Chooses subscription or requests quotation.
7. Adds organization logo and branding.
8. Creates departments or organizational units.
9. Invites administrators.
10. Imports learners or employees.
11. Selects public courses.
12. Creates internal courses where permitted.
13. Builds onboarding or compliance paths.
14. Assigns courses.
15. Schedules Solco sessions.
16. Launches workspace.
17. Tracks adoption.

### Assisted Onboarding

Solva Academy should offer optional assisted onboarding for organizations that need help importing learners, configuring departments, setting up compliance paths, or training administrators.

---

## 7. Institutional Workspace

Each organization should receive a dedicated workspace.

### Main Navigation

Workspace navigation should include:

- Overview.
- People.
- Departments.
- Teams.
- Courses.
- Learning Paths.
- Assignments.
- Live Training.
- Internal Academy.
- Skills.
- Certificates.
- Compliance.
- Reports.
- Trainers.
- Content Library.
- Billing.
- Integrations.
- Settings.
- Support.

### Branding

The workspace should be branded with:

- Organization name.
- Logo.
- Brand colours where allowed.
- Welcome message.
- Internal announcements.
- Help contacts.

Branding should never obscure Solva Academy’s platform identity, support obligations, or safety controls.

---

## 8. Organizational Structure

Organization structure must be configurable and not hardcoded.

### Flexible Hierarchy

Support configurable structures such as:

Organization -> Region -> Branch -> Directorate -> Department -> Division -> Section -> Unit -> Team

### Examples

Company:

- Company -> Branch -> Department -> Team.

Government:

- Institution -> Directorate -> Department -> Division -> Section.

Church:

- Church -> Campus -> Ministry -> Department -> Cell.

School:

- School -> Level -> Class -> Stream.

NGO:

- Organization -> Program -> Project -> Field Office -> Team.

Support multiple reporting lines where needed, such as one employee belonging to a department and also a project team.

---

## 9. Enterprise Roles and Permissions

Organization-scoped roles should be configurable and permission-based.

### Initial Roles

Support:

- Organization Owner.
- Organization Administrator.
- Learning Administrator.
- HR Manager.
- Training Manager.
- Department Manager.
- Team Leader.
- Corporate Trainer.
- Internal Instructor.
- Content Creator.
- Course Approver.
- Compliance Officer.
- Finance/Billing Manager.
- Report Viewer.
- Learner.
- External Trainee.
- Auditor.
- Executive Viewer.

### Permission Principles

Roles should be scoped to organization, unit, department, team, assignment, report, billing, or content area. Billing roles and learning roles should be separable.

---

## 10. Learner Import

Organizations should add learners through multiple methods.

### Import Methods

Support:

- Manual creation.
- Individual invitation.
- Bulk email invitation.
- Excel import.
- CSV import.
- Employee number.
- Payroll number.
- Phone number.
- Secure invitation link.
- API.
- Future Solva HR synchronization.
- Future HRIS integration.

### Validation

Import validation should detect:

- Duplicate email.
- Duplicate employee number.
- Invalid phone.
- Missing department.
- Conflicting role.
- Previously archived learner.
- Existing personal Solva account.

One person should not require a duplicate account when joining an employer workspace.

---

## 11. Personal and Employer Learning Separation

A learner may have both personal Solva Academy learning and employer-assigned learning.

### Employer-Visible Data

Employers may see authorized data such as:

- Assigned course progress.
- Mandatory training.
- Completion.
- Assessment results where authorized.
- Attendance.
- Certification.
- Deadline status.
- Required skills.

### Private Personal Learning

Employers must not automatically access:

- Personal courses.
- Personal searches.
- Personal career interests.
- Personal AI conversations.
- Private communities.
- Personal marketplace purchases.

The user interface must clearly separate corporate workspace learning from personal learning.

---

## 12. Assignment Engine

Organizations should assign learning objects to people or groups.

### Assignable Objects

Organizations should assign:

- Single course.
- Course bundle.
- Learning path.
- Assessment.
- Live session.
- Practice lab.
- Policy acknowledgement.
- Internal document.
- Refresher training.
- Certification renewal.

### Assignment Targets

Assignments may target:

- Individual.
- Team.
- Department.
- Branch.
- Job title.
- Role.
- Grade.
- Location.
- Employment type.
- Entire organization.
- Custom learner group.

---

## 13. Automated Assignment Rules

Organizations should configure explainable automated assignment rules.

### Assignment Rule Fields

Each assignment should support:

- Start date.
- Due date.
- Priority.
- Mandatory or optional.
- Passing score.
- Attempt limit.
- Attendance requirement.
- Manager review.
- Completion approval.
- Certificate.
- Renewal period.
- Grace period.
- Reminder schedule.
- Escalation path.
- Exemption rules.
- Evidence upload.
- Notes.

### Assignment Statuses

Statuses:

- Not Assigned.
- Assigned.
- Not Started.
- In Progress.
- Completed.
- Passed.
- Failed.
- Overdue.
- Exempted.
- Waived.
- Cancelled.
- Renewal Due.

### Automation Examples

Examples:

- Assign onboarding path when a new employee joins.
- Assign supervisor training when someone becomes a manager.
- Assign annual compliance training every January.
- Assign refresher training 30 days before certificate expiry.
- Assign branch-specific safety training.
- Assign Solva HR training when a user receives payroll access.
- Assign Solva POS training when a cashier is added.
- Assign SolvaFlow training when a sales executive joins.
- Assign child safeguarding course to tutors working with children.

Rules should be auditable, previewable, and explainable.

---

## 14. Corporate Learning Paths

Organizations should build their own learning paths using public and internal learning objects.

### Examples

- New Employee Onboarding.
- New Manager Onboarding.
- Supervisor Essentials.
- HR Officer Development.
- Payroll Officer Certification.
- Customer Service Excellence.
- Workplace Safety.
- Data Protection.
- Anti-Harassment.
- Ethics and Integrity.
- Cybersecurity Awareness.
- Leadership Development.
- Sales Team Development.
- Branch Manager Development.
- Restaurant Staff Training.
- Manufacturing Staff Training.
- Church Worker Orientation.
- NGO Field Officer Onboarding.

### Path Contents

Paths may include:

- Public Solva courses.
- Purchased courses.
- Internal courses.
- Live Solco sessions.
- Policies.
- Assignments.
- Acknowledgements.
- Practical labs.

---

## 15. Compliance Training

Compliance programs should track training completion without overclaiming legal compliance.

### Supported Programs

Support compliance programs including:

- Workplace safety.
- Data protection.
- Anti-harassment.
- Ethics.
- Anti-corruption.
- Cybersecurity.
- Financial controls.
- Safeguarding.
- Internal policies.
- Code of conduct.
- Procurement procedures.
- Payroll controls.
- Industry-specific compliance.

The platform must not claim legal compliance merely because a learner completed a course. Reports should show training completion, not guarantee organizational compliance.

---

## 16. Policy Acknowledgement

Organizations should upload policies and require acknowledgement.

### Learner Actions

Users may be required to:

- Read.
- Watch explanation.
- Ask questions.
- Confirm understanding.
- Acknowledge policy.
- Complete quiz.
- Add digital confirmation.
- Download copy.

### Tracking

Track:

- Policy version.
- Date assigned.
- Date acknowledged.
- User.
- IP/device where legally appropriate.
- Re-acknowledgement requirement.

Policy acknowledgements must be audit-ready.

---

## 17. Internal Academy Builder

Organizations should create private branded internal academies.

### Examples

- KFS Learning Academy.
- Robot Cafe Training Academy.
- Safa Dairy Academy.
- Church Leadership Academy.
- NGO Field Operations Academy.

### Internal Academy Features

Features:

- Organization branding.
- Private course catalogue.
- Internal instructors.
- Staff onboarding.
- Internal communities.
- Live classes.
- Policy library.
- Department learning paths.
- Internal certificates.
- Organization announcements.
- Restricted content.
- Internal analytics.

Organizations may optionally publish approved courses to the public marketplace, subject to review and commercial terms.

---

## 18. Internal Course Builder

Authorized organization users should create internal learning content.

### Course Types

Internal courses may include:

- Onboarding lessons.
- Policy training.
- Process training.
- Product training.
- Department procedures.
- Equipment training.
- Branch operations.
- Internal leadership courses.
- Customer service courses.
- Compliance refreshers.

### Visibility

Internal courses may be:

- Private.
- Organization-wide.
- Department-only.
- Branch-only.
- Role-based.
- Time-limited.
- Confidential.

---

## 19. Content Library

Organizations should maintain reusable training content.

### Content Types

The content library may contain:

- Videos.
- PDFs.
- Policies.
- Manuals.
- SOPs.
- Presentations.
- Quizzes.
- Templates.
- Checklists.
- Assessments.
- Recorded Solco sessions.
- Case studies.

### Controls

Support:

- Versioning.
- Ownership.
- Access controls.
- Expiry.
- Review date.
- Content approver.
- Reuse across courses.

---

## 20. Solco Enterprise Training

Solco should power live institutional learning.

### Session Types

Organizations should schedule:

- Onboarding sessions.
- Town halls.
- Live training.
- Department workshops.
- Coaching.
- Leadership sessions.
- Compliance briefings.
- Question-and-answer sessions.
- External facilitator sessions.

### Integration Features

Solco integration should support:

- Organization-branded rooms.
- Attendance.
- Recording.
- Polls.
- Breakout rooms.
- AI notes.
- Session summary.
- Follow-up assignment.
- Calendar invitation.
- Manager reports.

---

## 21. Enterprise Practice Labs

Practice labs should help organizations apply learning through Solva tools and realistic scenarios.

### Solva HR Labs

- Payroll processing.
- Recruitment.
- Leave administration.
- Performance appraisal.
- Employee records.
- Disciplinary workflows.

### Solva POS Labs

- Cashier onboarding.
- Order processing.
- Receipt generation.
- Stock control.
- Waiter performance.

### SolvaFlow Labs

- Sales field reporting.
- Dispatch.
- Delivery.
- Customer receipt.
- Payment confirmation.

### SolvaOne Labs

- Business plan creation.
- Proposal writing.
- CV preparation.
- Company profiles.
- Professional documents.

### Solco Labs

- Remote collaboration.
- Meeting facilitation.
- Presentation.
- Virtual onboarding.

Labs should create genuine practical value and naturally encourage Solva product adoption.

---

## 22. Ethical Solva Product Adoption

Courses may introduce Solva products where they solve a genuine learner or employer problem.

### Good Use

Examples:

- After payroll training, offer a Solva HR practice environment.
- After recruitment training, demonstrate the Solva HR recruitment module.
- After restaurant operations training, demonstrate Solva POS.
- After manufacturing workflow training, demonstrate SolvaFlow.
- After business planning, help learners create a plan in SolvaOne.
- For live learning, use Solco.

### Avoid

Do not:

- Hide course completion behind unrelated product purchases.
- Mislead learners into believing Solva products are legally mandatory.
- Replace educational value with advertisements.
- Prevent learners from understanding industry concepts independently of Solva tools.

Clearly distinguish educational content, product lab, optional trial, and paid product subscription.

---

## 23. Enterprise Skills Framework

Organizations should define skills and competencies that connect learning to work.

### Skills Objects

Organizations should define:

- Skills.
- Competencies.
- Required proficiency.
- Job role skill profiles.
- Department skill needs.
- Critical skills.
- Future skills.
- Expiring certifications.

### Skill Levels

Skill levels:

- Awareness.
- Basic.
- Working.
- Proficient.
- Advanced.
- Expert.

Skills may be linked to courses, assessments, projects, certifications, practice labs, manager verification, and tutor verification.

---

## 24. Skills Gap Analysis

Skills gap analysis should compare required and demonstrated capability.

### Inputs

Compare:

- Required skills.
- Demonstrated skills.
- Self-assessed skills.
- Manager-assessed skills.
- Training completed.
- Assessment performance.

### Outputs

Outputs:

- Individual skills gap.
- Team skills gap.
- Department skills gap.
- Organization skills gap.
- Recommended courses.
- Recommended practice.
- Priority training plan.

Do not present AI-inferred skills as verified facts.

---

## 25. Employee Development Plans

Managers and employees should collaboratively create development plans.

### Plan Contents

Plans may include:

- Career goal.
- Skills to develop.
- Courses.
- Coaching.
- Practice tasks.
- Projects.
- Target dates.
- Manager support.
- Progress reviews.
- Completion evidence.

Employees should participate in creating their plans. Avoid purely top-down development planning.

---

## 26. Manager Dashboard

Managers need actionable team learning visibility.

### Manager View

Managers should see:

- Team learning status.
- Mandatory training.
- Overdue assignments.
- Upcoming sessions.
- Skills gaps.
- Certificates expiring.
- Completion rates.
- Assessment results where permitted.
- Development plans.
- Team achievements.
- Learners needing support.

Managers should not access unrelated private learner activity.

---

## 27. Executive Dashboard

Executives need high-level insight, not lesson-level detail.

### Executive Metrics

Executives should see:

- Organization learning adoption.
- Compliance completion.
- Training investment.
- Workforce skills.
- Risk areas.
- Department comparison.
- Leadership pipeline.
- Employee development.
- Active learners.
- Course completion.
- Certificate expiry exposure.
- Platform usage.
- Solva product practice adoption.
- Estimated training savings.

The dashboard should support strategic decisions and board-level reporting.

---

## 28. Compliance Dashboard

Compliance officers need audit-ready status and evidence.

### Compliance View

Show:

- Required training.
- Assigned learners.
- Completed.
- Overdue.
- Failed.
- Exemptions.
- Certificates.
- Renewal dates.
- Policy acknowledgements.
- Audit trail.
- Branch or department compliance.
- Evidence exports.

Reports must clearly show report date and data coverage.

---

## 29. Reports

Enterprise reporting should be flexible and exportable.

### Report Types

Support:

- Assignment report.
- Completion report.
- Assessment report.
- Attendance report.
- Overdue training report.
- Skills report.
- Certificate report.
- Expiry report.
- Policy acknowledgement report.
- Department performance.
- Branch performance.
- Learning hours.
- Course utilization.
- Cost report.
- Subscription usage.
- Trainer performance.
- Learner engagement.
- Skills gap report.
- Development plan report.
- Audit report.

### Export

Export as:

- PDF.
- Excel.
- CSV.
- Print.
- Scheduled email.

---

## 30. Training Effectiveness

Training effectiveness should be careful and explainable.

### Metrics

Track:

- Completion.
- Assessment improvement.
- Skill demonstration.
- Reduced onboarding time.
- Reduced external training cost.
- Reduced travel cost.
- Increased policy acknowledgement.
- Higher manager satisfaction.
- Learner confidence.
- Voluntary performance outcome reporting.
- Product practice completion.

Do not claim that training directly caused business performance unless supported by proper evidence.

---

## 31. Notifications and Escalations

Enterprise notifications should support learning operations.

### Notifications

Support reminders for:

- New assignment.
- Due date.
- Overdue training.
- Live session.
- Manager review.
- Certificate expiry.
- Policy update.
- Course version update.
- Compliance escalation.
- Subscription limit.
- Billing.
- New employee onboarding.

### Escalation Hierarchy

Escalation hierarchy may be:

Learner -> Team Leader -> Manager -> HR/Learning Manager -> Organization Administrator

This hierarchy must be configurable.

---

## 32. Employer Marketplace

Organizations should browse suitable courses through an employer-focused marketplace.

### Discovery Filters

Browse by:

- Industry.
- Department.
- Role.
- Skill.
- Compliance need.
- Price.
- Duration.
- Language.
- Delivery mode.
- Instructor.
- Academy.
- Rating.
- Corporate suitability.

### Actions

Support:

- Course comparison.
- Request demonstration.
- Request quotation.
- Bulk seat purchase.
- Group discount.
- Custom training request.
- Private cohort.
- Academy inquiry.

---

## 33. Custom Corporate Training

Organizations should request custom programs.

### Request Fields

Collect:

- Organization.
- Training need.
- Number of learners.
- Job roles.
- Current challenge.
- Desired outcome.
- Preferred delivery mode.
- Location.
- Dates.
- Budget.
- Reporting requirements.
- Certification requirements.
- Need for customization.

### Workflow

Workflow:

- Request submitted.
- Platform or academy reviews.
- Discovery session.
- Proposal.
- Negotiation.
- Acceptance.
- Program setup.
- Delivery.
- Reporting.
- Evaluation.

---

## 34. School Use

Schools should use Solva Academy for academic support, digital learning, revision, live classes, and parent visibility.

### School Capabilities

Schools should be able to:

- Create classes.
- Add students.
- Add teachers.
- Assign lessons.
- Conduct revision.
- Host live classes.
- Track progress.
- Issue internal certificates.
- Communicate with parents.
- Run holiday programs.
- Sell public tutoring courses.
- Manage school clubs.
- Share learning resources.

Support grade, class, stream, subject, term, and academic year as configurable structures.

---

## 35. Parent-School Experience

Where enabled, parents should receive controlled visibility into school-linked learning.

Parents should see:

- Assigned learning.
- Progress.
- Attendance.
- Teacher comments.
- Upcoming Solco classes.
- Assignments.
- Results.
- Certificates.
- Payments.
- Announcements.

Protect child privacy and never expose other learners’ information.

---

## 36. University and TVET Use

Universities and TVETs should use Solva Academy for practical, professional, and continuing learning.

### Use Cases

Support:

- Short professional courses.
- Skills modules.
- Continuing education.
- Industry certification.
- Student orientation.
- Alumni learning.
- Lecturer-created content.
- Industry partnerships.
- Internship readiness.
- Employability learning paths.
- Practical Solva labs.

Do not position Solva credentials as formal academic awards unless the correct accreditation exists.

---

## 37. Church Learning

Churches should use the platform for ministry, leadership, and community learning.

### Use Cases

Churches may use Solva Academy for:

- New believer classes.
- Foundation classes.
- Leadership development.
- Workers training.
- Children’s ministry training.
- Marriage classes.
- Ministry department training.
- Cell leader development.
- Bible study.
- Volunteer onboarding.
- Safeguarding training.

Allow churches to customize course names and program structures. Support free, paid, sponsored, or donation-supported programs.

---

## 38. NGO Use

NGOs and development organizations should manage both staff learning and beneficiary training.

### NGO Capabilities

NGOs should be able to:

- Train staff.
- Train volunteers.
- Train beneficiaries.
- Run grant-funded learning programs.
- Sponsor courses.
- Track attendance.
- Collect outcomes.
- Manage cohorts.
- Issue certificates.
- Produce donor reports.
- Support low-data users.
- Operate across counties or countries.

Support anonymous or minimal-data beneficiary accounts where appropriate.

---

## 39. SACCO Use

SACCOs and cooperatives may use the platform for member and staff education.

### Use Cases

Support:

- Member education.
- Financial literacy.
- Governance training.
- Board induction.
- Staff training.
- Loan education.
- Entrepreneurship.
- Digital safety.
- Cooperative management.

Allow membership-based enrollment and sponsored training.

---

## 40. Government Use

Government and public institutions may use Solva Academy for workforce and citizen learning.

### Government Use Cases

Support:

- Employee onboarding.
- Policy implementation.
- Ethics.
- Public service training.
- Cybersecurity awareness.
- Payroll training.
- HRIS training.
- Leadership.
- Technical training.
- County workforce development.
- Citizen training programs.

### Requirements

Government usage may require:

- Strong audit logs.
- Data isolation.
- Role controls.
- Approval workflows.
- Official reports.
- Procurement-ready quotations.
- Enterprise support.
- Future private-cloud or dedicated deployment consideration.

Do not promise government compliance certifications without validation.

---

## 41. Professional Associations and CPD

Professional associations can use the platform for member learning and credential tracking.

### Association Capabilities

Associations should:

- Publish approved courses.
- Assign CPD points where legally authorized.
- Track members.
- Verify completion.
- Issue credentials.
- Manage annual requirements.
- Approve instructors.
- Review content.
- Receive reports.

CPD claims and points must only be enabled where the association has authority.

---

## 42. Sponsored Institutional Learning

Sponsors may fund institutional learning programs.

### Sponsor Targets

Sponsors may fund:

- Organizations.
- Departments.
- Youth groups.
- Schools.
- Churches.
- NGOs.
- Counties.
- Professional cohorts.

### Sponsor Dashboard

Sponsor dashboard may show:

- Beneficiaries.
- Enrollment.
- Completion.
- Learning hours.
- Certificates.
- Aggregate outcomes.
- Budget usage.

Protect individual privacy.

---

## 43. Enterprise Billing

Enterprise billing should support subscriptions, usage, invoices, and local payment realities.

### Billing Methods

Support:

- Monthly billing.
- Annual billing.
- Seat-based billing.
- Active-user billing.
- Course purchase.
- Custom contract.
- Purchase order.
- Invoice.
- M-Pesa.
- Bank transfer.
- Card.
- Credits.
- Sponsored billing.
- Cost centre allocation.

Billing roles and learning roles should be separable.

---

## 44. Subscription Management

Organizations should manage their plan and subscription lifecycle.

### Subscription Controls

Organizations should manage:

- Plan.
- Seat limit.
- Active learners.
- Billing cycle.
- Renewal.
- Upgrade.
- Downgrade.
- Additional seats.
- Payment method.
- Invoice history.
- Contract period.
- Usage alerts.
- Grace period.
- Cancellation.

When a subscription ends, protect learner records. Define read-only, export, archive, and reactivation rules.

---

## 45. Enterprise Data Ownership

Enterprise data ownership must be clear.

### Ownership Principles

- Organization owns its internal training content, subject to agreements.
- Instructors own original public course content unless contracted otherwise.
- Learners retain rights over personal information.
- Solva acts as platform provider and processor/controller according to applicable law and agreements.
- Public marketplace data and private enterprise data must remain separated.
- Organization administrators should not export data beyond authorized use.

Data handling should be governed by contracts, privacy policy, role permissions, and audit logs.

---

## 46. Integrations

Solva Academy should plan integrations modularly and avoid blocking launch on all integrations.

### Planned Integrations

Plan for:

- Solva HR.
- HRIS systems.
- Payroll systems.
- Google Workspace.
- Microsoft Entra ID.
- Calendar systems.
- Email.
- SMS.
- WhatsApp-ready notifications.
- APIs.
- Webhooks.
- SSO.
- SCIM future support.
- ERP systems.
- School management systems.

Each integration should have authorization, data mapping, sync logs, error handling, and disconnect controls.

---

## 47. Solva HR Integration

Future Solva HR integration should support workforce learning automation.

### Capabilities

Support:

- Employee synchronization.
- Department synchronization.
- New employee onboarding assignment.
- Job-role-based learning.
- Performance development plans.
- Training history.
- Certificate records.
- Expiry alerts.
- Promotion-readiness learning.
- Access-based product training.

Organizations must explicitly authorize synchronization. Sync should be auditable and reversible where practical.

---

## 48. Employer Adoption Engine

The platform should include product-led tools that help employers understand value.

### Adoption Features

Design features such as:

- Free needs assessment.
- Skills gap questionnaire.
- Free trial.
- Sample compliance course.
- Demonstration workspace.
- Training cost calculator.
- Corporate course catalogue.
- Case studies.
- Request quotation.
- Book Solco demo.
- Assisted setup.
- Pilot program.
- Department launch kit.
- Onboarding templates.
- ROI report.

These tools should reduce friction for Kenyan organizations that need training but do not have LMS procurement expertise.

---

## 49. Employer Retention

Employer retention should be based on ongoing value, not lock-in.

### Retention Drivers

Retain employer customers through:

- New course recommendations.
- Annual compliance refreshers.
- Certificate renewal alerts.
- Skills gap updates.
- Manager reports.
- Employee development plans.
- Internal academy use.
- Solco training.
- Solva product labs.
- Usage reviews.
- Dedicated support.
- Success check-ins.
- New employee automation.

Data export and cancellation must remain clear.

---

## 50. Admin Configuration

Super Admin should configure enterprise rules without hardcoding.

### Configurable Items

Super Admin should configure:

- Organization types.
- Enterprise plans.
- Billing units.
- Seat rules.
- Trial rules.
- Organization structures.
- Institutional roles.
- Assignment types.
- Reminder rules.
- Escalation rules.
- Compliance templates.
- Report templates.
- Skills frameworks.
- Internal academy options.
- SSO options.
- Integration permissions.
- Sponsor reporting.
- Custom training workflows.
- Government settings.
- School settings.
- Church settings.
- NGO settings.
- CPD settings.

Configuration changes should be permission-protected and audited.

---

## 51. Conceptual Data Model

This chapter introduces conceptual entities only. SQL and physical schema design should come later.

### Organization and Subscription Entities

- `organizations`: Institutional accounts.
- `organization_types`: Configurable institution categories.
- `organization_settings`: Branding, preferences, hierarchy, and workspace settings.
- `organization_subscriptions`: Plans, usage, billing rules, and lifecycle.
- `organization_units`: Branches, departments, teams, classes, projects, or other units.
- `organization_unit_types`: Configurable labels and hierarchy rules.
- `organization_members`: Users linked to organizations.
- `enterprise_roles`: Organization-scoped roles.
- `enterprise_permissions`: Organization-scoped permission definitions.

### Import, Assignment, and Compliance Entities

- `learner_import_jobs`: Bulk import records and validation results.
- `assignment_rules`: Automated assignment rules.
- `learning_assignments`: Assigned learning records.
- `assignment_targets`: Target groups or individuals.
- `compliance_programs`: Compliance training programs.
- `compliance_requirements`: Requirements inside compliance programs.
- `policy_documents`: Uploaded policy documents.
- `policy_versions`: Policy version history.
- `policy_acknowledgements`: User acknowledgements and evidence.

### Internal Learning Entities

- `internal_academies`: Private organization academies.
- `internal_courses`: Private organization courses.
- `enterprise_learning_paths`: Organization learning paths.
- `enterprise_skills`: Organization-defined skills.
- `job_skill_profiles`: Skill requirements for job roles.
- `skills_gap_assessments`: Gap analysis snapshots.
- `development_plans`: Employee development plans.
- `development_plan_items`: Plan activities and milestones.
- `enterprise_live_sessions`: Solco sessions tied to organization learning.

### Reporting, Billing, Custom Training, and Integration Entities

- `enterprise_reports`: Generated reports.
- `scheduled_reports`: Scheduled report deliveries.
- `training_roi_metrics`: Training effectiveness metrics.
- `enterprise_billing_accounts`: Billing profiles and cost centres.
- `enterprise_invoices`: Invoice records.
- `enterprise_contracts`: Custom agreements.
- `custom_training_requests`: Custom training inquiries.
- `custom_training_proposals`: Proposal records.
- `sponsorship_programs`: Sponsored institutional learning programs.
- `sponsor_reports`: Sponsor-facing impact reports.
- `integration_connections`: Authorized integration configurations.
- `data_sync_jobs`: Sync runs, errors, and logs.
- `enterprise_audit_logs`: Enterprise-specific audit events.

### Boundaries

The data model must enforce ownership, tenant boundaries, privacy, financial integrity, and audit requirements. Organization data must not leak between tenants, and employers must not access personal learner activity outside authorized training records.

---

## 52. Risks and Mitigations

### Risk: Enterprise Learning Becomes Bulk Purchases Only

Mitigation:

- Build assignments, internal academies, reporting, skills, compliance, Solco sessions, and practice labs as core enterprise capabilities.

### Risk: Employer Privacy Overreach

Mitigation:

- Separate personal and employer learning records.
- Use scoped permissions.
- Make employer-visible data clear to learners.

### Risk: Overclaiming Compliance

Mitigation:

- Report training completion and acknowledgements, not legal compliance guarantees.
- Use disclaimers and configurable compliance language.

### Risk: Enterprise Complexity Blocks Small Organizations

Mitigation:

- Offer simple setup templates, micro-employer plans, assisted onboarding, and progressive disclosure.

### Risk: Integration Scope Explosion

Mitigation:

- Launch modularly.
- Prioritize Solva HR readiness.
- Add HRIS, SSO, SCIM, and ERP integrations in stages.

### Risk: Sensitive Institutional Data Leakage

Mitigation:

- Use tenant IDs, workspace IDs, RLS, server-side authorization, scoped reports, and audit logs.

---

## 53. Acceptance Criteria

Chapter 6 should be considered satisfied when the blueprint supports:

- Enterprise learning as a full operating system, not bulk course seats.
- Configurable institution types.
- Clear enterprise value proposition.
- Flexible subscription and billing philosophy.
- Guided organization onboarding.
- Dedicated branded organization workspace.
- Configurable organizational structures.
- Organization-scoped roles and permissions.
- Learner imports without duplicate accounts.
- Separation of personal and employer learning.
- Assignment engine and automated rules.
- Corporate learning paths and compliance training.
- Policy acknowledgement.
- Internal academy and internal course builders.
- Content library.
- Solco enterprise training.
- Enterprise practice labs.
- Ethical Solva product adoption.
- Skills framework and gap analysis.
- Employee development plans.
- Manager, executive, and compliance dashboards.
- Reports and training effectiveness metrics.
- Notifications and escalations.
- Employer marketplace and custom training.
- School, TVET, university, church, NGO, SACCO, government, and CPD use cases.
- Sponsored institutional learning.
- Enterprise billing and subscription management.
- Data ownership and integrations.
- Solva HR integration readiness.
- Employer adoption and retention engines.
- Admin configuration.
- Conceptual data model without SQL.

---

## 54. Dependencies for Later Chapters

Later chapters should define:

- Enterprise billing implementation and invoice workflows.
- Detailed Solva HR integration contracts.
- SSO, SCIM, and HRIS integration specifications.
- Enterprise reporting schemas and dashboard designs.
- Compliance templates and legal wording.
- Government procurement and support workflows.
- Data processing agreements and privacy terms.
- Custom training proposal and contracting workflows.
- Enterprise security requirements and audit retention.
- QA plans for tenant isolation, imports, reports, and assignment automation.

---

## 55. Final Recommendations

Solva Academy should position institutional learning as an affordable operating system for training people, proving learning, and improving capability. The strongest direction is to serve organizations of every size with configurable workspaces, practical assignments, live Solco training, internal academies, skills tracking, compliance reporting, and ethical Solva product labs.

The platform should:

- Keep enterprise learning affordable for Kenyan institutions.
- Support small organizations without overwhelming setup.
- Provide deep enough controls for government, NGOs, schools, and large employers.
- Protect learner privacy and personal learning boundaries.
- Avoid compliance overclaims.
- Make Solva product adoption practical, educational, and optional where appropriate.
- Build toward Solva HR and future HRIS integrations without blocking launch.

Chapter 6 should guide Solva Academy toward becoming the trusted learning operating system for employers, schools, churches, NGOs, SACCOs, government institutions, and professional bodies across Kenya and Africa.

