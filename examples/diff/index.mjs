import { DirectedGraph, Util } from "@vizdom/vizdom-ts-node";
import fs from "node:fs/promises";

// First graph
const g0 = new DirectedGraph();
const v0_g0 = g0.new_vertex({
  render: {
    id: "0",
    label: "A",
  },
});
const v1_g0 = g0.new_vertex({
  render: {
    id: "1",
    label: "B",
  },
});
const v2_g0 = g0.new_vertex({
  render: {
    id: "2",
    label: "C",
  },
});
const v3_g0 = g0.new_vertex({
  render: {
    id: "3",
    label: "D",
  },
});

g0.new_edge(v0_g0, v1_g0, {
  render: {
    id: "0",
  },
});
g0.new_edge(v0_g0, v2_g0, {
  render: {
    id: "1",
  },
});
g0.new_edge(v1_g0, v3_g0, {
  render: {
    id: "2",
  },
});
g0.new_edge(v2_g0, v3_g0, {
  render: {
    id: "3",
  },
});

// Second graph
const g1 = new DirectedGraph();
const v0_g1 = g1.new_vertex({
  render: {
    id: "0",
    //  Notice the change in 'label'.
    label: "Modified",
  },
});
const v1_g1 = g1.new_vertex({
  render: {
    id: "1",
    label: "B",
  },
});
const v2_g1 = g1.new_vertex({
  render: {
    id: "2",
    label: "C",
  },
});
const v4_g1 = g1.new_vertex({
  render: {
    // Notice the change in 'id'.
    id: "4",
    label: "D",
  },
});

g1.new_edge(v0_g1, v1_g1, {
  render: {
    id: "0",
  },
});
g1.new_edge(v0_g1, v2_g1, {
  render: {
    id: "1",
  },
});
g1.new_edge(v1_g1, v4_g1, {
  render: {
    id: "2",
  },
});
g1.new_edge(v2_g1, v4_g1, {
  render: {
    id: "3",
  },
});

// Next, we compute the difference which changes some
// styling attributes on __both__ graphs.
//
// NOTE: this is irreversible!
Util.diff(g0, g1);
const positionted0 = g0.layout();
const svg0 = positionted0.to_svg();

const positionted1 = g1.layout();
const svg1 = positionted1.to_svg();

await fs.writeFile("./graph0.svg", svg0.to_string());
await fs.writeFile("./graph1.svg", svg1.to_string());
