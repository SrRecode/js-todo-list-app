// Pure, immutable todo logic. Every function takes the current list and
// returns a brand new list so state transitions are easy to reason about and
// unit test. No DOM or storage access happens here.

/**
 * @typedef {{ id: string, text: string, completed: boolean, createdAt: number }} Todo
 */

let counter = 0;

/** Generate a reasonably unique id without external dependencies. */
export function makeId() {
  counter += 1;
  return `${Date.now().toString(36)}-${counter.toString(36)}`;
}

/**
 * Create a todo item.
 * @param {string} text
 * @param {string} [id]
 * @param {number} [createdAt]
 * @returns {Todo}
 */
export function createTodo(text, id = makeId(), createdAt = Date.now()) {
  const trimmed = String(text).trim();
  if (!trimmed) throw new Error('Todo text cannot be empty');
  return { id, text: trimmed, completed: false, createdAt };
}

/**
 * Add a todo to the list. Blank text is ignored.
 * @param {Todo[]} todos
 * @param {string} text
 */
export function addTodo(todos, text) {
  const trimmed = String(text).trim();
  if (!trimmed) return todos;
  return [...todos, createTodo(trimmed)];
}

/**
 * Toggle the completed flag of a todo.
 * @param {Todo[]} todos
 * @param {string} id
 */
export function toggleTodo(todos, id) {
  return todos.map((todo) =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo,
  );
}

/**
 * Remove a todo by id.
 * @param {Todo[]} todos
 * @param {string} id
 */
export function removeTodo(todos, id) {
  return todos.filter((todo) => todo.id !== id);
}

/**
 * Update the text of a todo. Empty text is ignored.
 * @param {Todo[]} todos
 * @param {string} id
 * @param {string} text
 */
export function updateTodo(todos, id, text) {
  const trimmed = String(text).trim();
  if (!trimmed) return todos;
  return todos.map((todo) =>
    todo.id === id ? { ...todo, text: trimmed } : todo,
  );
}

/**
 * @param {Todo[]} todos
 * @param {'all'|'active'|'completed'} filter
 */
export function filterTodos(todos, filter) {
  if (filter === 'active') return todos.filter((todo) => !todo.completed);
  if (filter === 'completed') return todos.filter((todo) => todo.completed);
  return todos;
}

/** Remove every completed todo. */
export function clearCompleted(todos) {
  return todos.filter((todo) => !todo.completed);
}

/** Number of todos still to do. */
export function countRemaining(todos) {
  return todos.filter((todo) => !todo.completed).length;
}
