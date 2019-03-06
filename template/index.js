import template from "./template";
import compile from "./compile";

export default function t(tmpl, data) {
  const html_str = template(tmpl, data);
  return compile(html_str);
}
