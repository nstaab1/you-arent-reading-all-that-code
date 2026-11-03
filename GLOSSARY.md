# Buzzword Bestiary

The Bestiary lists the talks of an invented conference as creatures of AI hype, each with a D&D-style stat block. It is the app this repo's net runs against.

## Language

**Creature**:
A talk at the conference, written up as a monster of AI hype. Each creature is one committed Markdown file.
_Avoid_: monster, entry

**Talk card**:
A creature's place in the Bestiary list: its name, its talk's title and its stat block.
_Avoid_: tile, row

**Stat block**:
The panel on a talk card showing a creature's Challenge Rating, XP and buzzwords.
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
The Markdown body of a creature's file, telling its story.
_Avoid_: description, bio
