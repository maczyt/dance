import Dance from "../../index";

new Dance({
  el: "#app",
  state: {
    count: 0
  },
  methods: {
    handleAdd() {
      this.setState({
        count: this.state.count + 1
      });
    },
    handleMin() {
      this.setState({
        count: this.state.count - 1
      });
    }
  },
  template: `
    <div>
      <h1>Dance Count</h1>
      <p>Count: <%= count %></p>
      <p>
        <button @click="handleAdd">+</button> <button @click="handleMin">-</button>
      </p>
    </div>
  `
});
