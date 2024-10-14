import { DirectedGraph } from "@vizdom/vizdom-ts-node";

// Create a new graph
const graph = new DirectedGraph(
  {}, // <-- optional layout and render attributes.
  {
    client_id: process.env.VIZDOM_CLIENT_ID || "",
    client_secret: process.env.VIZDOM_CLIENT_SECRET || "",
    graph_id: process.env.VIZDOM_GRAPH_ID || "",
  }
);

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
