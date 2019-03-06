import template from "./template";

export default function t(tmpl, data) {
  const html_str = template(tmpl, data);
  console.log(html_str);
}
