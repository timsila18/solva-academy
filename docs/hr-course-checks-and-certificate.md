# HR Course Checks and Certificate Design

The owner's draft course now contains 16 formative practice quizzes with three
single-choice questions per class: 48 questions, 192 options and 48 explanations.
They remain draft, optional and ungraded, with no certificate pass-mark promise.
The owner reviews them at `/courses/builder/[courseId]/checks`. No answer key is
sent to a learner-facing page. Migration 0023 restricts raw assessment authoring
tables (including correct answers) to course authors and governed administrators.
Future learner delivery needs a server-side, answer-stripped projection.

The learner quiz-attempt screen remains an unfinished foundation. This change
prepares and previews the content; it does not claim that learner scoring or
automatic certificate eligibility is implemented. Do not activate these checks
until the learner attempt, feedback and completion workflows have been tested.
The practice question source is tracked in the repository for content review;
these are not a secure, proctored examination bank.

## Certificate Naming

Proposed certificate programme title: **Practical Human Resource Management**.
Existing course title and slug remain **HR Practice from A to Z** until the owner
approves a rename. Award wording is **Certificate of Completion**, not a diploma,
CHRP credential, regulated qualification, professional licence or approved CPD award.

The draft template records the issuing academy, programme title, colour palette,
signatory role, required issue fields and specimen PDF path. It is not integrated
with a production certificate renderer or auto-issuance workflow. No certificate
has been issued. `courses.certificate_available` remains false.

## Design Files

The A4 landscape specimen uses white, Solva blue and black, the existing cap mark,
a restrained border, serif programme title and learner-name field. It includes a
signature line, date and serial-number fields. The sample is prominently marked
not valid for award. It contains no forged signature, invented completion hours,
accreditation seal or pretend verification QR code. A real issued version will
need live serial/verification data and approved completion evidence.

The specimen and instructor PDF (questions plus answer key) are stored in the
private, service-only `course-authoring` bucket. The course editor generates
time-limited owner-authorized download links. The source PowerPoint is unchanged.

## Checks

- Content tests: 16 classes, 48 questions, four options and exactly one key each.
- SQL test: draft status, optional practice configuration, owner access, anonymous
  answer-key denial, private files and disabled certificate issuance.
- PDFs rendered to PNG and inspected, including all 11 instructor-pack pages.
- Setup is idempotent and preserves subsequent owner edits.
