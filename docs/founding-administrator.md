# Founding administrator

Timothy Sila's existing `timsila18@gmail.com` account is the founding administrator. The binding is stored in `platform_founder.user_id`, not inferred from browser metadata or a matching email at signup.

## Boundaries

- Founding Super Admin, Super Admin, and Platform Administrator are platform-scoped roles in Platform Administration.
- Learner belongs in Personal Learning.
- Instructor belongs in a teaching, academy, or organization workspace.
- Academy Owner belongs in the specific academy workspace after approval.
- Organization Administrator belongs in the specific organization workspace.
- Signup choices record intent only; they do not grant privileged roles.
- Platform administration does not make the person an owner or trainer of every tenant.

The existing inspector account retains its platform access. Its misplaced learner, instructor, academy-owner, and organization-administrator assignments in the platform workspace were revoked with audit records. Its legitimate Personal Learning assignment remains.

## Protection and recovery

The founding assignment cannot be revoked, moved, demoted, or expired by ordinary role changes. Profile suspension, deletion, removal of the founder flag, authentication suspension, and email changes are protected. Password recovery remains available through the normal authentication process.

Exceptional founder transfer, email change, or suspension requires an explicit, audited database-owner maintenance migration, with recovery access verified first. The app has no bypass toggle. Keep database-owner credentials outside normal platform accounts.

The bootstrap RPC is callable only by the service role and requires a pre-bound founder identity. The one-time `scripts/provision-founder.sql` binds the exact existing user and records the provisioning event. The legacy inspector setup stops once a founder is bound.

Migrations 0018 and 0019 enforce these boundaries. `supabase/tests/founder_roles.sql` checks founder permissions, restricted provisioning, lockout protection, and workspace-role consistency.
