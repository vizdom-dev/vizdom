# Vizdom

Vizdom is a declarative graph layout and rendering engine compiled from Rust to
WebAssembly using `wasm-pack`. It provides an API for creating and rendering
directed graphs and producing SVGs.

## Goals

- 💾 **Low memory footprint**
- 🎉 **No system dependencies**
- 🚀 **Fastest layout and rendering engine powered by WebAssembly**
- 🔥 **Works in any client / server configuration**

## Features

- 🛠️ Create and manipulate **directed** graphs.
- 🔀 Handles multiple edges with the same `source` and `target` nodes.
- 🔄 Render **cyclical** directed graphs.
- 🎨 Support various custom rendering attributes for enhanced visualization.

## Installation

Vizdom comes in several distributions:

- `esm` (Modern)
- `node` (CJS)
- `web` (Browser)

Simply select a distribution and install using your favorite package manager
following the saming convention `@vizdom/vizdom-ts-<dist>`.

```sh
npm install @vizdom/vizdom-ts-esm
pnpm install @vizdom/vizdom-ts-esm
yarn install @vizdom/vizdom-ts-esm
bun install @vizdom/vizdom-ts-esm
```

## 🚴 Usage

In the most basic configuration, all you need is to provide labels for nodes and
edges.

```typescript
import { DirectedGraph } from "@vizdom/vizdom-ts-esm";
// ... or CJS
// const { DirectedGraph } = require("@vizdom/vizdom-ts-node");

// Create a new graph
const graph = new DirectedGraph();

// Add vertices
const v0 = graph.new_vertex({
  render: {
    label: "Hello",
  },
});
const v1 = graph.new_vertex({
  render: {
    label: "World!",
  },
});

// Add an edge between the vertices
graph.new_edge(v0, v1, {
  render: {
    label: "Foo Bar",
  },
});

// Position the graph
const positioned = graph.layout();

// Finally, obtain to an SVG
await fs.writeFile("./graph.svg", positioned.to_svg().to_string());
```

Check out the [basic example](examples/basic/index.mjs), which produces a
graph that looks like [this](examples/basic/graph.svg).

## Styling Attributes

Vizdom supports several layout and rendering options for those who want more
control over the appearance of their graphs.

Check out the [style example](examples/styles/index.mjs), which produces a
graph that looks like [this](examples/styles/graph.svg).

## 📈 Diff Viewer 📉

You can visually compare two graphs with Vizdom. Ensure that the `id` attributes
are set and unique to track changes effectively. The resulting graphs will be
annotated with a 'glow' effect to highlight differences:

- ❌ Removed elements (`id` no longer exists) are highlighted in **red**.
- ✅ Added elements (`id` is new) are highlighted in **green**.
- 🟧 Modified elements (`id` is the same, but other attributes have changed) are
  highlighted in **orange**.

Check out the [diff example](examples/diff/index.mjs), which produces two
graphs that look like [graph 0](examples/diff/graph0.svg) and [graph
1](examples/diff/graph0.svg).

## License

Licensed under the Apache License, Version 2.0. See the [LICENSE](LICENSE)
file or visit
[https://www.apache.org/licenses/LICENSE-2.0](https://www.apache.org/licenses/LICENSE-2.0)

## Closed-Source Notice

Please note that while Vizdom is freely available for use under the Apache
License 2.0, the Rust WebAssembly binary included in this library is
closed-source. You are free to use the library, but the source code for the Rust
WebAssembly binary is not publicly available.
