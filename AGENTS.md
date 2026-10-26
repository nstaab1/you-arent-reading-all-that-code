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

The spec adds this repo's own rules here.

## Agent skills

### Issue tracker

Issues live in this repo's GitHub Issues, and each ticket is a sub-issue of the spec in `nstaab1/codemash-27-talks`. See `docs/agents/issue-tracker.md`.

### Triage labels

The five default label strings: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `GLOSSARY.md` and one `docs/adr/` at the repo root. See `docs/agents/domain.md`.
