# js-todo-list-app

A simple, dependency-free todo list built with **vanilla JavaScript** that persists your tasks in the browser via **localStorage**.

All list logic lives in a pure, immutable module (`src/todos.js`) that is unit tested, so behaviour is verified independently of the DOM.

## Features

- **Add, complete, edit, and delete** todos.
- **Inline editing** — double-click any task to edit it, `Enter` to save, `Esc` to cancel.
- **Filters** — view All / Active / Completed tasks.
- **Clear completed** in one click.
- **Live "items left" counter**.
- **Local storage persistence** — your list survives refreshes and browser restarts.
- **Accessible** — labelled controls, keyboard-friendly, focus styles, and a friendly empty state.
- **Responsive** layout that works on phones and desktop.

## Getting started

```sh
# Option 1: open the file directly
start index.html        # Windows
open index.html         # macOS

# Option 2: serve it (required for the ES module import in some browsers)
npx --yes serve .
```

## Running the tests

The list logic is covered by Node's built-in test runner (Node 18+):

```sh
npm test
```

```
> js-todo-list-app@1.0.0 test
> node --test

✔ createTodo trims text and defaults to active
✔ createTodo rejects empty text
✔ addTodo appends and ignores blanks
✔ toggleTodo flips only the matching item (immutably)
✔ removeTodo drops the matching item
✔ updateTodo changes text and ignores blanks
✔ filterTodos returns the right slice
✔ clearCompleted and countRemaining
```

## Project structure

```
js-todo-list-app/
├── index.html          # Markup: form, list, filters, footer
├── styles.css          # Responsive light theme
├── src/
│   ├── todos.js        # Pure immutable list logic (tested)
│   └── ui.js           # DOM rendering, localStorage, event wiring
├── test/
│   └── todos.test.js   # node:test unit tests
├── package.json
└── README.md
```

### Design notes

- Every operation in `todos.js` returns a **new array** instead of mutating, which keeps state transitions predictable and makes the tests trivial.
- `ui.js` only touches the DOM and `localStorage`; it never re-implements business rules.
- User text is inserted with `textContent`, so task content can never be interpreted as HTML.

## Tech

- Vanilla JavaScript (ES modules)
- HTML5 + semantic elements
- Modern CSS (custom properties, flexbox)
- `localStorage` for persistence
- Node's built-in `node:test` for unit tests

## License

MIT
