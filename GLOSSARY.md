# Buzzword Bestiary

The Bestiary lists the talks of an invented conference as creatures of AI hype, each with a D&D-style stat block. It is the app this repo's net runs against.

## Language

**Creature**:
A talk at the conference, written up as a monster of AI hype. Each creature is one committed Markdown file.
_Avoid_: monster, entry

**Creature of the Day**:
The one creature the bot picks for a given day. The bot prints the post it would make about it. The post quotes the Challenge Rating the feed gives the creature. Nothing posts anywhere.
_Avoid_: featured creature, daily pick

**Time slot**:
A start time in the conference's one-day schedule, written HH:MM. Every talk holds one time slot and one room, and the talks in a slot run at once in different rooms.
_Avoid_: timeslot, period

**Encounter**:
The talks a visitor picks from the day's time slots in the encounter builder. Its XP total is the sum of its creatures' XP. It lives in the visitor's browser.
_Avoid_: schedule, basket, cart

**Talk card**:
A creature's place in the Bestiary list: its name, its talk's title and its stat block. Its name links to the creature page.
_Avoid_: tile, row

**Creature page**:
A creature's own page in the Bestiary, holding its talk, its stat block and its lore.
_Avoid_: detail page, profile

**Stat block**:
The panel showing a creature's Challenge Rating, XP and buzzwords, on its talk card and its creature page.
_Avoid_: stats panel, details

**Buzzword**:
An AI-hype term a creature's talk leans on, listed in the creature's frontmatter.
_Avoid_: keyword, tag

**Hype**:
How much buzzword a talk carries, counted as its number of buzzwords.
_Avoid_: score, popularity

**Challenge Rating**:
A creature's danger, from 0 through 1/8, 1/4 and 1/2 up to 30. The Bestiary rates it from hype through its own invented table. Short form CR.
_Avoid_: rank, tier

**XP**:
The experience points a creature is worth, looked up from its Challenge Rating in the SRD table.
_Avoid_: points, score

**Lore**:
The Markdown body of a creature's file, telling its story. The creature page renders it from Markdown.
_Avoid_: description, bio
