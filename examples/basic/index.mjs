import { DirectedGraph } from "@vizdom/vizdom-ts-node";
import fs from "node:fs/promises";

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
