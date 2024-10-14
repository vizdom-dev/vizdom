import {
  ArrowHead,
  Dir,
  DirectedGraph,
  EdgeStyle,
  LabelPos,
  RankDir,
  Shape,
  VertexStyle,
} from "@vizdom/vizdom-ts-node";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const graph = new DirectedGraph({
  layout: {
    // Change the direction of the ranked graph
    edge_sep: 75,
    rank_dir: RankDir.TB,
  },
  render: {
    bg_color: "whitesmoke",
  },
});
const v0 = graph.new_vertex({
  render: {
    label: "Foo",
    color: "#ff2f8e",
    fill_color: "#ff2f8eaa",
    shape: Shape.Triangle,
    style: VertexStyle.Dashed,
  },
});
const v1 = graph.new_vertex({
  render: {
    label: "Bar",
    pen_width: 2,
    color: "#ff9e4c",
    fill_color: "#ff9e4caa",
    font_size: 20,
    shape: Shape.Diamond,
  },
});
const v2 = graph.new_vertex({
  render: {
    label: "Baz",
    pen_width: 2,
    color: "#ffd600",
    fill_color: "#ffd600aa",
    font_size: 20,
    shape: Shape.Circle,
  },
});

const v3 = graph.new_vertex({
  render: {
    label: "Qux",
    color: "#66df48",
    fill_color: "#66df48aa",
    shape: Shape.Square,
  },
});

graph.new_edge(v0, v1, {
  layout: {
    label_pos: LabelPos.R,
  },
  render: {
    label: "An underlined edge",
    shape: Shape.Underline,
    pen_width: 2,
    color: "#6a77dd",
    font_color: "#6a77dd",
  },
});
graph.new_edge(v1, v2, {
  layout: {
    label_pos: LabelPos.R,
  },
  render: {
    label: "A backwards arrow",
    dir: Dir.Back,
    color: "#ffd600",
  },
});
graph.new_edge(v0, v2, {
  layout: {
    label_pos: LabelPos.C,
  },
  render: {
    label: "A boxed, centered,\nfilled, edge",
    shape: Shape.Rectangle,
    color: "#ff2f8e",
    fill_color: "#ff2f8eaa",
    font_color: "white",
    style: EdgeStyle.Dotted,
  },
});
graph.new_edge(v0, v3, {
  layout: {
    label_pos: LabelPos.R,
  },
  render: {
    label: "A cycle!",
    font_size: 20,
    color: "#9803ce",
    font_color: "#9803ceaa",
  },
});

graph.new_edge(v3, v0, {
  layout: {
    label_pos: LabelPos.L,
  },
  render: {
    label: "No arrowheads",
    style: EdgeStyle.Dashed,
    color: "#66df48",
    font_color: "#66df48",
    arrow_head: ArrowHead.None,
  },
});

const positionted = graph.layout();
const svg = positionted.to_svg();

await fs.writeFile(path.join(__dirname, "graph.svg"), svg.to_string());
