# Version 0.1.19

Feat:

- Syncing a graph to Vizdom now uses non blocking DNS resolver provided by
  `hickory-dns` in the `reqwest` crate.

Chore:

- Updated all dev deps.

# Prior Versions

Feat:

- Support for rendering Directed Graphs.
- Partial support for parsing the DOT language.
- No syscalls to fonts
- [Optional] Sync graphs and parsed DOT files to Vizdom for quick viewing with
  pan/zoom, sharable links.
