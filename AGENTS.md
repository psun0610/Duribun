# AGENTS.md

This file defines working rules for AI coding agents in this repository.
It is not a user-facing README, product overview, or human onboarding guide.

## Scope

- Treat these instructions as repository-local operating rules.
- Keep changes focused on the user's request.
- Prefer existing project structure, terminology, and scripts over introducing new patterns.
- Do not rewrite unrelated files or revert changes you did not make.

## Required Context

Before making non-trivial changes, read the relevant project context first.

- Read the files directly related to the requested change.
- Read `docs/product-decisions.md` when the change touches product behavior, domain terms, or user-facing decisions.
- Read `docs/ai-usage.md` when the change affects how AI tools, agents, prompts, or automation are used.
- Read the relevant files in `docs/prds/` when the change implements or modifies planned product work.
- If `CONTEXT.md` exists, treat it as the primary source for domain language and current project framing.
- If `docs/` exists, treat it as the primary source for accepted architecture decisions.

Do not infer domain language or architecture from implementation alone when documented context exists.

## Change Discipline

- Make the smallest coherent change that solves the task.
- Preserve user work in the working tree.
- Avoid broad refactors unless the user explicitly asks for them or they are necessary for the change.
- Add comments only when they clarify non-obvious logic.
- Keep generated or mechanical changes out of commits unless they are required.

## Verification

- Run the narrowest useful checks for the files changed.
- Prefer existing project commands and documented workflows.
- If a check cannot be run, state why and describe the remaining risk.

## Documentation

- Update documentation when behavior, product decisions, architecture, or agent workflows change.
- Do not duplicate long explanations across documents; link or reference the canonical source instead.
- When a durable decision is made and `docs/adr/` exists, add or update an ADR instead of burying the decision in code comments.

## Communication

- State assumptions when the codebase does not answer a question.
- Surface blockers early, with the exact command, file, or missing context involved.
- In final responses, summarize what changed and what was verified.
