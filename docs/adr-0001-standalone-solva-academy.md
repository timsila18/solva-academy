# ADR 0001: Solva Academy Is a Standalone Product

## Status

Accepted.

## Context

The approved master blueprint defines Solva Academy as a standalone learning ecosystem under `academy.solvaone.co.ke`, related to but independent from `solvaone.co.ke` and other Solva products.

## Decision

Solva Academy is implemented as its own Next.js application and deployable project named `solva-academy`.

It will expose integration points for future SolvaOne identity, Solco live learning, Solva HR, shared payments, and future ecosystem services, but it will not depend on those unfinished systems for the first production foundation.

## Consequences

- The app can be developed, tested, deployed, scaled, and secured independently.
- Auth, roles, workspaces, RLS, and audit logging can mature inside Solva Academy without blocking on shared identity.
- Future integrations must use explicit service boundaries rather than hidden coupling to another repository.
