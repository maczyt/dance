import { diff, patch } from "simple-virtual-dom";
import t from "./template";

class Dance {
  constructor(options) {
    const { template, state, methods } = options;
    this.state = state;

    this.$template = template;
    this.$methods = methods;
    this.$options = options;
    this.$tree = null;
    this.$root = null;
    this._render();
  }

  _render() {
    const tree = t(this.$template, this.state);
    this.$tree = tree;
    tree.render._vm = this;
    // vm挂载到元素构造器原型上,避免patch时候获取不到vm
    tree.constructor.prototype._vm = this;
    this.$root = tree.render();
    // 挂载的元素
    let mountEl = this.$options.el;
    if (typeof mountEl === "undefined") {
      throw new Error("options el is required");
    }
    mountEl = document.querySelector(mountEl);
    mountEl.innerHTML = "";
    mountEl.appendChild(this.$root);

    if (this.$options.mounted) {
      this.$options.mounted.call(this);
    }
  }

  setState(newState) {
    this.state = newState;
    this.forceUpdate();
  }

  forceUpdate() {
    const newTree = t(this.$template, this.state);
    const patches = diff(this.$tree, newTree);
    patch(this.$root, patches);
    this.$tree = newTree;
  }
}

export default Dance;
