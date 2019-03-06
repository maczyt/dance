import Dance from "../../index";

new Dance({
  state: {
    t: "Hello World"
  },
  template: `
    <div>
      <% if (t) { %>
        <h1><%= t %></h1>
        <% } %>
    </div>
  `
});
