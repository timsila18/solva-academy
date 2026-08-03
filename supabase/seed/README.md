# Seed Strategy

The initial migration seeds only safe platform foundation data:

- Account statuses
- Protected system roles
- Granular permissions
- Role-permission mappings
- Initial schools
- Feature flags
- Public-safe system settings
- Storage buckets

The seed intentionally does not create fake users, fake course counts, fake reviews, fake employers, fake revenue, fake completions, or fake certificates.

## Founding Admin Bootstrap

1. Apply migrations.
2. Register Timothy Sila through the normal application sign-up flow using `timsila18@gmail.com`.
3. Verify the email address through Supabase Auth.
4. Run this SQL from a trusted server-side/admin context:

```sql
select public.bootstrap_founding_super_admin('timsila18@gmail.com');
```

The bootstrap is idempotent. It creates or restores the platform administration workspace, marks the profile as the founding administrator, assigns protected platform roles, and writes an audit event.
