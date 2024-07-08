import fs from "node:fs/promises";
import util from "node:util";
import { DirectedGraph } from "@vizdom/vizdom-ts-node";

// Create a new graph. We're overriding several default spacing attributes just
// for easy comparison of the JSON output. In most cases, overriding the margin
// is enough.
const graph = new DirectedGraph({
  layout: {
    rank_sep: 10, // Sets the spacing between rows (ranks)
    // overriding to `0` just for this demo
    node_sep: 0, // No space between columns (horizontal) for nodes
    edge_sep: 0, // No space between columns (horizontal) edge labels
    // supply your own margin dimensions if needed
    margin_x: 0,
    margin_y: 0,
  },
});

// Add vertices
const v0 = graph.new_vertex(
  {
    layout: {
      // supply your own bounding box dimensions
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
const v1 = graph.new_vertex(
  {
    layout: {
      // supply your own bounding box dimensions
      shape_w: 10,
      shape_h: 10,
    },
    render: {
      id: "v1",
    },
  },
  {
    compute_bounding_box: false,
  }
);

// Add an edge between the vertices
graph.new_edge(
  v0,
  v1,
  {
    layout: {
      // We can also set to `0` to avoid the positioned graph from including
      // space for edge label boxes if there's nothing to render (no label, nor
      // any DOM nodes `getBoundingClientRect()`)
      shape_w: 0,
      shape_h: 0,
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
const json = positioned.to_json();

// Obtain a JS/TS object directly for manipulation
const jsonObj = json.to_obj();
console.log(util.inspect(jsonObj, {showHidden: false, depth: null, colors: true}))

// ...Or obtain to a json string
//
// NOTE: You can make it compact json string using `json.to_string()`
await fs.writeFile("./graph.json", json.to_string_pretty());
