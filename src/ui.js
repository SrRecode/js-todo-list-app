import {
  addTodo,
  toggleTodo,
  removeTodo,
  updateTodo,
  filterTodos,
  clearCompleted,
  countRemaining,
} from './todos.js';

const STORAGE_KEY = 'js-todo-list-app.todos';

const form = document.getElementById('new-todo-form');
const input = document.getElementById('new-todo');
const listEl = document.getElementById('todo-list');
const countEl = document.getElementById('count');
const emptyEl = document.getElementById('empty');
const clearBtn = document.getElementById('clear-completed');
const filterEls = Array.from(document.querySelectorAll('[data-filter]'));

let todos = load();
let filter = 'all';
let editingId = null;

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  render();
}

function renderItem(todo) {
  const li = document.createElement('li');
  li.className = 'todo' + (todo.completed ? ' todo--done' : '');
  li.dataset.id = todo.id;

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'todo__toggle';
  checkbox.checked = todo.completed;
  checkbox.setAttribute(
    'aria-label',
    `Mark "${todo.text}" as ${todo.completed ? 'active' : 'done'}`,
  );

  const text = document.createElement('span');
  text.className = 'todo__text';
  text.textContent = todo.text;
  text.title = 'Double-click to edit';
  text.addEventListener('dblclick', () => startEdit(li, todo));

  const del = document.createElement('button');
  del.type = 'button';
  del.className = 'todo__delete';
  del.textContent = '\u00d7';
  del.setAttribute('aria-label', `Delete "${todo.text}"`);

  li.append(checkbox, text, del);
  return li;
}

function render() {
  const visible = filterTodos(todos, filter);
  listEl.replaceChildren(...visible.map(renderItem));

  emptyEl.hidden = visible.length !== 0;
  countEl.textContent = `${countRemaining(todos)} left`;
  clearBtn.disabled = !todos.some((todo) => todo.completed);

  for (const el of filterEls) {
    el.classList.toggle('active', el.dataset.filter === filter);
  }
}

function startEdit(li, todo) {
  if (editingId) return;
  editingId = todo.id;

  const editor = document.createElement('input');
  editor.type = 'text';
  editor.className = 'todo__editor';
  editor.value = todo.text;
  editor.setAttribute('aria-label', 'Edit todo');
  editor.maxLength = 280;

  li.replaceChild(editor, li.querySelector('.todo__text'));
  editor.focus();
  editor.setSelectionRange(editor.value.length, editor.value.length);

  const commit = () => {
    if (editingId !== todo.id) return;
    editingId = null;
    todos = updateTodo(todos, todo.id, editor.value);
    persist();
  };

  editor.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      commit();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      editingId = null;
      render();
    }
  });
  editor.addEventListener('blur', commit);
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const next = addTodo(todos, input.value);
  if (next !== todos) {
    todos = next;
    input.value = '';
    persist();
  }
  input.focus();
});

listEl.addEventListener('change', (event) => {
  const toggle = event.target.closest('.todo__toggle');
  if (!toggle) return;
  todos = toggleTodo(todos, toggle.closest('.todo').dataset.id);
  persist();
});

listEl.addEventListener('click', (event) => {
  const del = event.target.closest('.todo__delete');
  if (!del) return;
  todos = removeTodo(todos, del.closest('.todo').dataset.id);
  persist();
});

for (const el of filterEls) {
  el.addEventListener('click', () => {
    filter = el.dataset.filter;
    render();
  });
}

clearBtn.addEventListener('click', () => {
  todos = clearCompleted(todos);
  persist();
});

render();
