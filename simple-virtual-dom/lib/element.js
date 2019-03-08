import delegate from "delegate";
var _ = require("./util");

// 唯一Id
let uid = 0;
/**
 * Virtual-dom Element.
 * @param {String} tagName
 * @param {Object} props - Element's properties,
 *                       - using object to store key-value pair
 * @param {Array<Element|String>} - This element's children elements.
 *                                - Can be Element instance or just a piece plain text.
 */
function Element(tagName, props, children) {
  if (!(this instanceof Element)) {
    if (!_.isArray(children) && children != null) {
      children = _.slice(arguments, 2).filter(_.truthy);
    }
    return new Element(tagName, props, children);
  }

  if (_.isArray(props)) {
    children = props;
    props = {};
  }

  this.tagName = tagName;
  this.props = props || {};
  this.children = children || [];
  this.key = props ? props.key : void 666;
  this.uid = uid++;

  var count = 0;

  _.each(this.children, function(child, i) {
    if (child instanceof Element) {
      count += child.count;
    } else {
      children[i] = "" + child;
    }
    count++;
  });

  this.count = count;
}

/**
 * Render the hold element tree.
 */
Element.prototype.render = function() {
  var el = document.createElement(this.tagName);
  var props = this.props;
  const vm = this._vm;

  for (var propName in props) {
    var propValue = props[propName];
    if (propName.startsWith("@")) {
      // 事件处理
      const callback = (vm.$methods[propValue] || function() {}).bind(vm);
      delegate(window, `[dance-el-${this.uid}]`, propName.slice(1), callback);
      continue;
    }
    // if (propName.startsWith("d-")) {
    //   propName = propName.slice(2);
    //   // 属性处理
    //   if (propValue === false && propName !== "class") {
    //     el.removeAttribute(propName);
    //     continue;
    //   }
    // }
    _.setAttr(el, propName, propValue);
  }
  // 添加uid属性
  _.setAttr(el, "dance-el-" + this.uid, "");

  _.each(this.children, function(child) {
    var childEl =
      child instanceof Element
        ? child.render()
        : document.createTextNode(child);
    el.appendChild(childEl);
  });

  return el;
};

module.exports = Element;
