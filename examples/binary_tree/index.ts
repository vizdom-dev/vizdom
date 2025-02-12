import { Curve, DirectedGraph, LabelPos, Shape } from "@vizdom/vizdom-ts-node";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const graph = new DirectedGraph(
  {},
  {
    client_id: process.env.VIZDOM_CLIENT_ID || "",
    client_secret: process.env.VIZDOM_CLIENT_SECRET || "",
    graph_id: process.env.VIZDOM_GRAPH_ID || "",
  }
);

const NUM_NODES = 31;

// Create vertices with default properties.
// Their fill_color will be updated after in-order traversal.
const vertices = Array.from({ length: NUM_NODES }, (_, i) =>
  graph.new_vertex({
    render: {
      label: String(i),
      shape: i % 2 === 0 ? Shape.Square : Shape.Diamond,
      font_color: "#111111",
      pen_width: 2,
      font_size: 24,
    },
  })
);

/**
 * Recursively build a list of node indices in an in-order sequence (left -> node -> right).
 */
function inOrderIndices(index: number, result: number[] = []): number[] {
  if (index >= NUM_NODES) return result;
  inOrderIndices(2 * index + 1, result); // left
  result.push(index); // node
  inOrderIndices(2 * index + 2, result); // right
  return result;
}

// Compute the in-order list to determine each node's position from left to right.
const inOrderList = inOrderIndices(0);
const nodeColors: string[] = [];

// Assign HSV-based rainbow colors to nodes based on in-order rank.
inOrderList.forEach((nodeId, idx) => {
  // Hue in [0..1], full saturation/value, fully opaque alpha
  const hue = idx / inOrderList.length;
  const s = 1;
  const v = 1;
  const a = 1;
  const fillColor = `${hue.toFixed(3)},${s},${v},${a}`;

  nodeColors[nodeId] = fillColor;

  // Update the vertex render settings
  vertices[nodeId].set((prev) => ({
    ...prev,
    render: {
      ...prev.render,
      color: fillColor,
      fill_color: fillColor,
    },
  }));
});

// Link each node to its children, coloring edges with the parent's hue.
for (let i = 0; i < NUM_NODES; i++) {
  const left = 2 * i + 1;
  const right = 2 * i + 2;
  const parentColor = nodeColors[i];

  if (left < NUM_NODES) {
    graph.new_edge(vertices[i], vertices[left], {
      render: {
        label: "L",
        pen_width: 2,
        color: parentColor,
        shape: Shape.Underline,
        font_color: "#111111",
        fill_color: parentColor,
        curve: Curve.SimpleQuadratic,
        font_size: 24,
      },
      layout: { label_pos: LabelPos.L },
    });
  }

  if (right < NUM_NODES) {
    graph.new_edge(vertices[i], vertices[right], {
      render: {
        label: "R",
        pen_width: 2,
        color: parentColor,
        shape: Shape.Underline,
        font_color: "#111111",
        fill_color: parentColor,
        curve: Curve.SimpleQuadratic,
        font_size: 24,
      },
      layout: { label_pos: LabelPos.R },
    });
  }
}

// Layout and save the final SVG.
const positioned = graph.layout();
await fs.writeFile(
  path.join(__dirname, "graph.svg"),
  positioned.to_svg().with_width_and_height().to_string()
);
