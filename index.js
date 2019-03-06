import t from "./template";

class Dance {
  constructor(options) {
    const { template, state, methods } = options;
    this.$template = template;
    this.$state = state;
    this.$methods = methods;
    this.$options = options;

    this._render();
  }

  _render() {
    const vnode = t(this.$template, this.$state);
  }
}

export default Dance;
