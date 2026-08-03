# Admin Inspector Account

Use this only for local or staging inspection.

Run:

```powershell
npm run setup:admin
```

The script:

- Loads `.env.local`.
- Uses the Supabase service role server-side.
- Creates or updates `admin@solvaacademy.local`.
- Generates a password and prints it once.
- Assigns platform, finance, support, review, academy, organization, instructor, and learner roles.
- Does not commit or store the generated password.

Before production:

- Disable this account or rotate its password.
- Use MFA for real administrator accounts.
- Do not use fixed public administrator passwords.
