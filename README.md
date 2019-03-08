# 动手创建一个 MVVM 框架

## 知识点

1. 模板引擎
2. 模板解析
3. virtual dom
4. 事件代理

### 模板引擎

咱们的 MVVM 不和`react`的`JSX`和`vue`中的指令一样，我们将还是使用类似`ejs`的模板引擎渲染。

```html
<!-- 比如我们需要渲染数组列表: -->
<ul>
  <% for (let item of list) { %>
  <li></li>
  <% } %>
</ul>

<!-- 比如我们需要条件渲染 -->

<% if (condition) { %>
<span>open</span>
<% } else { %>
<span>close</span>
<% } %>
```

当我们需要渲染数据则通过`<%= item %>`来实现。

#### 使用

```js
const tmpl = `
    <div>
      <% if (t) { %>
        <h1><%= t %></h1>
        <% } %>
    </div>
  `;
const data = {
  t: 'Hello World';
};

template(tmpl, data); // <div><h1>Hello World</h1></div>
```

具体代码: [template.js](./template/template.js)

### 模板解析

上一步，我们传入数据和模板，我们可以到数据渲染后的 html 字符串。

在单纯使用模板引擎时候，我们接下来只需要设置`DOM`元素的`innerHTML`, 我们就可以访问页面了。

但是在 MVVM 中，我们将解析这段 html 字符串，并转为虚拟 DOM 节点，当节点更新，使用 diff 和 patch 来实现局部更新。

**那么我们如何解析 html 字符串为虚拟 DOM 节点呢？**, 限于篇幅，我们将使用[htm](https://github.com/developit/htm)库来实现，具体可以看我之前的文章[如何解析 template 成 VNODE](https://maczyt.github.io/2019/03/02/%E5%A6%82%E4%BD%95%E8%A7%A3%E6%9E%90template%E6%88%90VNODE/)

具体的是 htm 库会解析字符串中的元素, 收集到元素的 tagName，元素的 props 和元素的子节点。并且把这些数据作为参数传给我们绑定的函数。

```js
import htm from "htm";

function h(tagName, props, ...children) {}
const html = htm.bind(h);
```

### virtual dom

这里我们使用[`simple-virtual-dom`](https://github.com/livoras/simple-virtual-dom)库来实现虚拟 DOM 处理，我们对上面函数 h 做一点调整。

```js
import { el, diff, patch } from "simple-virtual-dom";
import htm from "htm";

function h(tagName, props, ...children) {
  return new el(tagName, props, children);
}
const html = htm.bind(h);

const vnode = html`
  <div><h1>Hello World</h1></div>
`;
```

通过上面几步，我们已实现 `template + data -> html_str -> vnode`。

这个时候，只要我们把 vnode 挂载到具体 DOM 元素上即能看到效果。并且当 data 发生改变时，我们再执行:

`template + data -> html_str -> new vnode`, 通过 diff 算法比较新旧虚拟节点树，并 patch 到 DOM 上。

更多 virtual dom 知识可以查看文章[深度剖析：如何实现一个 Virtual DOM 算法](https://github.com/livoras/blog/issues/13)

### 事件委托

在元素上绑定的事件，通过事件委托，在 window 对象上处理，节约开销。事件委托的实现原理可以阅读[delegate](https://www.npmjs.com/package/delegate)源码。

为了能进行准确的元素事件委托，这里我们会在`simple-virtual-dom`库中，对每个节点，增加一个`uid`，当`render`的时候，给 DOM 元素增加属性`dance-el-${uid}`。

然后在事件委托处理中，通过属性选择器来对具体的元素进行事件处理。

eg. `delegate(window, '[dance-el-${uid}]', 'click', callback)`

具体代码: [./simple-virtual-dom/lib/element.js](./simple-virtual-dom/lib/element.js)

## 进度

1. 2019/3/6 70%
2. 2019/3/7 100%

```
  1. fix template 模板引擎 bug
  2. 增加事件代理
  3. 增加 example: count
```

3. 2019/3/8

```
1. 解决props条件渲染，增加:属性判断
```

## example

### [Live demo](https://maczyt.github.io/dance/index.html)

### 运行

```shell
1. git clone https://github.com/maczyt/dance.git
2. yarn or npm install
3. yarn run [xxx]
```

1. [Count](./example/count) `yarn run em:count`
2. [Todo](./example/todo) `yarn run em:todo`

### TODO

1. 组件
2. props
3. setState 的异步执行
4. 还在想. 🤭
