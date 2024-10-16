import { DotParser } from "@vizdom/vizdom-ts-node";
import assert from "node:assert";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import util from "node:util";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize a new DOT parser instance
const parserSynced = new DotParser({
  client_id: process.env.VIZDOM_CLIENT_ID || "",
  client_secret: process.env.VIZDOM_CLIENT_SECRET || "",
  graph_id: process.env.VIZDOM_GRAPH_ID || "",
});
// Parse a simple directed graph, but you may also read from a file and pass it
// in as a string.
const dotGraphSynced = parserSynced.parse("digraph { a -> b }");
// Sync complete!
//
// You can now view the graph in your Vizdom account. You can still render
// locally if you wish, but you can skip the steps below if online sync is
// sufficient.

// For offline usage (without syncing), omit the options when constructing the parser.
const parser = new DotParser();
const dotGraph = parser.parse("digraph { a -> b }");
const directedGraph = dotGraph.to_directed();
const positioned = directedGraph.layout(); // Automatically generate a layout for the graph

// Export the graph to an SVG file:
await fs.writeFile(
  path.join(__dirname, "graph.svg"),
  positioned.to_svg().with_width_and_height().to_string()
);

// Alternatively, you can export the graph in JSON format:
const json = positioned.to_json();
const jsonObj = json.to_obj();
console.log(
  util.inspect(jsonObj, { showHidden: false, depth: null, colors: true })
);

// Note: Currently, undirected graphs are not supported. This is because the
// layout engine that Vizdom uses currently only supports hierarchical layouts
// derived from directed graphs. The DOT language defines undirected graphs with
// the "graph" keyword, whereas directed graphs use "digraph".
const uDotGraph = parser.parse("graph { a -- b }");
try {
  // Attempting to convert an undirected graph to a directed one will throw an
  // error
  const _undirectedGraph = uDotGraph.to_directed();
} catch (err) {
  // Check for the expected error message when trying to convert an undirected
  // graph
  assert(err.message, "failed to downcast into a DirectedGraph");
}
