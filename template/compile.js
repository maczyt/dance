import htm from "htm";
import { el } from "../simple-virtual-dom";

function h(tagName, props, ...children) {
  return new el(tagName, props, ...children);
}

export default function compile(html_str) {
  return htm.bind(h)([html_str]);
}
