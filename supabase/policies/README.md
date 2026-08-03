# Row-Level Security Policy Notes

All protected foundation tables enable RLS in `0001_foundation.sql`.

Policy groups:

- Profiles: users can read/update their own profile; platform administrators can inspect users.
- Roles and permissions: authenticated users can inspect role catalogues; only platform role managers can mutate.
- Role assignments: users can read their own assignments; only authorized platform role managers can assign/revoke roles.
- Workspaces: owners, members, and platform administrators can read assigned workspaces.
- Schools and categories: public active content is readable; platform administrators manage taxonomy.
- Academies: public academies are readable; private academy records require owner, member, or platform administrator access.
- Organizations: records require owner, member, or platform administrator access.
- Feature flags and settings: sensitive mutations require `settings.manage.platform`.
- Audit logs: readable only with `audit.view.platform`; ordinary clients cannot insert audit logs.
- Support access sessions: platform-only foundation for future time-limited support access.

The app must continue to enforce server-side authorization in Server Components, Server Actions, and Route Handlers. RLS is the database safety layer, not the only permission check.
