import Dance from "../../index";

new Dance({
  el: "body",
  state: {
    count: 0
  },
  template: `
    <div>
      <h1>Count: <%= count %></h1>
      <h2>Code: </h2>
      <div class="code" style="font-size: 20px;background: #000; color: #fff;">
      <code>
        this.setState({
          count: this.state.count + 1
        }, true);
        <br/>
        this.setState({
          count: this.state.count + 1
        }, true);    
      </code>
      </div>
    </div>
  `,
  mounted() {
    this.setState(
      {
        count: this.state.count + 1
      },
      true
    );

    this.setState(
      {
        count: this.state.count + 1
      },
      true
    );
  }
});
