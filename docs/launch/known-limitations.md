# Known Limitations Register

| Feature | Limitation | Impact | Workaround | Severity | Owner | Target | Dependency |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Payments | Production M-Pesa not verified in this environment | Paid checkout cannot be declared production-ready | Keep paid checkout behind feature flag | Critical | Finance/Engineering | Staging | Daraja production credentials |
| Backups | Restore test not executed here | General production launch blocked | Run isolated staging restore | Critical | Operations | Staging | Supabase plan/PITR |
| AI | Active provider is mock | AI quality/cost not production verified | Pilot with mock or connect provider in staging | High | AI/Engineering | Prompt 10 staging | Provider key |
| Live learning | Provider adapter not production verified | Live room reliability unknown | Pilot with limited classes | High | Live Ops | Staging | Provider credentials |
| Webhooks | Delivery worker is foundation only | Events queue but are not externally dispatched | Implement worker before external integrations | Medium | Platform | Next release | Queue/runtime |
| Invoices | PDF renderer not connected | PDF invoice download unavailable | Use invoice record/export until renderer added | Medium | Finance | Next release | PDF provider |
| MFA | Records exist; Auth enforcement needs provider setup | MFA policy not fully enforced | Configure Supabase Auth MFA | High | Security | Staging | Supabase Auth |
