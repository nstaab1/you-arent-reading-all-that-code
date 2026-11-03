# you-arent-reading-all-that-code

This repo is T02's bug-hunt repo. It is that deliverable's working repo, so the build's tickets, branches and pull requests live here.

## Spec

The spec is [Spec: T02 bug-hunt repo](https://github.com/nstaab1/codemash-27-talks/issues/87), in the planning repo. It is the source of truth for what this repo builds. File each ticket in this repo as a sub-issue of the spec.

## Planning repo

The planning repo is `nstaab1/codemash-27-talks`. It holds the spec, the research and the prototypes. It is private, and this repo works without a checkout of it. Read any file there through the API:

```bash
gh api -H "Accept: application/vnd.github.raw" "repos/nstaab1/codemash-27-talks/contents/<path>?ref=<branch>"
```

Use `ref=main` for decided docs. For a prototype or research, use the `prototype/*` or `research/*` branch the spec links. For example, this reads the planning repo's schedule:

```bash
gh api -H "Accept: application/vnd.github.raw" "repos/nstaab1/codemash-27-talks/contents/SCHEDULE.md?ref=main"
```

## Repo rules

- **The spec is private.** The spec lives in the private planning repo, so its link only opens for people with access. Read it through the API above.
- **Off-limits ideas.** The spec's "What `main` must never hold" rule names ideas this repo never holds. Never define or use them, under any name, in data, code, `AGENTS.md` or `GLOSSARY.md`.
- **`Intent:` trailer.** Every agent commit ends its message with an `Intent:` trailer: one line, in the agent's own words, saying what the commit is for.
- **The net.** `npm run verify` is the net. No change may weaken it without a ticket saying so. Weakening includes deleting or skipping a test, loosening a lint or type rule, dropping a layer, and committing with `--no-verify`. Leave `verify` green locally and the CI `net` job green on the PR.
- **Attended-only.** The agent PR, its branch, the rerun branch and the proof folders are attended-only. An AFK agent never creates, edits, rebases or pushes them.

## Agent skills

### Issue tracker

Issues live in this repo's GitHub Issues, and each ticket is a sub-issue of the spec in `nstaab1/codemash-27-talks`. See `docs/agents/issue-tracker.md`.

### Triage labels

The five default label strings: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `GLOSSARY.md` and one `docs/adr/` at the repo root. See `docs/agents/domain.md`.
