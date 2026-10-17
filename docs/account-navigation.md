# Account entry and navigation

- Signup choices: learner, instructor, academy owner, employer/organization, parent/guardian.
- These choices determine the next step and record onboarding intent. They do not grant privileged roles or bypass instructor/academy approval.
- Academy-owner signup continues at `/academies/start`; instructor signup at `/instructors/apply`; organization signup at `/organizations/create`.
- Regular sign-in opens `/welcome`; a validated `next` value returns the user to their earlier task.
- `/welcome` offers learning, academy applications, instructor applications, organization setup, and the user's academy application statuses.
- A school is a platform-managed subject area. A person offering courses creates an academy within a school.
- Workspace options come from active database memberships. Selecting one verifies membership, saves the preference, records an audit event, and navigates to its dashboard.
- Dashboard navigation is grouped by actual memberships/roles. Administrator navigation requires the platform-settings permission. Server and database authorization still govern all actions.
- The learner page reads real enrollments and individual-class purchases. It no longer displays sample learning paths or invented recommendations.
- Parent/guardian signup records the preference and opens the account home; it does not introduce new child-management features.
