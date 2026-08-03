# Production Implementation Prompt 8

## Scope

Prompt 8 adds the Solco Intelligence foundation for Solva Academy: AI Tutor, study assistance, AI course creator drafts, AI assessment drafts, instructor feedback drafts, semantic search, translation, accessibility assistance, recommendations, enterprise insights, and AI governance.

The implementation intentionally uses a provider-neutral interface with a deterministic mock provider. This gives the product real audited workflows now while preserving future routing to OpenAI, Azure OpenAI, Anthropic, Gemini, local models, or a Solva AI Gateway.

## Features Implemented

- AI model, capability, route, prompt template, request, response, usage, cost, index, embedding, moderation, feedback, translation, recommendation, and retrieval-hit tables.
- RLS policies for learner-owned, workspace-scoped, organization-scoped, and platform-governed AI data.
- Seeded Solco mock model and future provider placeholders.
- Seeded AI capabilities and default prompt templates.
- Central AI provider interface and mock provider.
- Central AI engine with pre-moderation, prompt-injection detection, tenant-scoped retrieval, generation, post-moderation, response storage, usage/cost estimates, retrieval-hit storage, and audit events.
- Learner AI pages: dashboard, tutor, study tools, semantic search.
- Instructor AI pages: overview, course creator, assessments, feedback.
- Organization AI page for enterprise learning insights.
- Admin AI governance page for models, capabilities, moderation, recent requests, and knowledge indexes.
- Navigation and auth proxy updates for protected AI routes.

## Database Migration

- `supabase/migrations/0008_solco_intelligence.sql`

## New Routes

- `/ai`
- `/ai/tutor`
- `/ai/study`
- `/ai/search`
- `/instructor/ai`
- `/instructor/ai/course-creator`
- `/instructor/ai/assessments`
- `/instructor/ai/feedback`
- `/organization/ai`
- `/admin/ai`

## Responsible AI Guardrails

- All AI output is treated as draft content.
- Teaching, assessment, compliance, certificate, enterprise, child-learning, and feedback outputs require human review.
- Prompt-injection patterns are blocked before generation.
- Provider output is moderated after generation.
- Hidden prompts are not exposed in UI.
- Tenant-scoped retrieval prevents cross-organization or cross-academy context mixing.
- AI request, response, usage, cost, moderation, retrieval, and audit records are retained.

## Known Limitations

- The active provider is `mock`; production provider credentials and vendor routing remain deferred.
- Embeddings are stored as numeric arrays for portability; a future migration may add `pgvector`.
- AI drafts are not yet inserted into course-builder entities automatically.
- Recommendation records are supported and ranked in code, but full background generation is deferred.
- Translation quality review workflows are foundational.

## Deferred to Prompt 9

- Real provider routing and Solva AI Gateway integration.
- Production-scale semantic vector search.
- AI-generated course draft import into the full builder with editor review.
- More granular AI quotas, billing, abuse monitoring, and provider fallback rules.
- Country-specific AI, child-safety, and educational compliance policies.
