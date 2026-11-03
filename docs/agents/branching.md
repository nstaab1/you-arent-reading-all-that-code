# Branching

How the implementation skills branch and merge in this repo.

Every piece of work branches from `main` and merges back into it. Name the branch `<type>/<slug>`, where the type is the kind of work, such as `feature`, `fix` or `research`, and the slug is a short kebab-case name for it. Two examples are `feature/walking-skeleton` and `fix/feed-port`.

```bash
git fetch origin
git switch main && git pull
git switch -c <type>/<slug>
```
