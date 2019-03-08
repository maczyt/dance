import Dance from "../../index";

function uuid() {
  return Math.random()
    .toString(16)
    .slice(2);
}

new Dance({
  el: "#app",
  state: {
    type: "all",
    list: [
      {
        id: uuid(),
        completed: false,
        title: "This is dancejs"
      }
    ]
  },
  methods: {
    handleAdd(event) {
      const { keyCode, target } = event;
      if (keyCode === 13) {
        const value = target.value;
        this.setState({
          ...this.state,
          list: [
            {
              id: uuid(),
              completed: false,
              title: value
            },
            ...this.state.list
          ]
        });
        target.value = "";
      }
    },
    handleEdit(event) {
      const { target } = event;
      const todo = target.parentNode.parentNode;
      todo.classList.add("editing");
    },
    handleEditOk(event) {
      const { keyCode, target } = event;
      const todo = target.parentNode;
      if (keyCode === 13) {
        const list = this.state.list.slice();
        const id = todo.getAttribute("index");
        for (let item of list) {
          if (item.id === id) {
            item.title = target.value;
            break;
          }
        }
        this.setState({
          ...this.state,
          list
        });
        todo.classList.remove("editing");
      }
    },
    handleToggle(event) {
      const { target } = event;
      const todo = target.parentNode.parentNode;
      const list = this.state.list.slice();
      const id = todo.getAttribute("index");
      for (let item of list) {
        if (item.id === id) {
          item.completed = target.checked;
          break;
        }
      }
      this.setState({
        ...this.state,
        list
      });
    },
    toggleAll(event) {
      const { target } = event;
      const checked = target.checked;
      const list = this.state.list.slice();
      for (let item of list) {
        item.completed = checked;
      }
      this.setState({
        ...this.state,
        list
      });
    },

    handleRoute(hash) {
      const route = hash.newURL.slice(hash.newURL.indexOf("#") + 1);
      let type = "all";
      if (route === "/") {
        type = "all";
      } else if (route === "/active") {
        type = "active";
      } else if (route === "/completed") {
        type = "completed";
      }
      this.setState({
        ...this.state,
        type
      });
    },

    handleClear() {
      const list = this.state.list.slice().filter(item => !item.completed);
      this.setState({
        ...this.state,
        list
      });
    },

    handleDestroy(event) {
      const { target } = event;
      const todo = target.parentNode.parentNode;
      const id = todo.getAttribute("index");
      const list = this.state.list.slice().filter(item => item.id !== id);
      this.setState({
        ...this.state,
        list
      });
    }
  },
  mounted() {
    window.addEventListener(
      "hashchange",
      this.$methods.handleRoute.bind(this),
      false
    );
  },
  template: `
    <div>
      <section class="todoapp">
        <header class="header">
          <h1>todos</h1>
          <input @keyup="handleAdd" class="new-todo" placeholder="What needs to be done?" autofocus />
        </header>
        <section class="main">
          <input @change="toggleAll" id="toggle-all" class="toggle-all" type="checkbox" />
          <label for="toggle-all">Mark all as complete</label>
          <ul class="todo-list">
            <% for (let todo of list.filter(item => { if(type === 'all') return true; if (type === 'active') return !item.completed; if(type==='completed') return item.completed; })) { %>
              <li class="<%= (todo.completed ? 'completed' : '') %>" index="<%= todo.id %>">
                <div class="view">
                  <input @change="handleToggle" type="checkbox" class="toggle" <%= (todo.completed ? 'checked' : '') %> />
                  <label @dblclick="handleEdit" for="true"><%= todo.title %></label>
                  <button class="destroy" @click="handleDestroy"></button>
                </div>
                <input class="edit" @keyup="handleEditOk" value="<%= todo.title%>" />
              </li>
            <% } %>
          </ul>
        </section>
        <footer class="footer">
          <span class="todo-count"></span>
          <ul class="filters">
            <li>
              <a href="#/" class="<%= (type=== 'all'?'selected':'')%>">All</a>
            </li>
            <li>
              <a href="#/active" class="<%= (type === 'active' ? 'selected' : '') %>">Active</a>
            </li>
            <li>
              <a href="#/completed" class="<%= (type === 'completed' ? 'selected' : '') %>">Completed</a>
            </li>
          </ul>
          <button class="clear-completed" @click="handleClear">Clear completed</button>
        </footer>
      </section>
      <footer class="info">
        <p>Double-click to edit a todo</p>
        <p>Created by <a href="https://github.com/maczyt">maczyt</a></p>
        <p>Use Frame by <a href="https://github.com/maczyt/dance">dancejs</a></p>
        <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
      </footer>
    </div>
  `
});
