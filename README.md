# You Aren't Reading All That Code

The bug-hunt repo for the talk _You Aren't Reading All That Code: Quality Safety Nets for the AI Era_ at CodeMash 2027. The app is the Buzzword Bestiary, a small web app that lists the talks of an invented conference as creatures of AI hype. Every layer of the safety net runs against it.

## Running it

Use Node 24.

```bash
npm ci
npm run dev
```

The feed serves creatures on port 4000. The Bestiary opens at http://localhost:5173.

## The net

Each band is one command. A band runs every layer even after one fails, then prints a scoreboard and exits non-zero if any layer failed. Each run writes `.net/results/<command>.json`.

| Command          | Layers                                       |
| ---------------- | -------------------------------------------- |
| `npm run band1`  | Formatting, linting, type checking           |
| `npm run band2`  | Unit and integration tests, with V8 coverage |
| `npm run verify` | Both bands. This is the net                  |

A pre-commit hook formats and lints staged files. The `net` job in GitHub Actions runs `verify` on every pull request and on pushes to `main`, and `main` requires it.

## Credits

This work includes material taken from the System Reference Document 5.1 ("SRD 5.1") by Wizards of the Coast LLC and available at https://dnd.wizards.com/resources/systems-reference-document. The SRD 5.1 is licensed under the Creative Commons Attribution 4.0 International License available at https://creativecommons.org/licenses/by/4.0/legalcode. The Bestiary uses its table of experience points by Challenge Rating.

## Licence

MIT. See [LICENSE](./LICENSE).
