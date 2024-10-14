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

Check out the [basic example](examples/basic/index.ts), which produces a graph
that looks like:

![this](examples/basic/graph.svg)

### ☁️ Online Mode

Vizdom offers an online mode that effortlessly syncs your graph with your Vizdom
account, eliminating the need for manual positioning and rendering. This ensures
your graph is always up-to-date with your latest code changes.

To get started with syncing, [sign up for an
account](https://vizdom.dev/auth/signup).

Once you have an account, syncing your graph is straightforward. Simply add a
few additional parameters when constructing your graph:

```typescript
const graph = new DirectedGraph(
  {}, // <-- Optional layout and render attributes.
  // Must be specified as the second argument.
  {
    client_id: process.env.VIZDOM_CLIENT_ID || "",
    client_secret: process.env.VIZDOM_CLIENT_SECRET || "",
    graph_id: process.env.VIZDOM_GRAPH_ID || "",
  }
);
```

By specifying these parameters when creating your graph, you can easily manage
multiple graphs within the same project, each syncing independently.

## Layout Engine

Vizdom can be used as a pure layout engine to obtain positioning information,
which is especially useful if you already have a method for rendering your
graph.

### Specifying Layout Parameters

To use Vizdom for layout purposes, you need to provide the bounding box
dimensions. If you are using the library in a browser context, you can retrieve
these dimensions by using methods like
[getBoundingClientRect()](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect)
on the HTML element. Compute the `shape_w` (width) and `shape_h` (height) and
pass them as `layout` parameters.

Additionally, there's an optional argument, `compute_bounding_box`, which can be
set to `false`. This tells the library to use the provided layout values for the
bounding box instead of computing it from the `label` attribute. By default, the
shape is considered to be a `Shape.Rectangle` for nodes and `Shape.Plaintext`
for edges (which is also a rectangle) and should remain unchanged in this
context.

### Providing IDs

Each vertex and edge requires an `id` to map the JSON result correctly. The
resulting JSON string will include these IDs, enabling accurate mapping of the
nodes and edges.

```typescript
// ...
const v0 = graph.new_vertex(
  {
    layout: {
      shape_w: 10,
      shape_h: 10,
    },
    render: {
      id: "v0",
    },
  },
  {
    compute_bounding_box: false,
  }
);

// ...

// Similarly, for an edge you have the same API.
const e0 = graph.new_edge(
  v0,
  v1,
  {
    layout: {
      shape_w: 10,
      shape_h: 10,
    },
    render: {
      id: "e1",
    },
  },
  {
    compute_bounding_box: false,
  }
);

// Position the graph
const positioned = graph.layout();

// Obtain the json instance
const json = positioned.to_json();

// Get a JS/TS Object adhereing to the `IJsonPosition` interface.
const jsonObj = json.to_obj();

// Or get the JSON string directly
const jsonString: string = json.to_string();
// const jsonStringPretty: string = json.to_string_pretty();
```

For a practical example, check out the [json example](examples/json/index.ts),
which generates a positional JSON string similar to
[this](examples/json/graph.json).

## Styling Attributes

Vizdom supports several layout and rendering options for those who want more
control over the appearance of their graphs.

```typescript
const v0 = graph.new_vertex({
  render: {
    label: "Foo",
    color: "#ff2f8e",
    fill_color: "#ff2f8eaa",
    shape: Shape.Triangle,
    style: VertexStyle.Dashed,
  },
});
```

Check out the [style example](examples/styles/index.ts), which produces a graph
that looks like:

![this](examples/styles/graph.svg)

## DOT Language Support

Vizdom offers partial support for the [DOT
language](https://graphviz.org/doc/info/lang.html), commonly used for defining
graphs. Most styling attributes are supported; however, please note that
undirected diagrams are currently not parsed. Additionally, while DOT files may
specify layout engines, Vizdom will always use its own layout engine for
positioning.

The parser fully supports [cluster
graphs](https://graphviz.org/docs/attrs/cluster/), allowing for `subgraph` IDs
with the `cluster_` prefix or `subgraph` **statements** containing a
`cluster=true` attribute.

Unsupported styles are gracefully ignored, defaulting to safe visual options to
ensure smooth rendering.

```typescript
import { DotParser } from "@vizdom/vizdom-ts-esm";
// ... or CJS
// const { DotParser } = require("@vizdom/vizdom-ts-node");

// Create a new Dot Parser
const parser = new DotParser();
const dotGraph = parser.parse("digraph { a -> b }");
const directedGraph = dotGraph.to_directed();
const positioned = directedGraph.layout();

// Once positioned, the graph can be exported as SVG or JSON.
await fs.writeFile("./graph.svg", positioned.to_svg().to_string());
const jsonObj = positioned.to_json().to_obj();
console.log(
  util.inspect(jsonObj, { showHidden: false, depth: null, colors: true })
);
```

Check out the [dot example](examples/dot/index.ts), which produces a graph that
looks like:

![this](examples/dot/graph.svg)

You may also sync the parsed DOT to your Vizdom account by specifying the options like the following:

```typescript
// ...
const parser = new DotParser();
const dotGraph = parser.parse("digraph { a -> b }");
const directedGraph = dotGraph.to_directed({
  client_id: process.env.VIZDOM_CLIENT_ID || "",
  client_secret: process.env.VIZDOM_CLIENT_SECRET || "",
  graph_id: process.env.VIZDOM_GRAPH_ID || "",
});
// Sync complete!
```

To optimize performance, the `to_directed()` method is instrumented for syncing
rather than the parser itself. This allows the parser to be reused across
multiple DOT files ensuring efficient parsing operations.

Once synced to Vizdom, there's no need to manually apply layout (`layout()`) or
rendering (`to_svg()`, `to_json()`) methods. These processes are automatically
handled in the browser when viewing your graph.

## 📈 Diff Viewer 📉

You can visually compare two graphs with Vizdom. Ensure that the `id` attributes
are set and unique to track changes effectively. The resulting graphs will be
annotated with a 'glow' effect to highlight differences:

- ❌ Removed elements (`id` no longer exists) are highlighted in **red**.
- ✅ Added elements (`id` is new) are highlighted in **green**.
- 🟧 Modified elements (`id` is the same, but other attributes have changed) are
  highlighted in **orange**.

Check out the [diff example](examples/diff/index.ts), which produces two graphs
that look like:

![graph 0](examples/diff/graph0.svg)

and

![graph 1](examples/diff/graph1.svg)

## License

Licensed under the Apache License, Version 2.0. See the [LICENSE](LICENSE) file
or visit
[https://www.apache.org/licenses/LICENSE-2.0](https://www.apache.org/licenses/LICENSE-2.0)

## Third Party Licenses

This project makes use of third-party components, each with its own licensing
terms:

- **Dagre.js**: Some of the layout algorithms in this project are inspired by
  [Dagre.js](https://github.com/dagrejs/dagre), which is licensed under the MIT
  License. The full license text can be found in the
  [`third_party/dagre/LICENSE`](third_party/dagre/LICENSE) file.

- **NotoSans Font**: The NotoSans font used in this project is licensed under
  the SIL Open Font License. The full license text can be found in the
  [`third_party/noto_sans/LICENSE`](third_party/noto_sans/LICENSE) file.

- **Others**: Can be found in the
  [`third_party/licenses.html`](third_party/licenses.html) file.

## Closed-Source Notice

Please note that while Vizdom is freely available for use under the Apache
License 2.0, the Rust WebAssembly binary included in this library is
closed-source. You are free to use the library, but the source code for the Rust
WebAssembly binary is not publicly available.
