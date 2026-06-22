# O.D.I.N Project Rules

These rules apply to all development on this project, including AI-assisted sessions.

## Git

- Do not commit or push without explicit approval from the project owner.
- Commit messages must describe the why, not just the what.
- Keep commits small and focused on one change at a time.

## Dependencies

- Do not install new packages (npm or pip) without approval.
- All dependencies must be pinned to a specific version in requirements.txt or package.json.

## Integrations

- Do not add external service integrations (Fiverr, Gmail, Stripe, etc.) without approval.
- Do not add browser automation without approval.
- Do not connect to payment systems or client accounts without approval.

## API Keys and Secrets

- Do not use API keys unless they are loaded from environment variables.
- Do not hardcode secrets, tokens, or credentials anywhere in the codebase.
- Do not store secrets in the repository. The .env file is gitignored and must stay that way.
- Reference .env.example to see which variables are expected.

## Development Approach

- Keep changes small and explain them before implementation.
- Build and verify one feature at a time.
- Do not add features, refactors, or abstractions beyond what the current task requires.
- Do not start Phase 2 or later work without explicit approval.
- This MVP must be confirmed working before any new features are added.

## Autonomous Actions

- Do not take autonomous money-making actions of any kind.
- Do not send messages to clients or external parties.
- Do not submit orders, bids, or proposals on any platform.
