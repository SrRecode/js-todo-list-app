import test from 'node:test';
import assert from 'node:assert/strict';

import {
  addTodo,
  createTodo,
  toggleTodo,
  removeTodo,
  updateTodo,
  filterTodos,
  clearCompleted,
  countRemaining,
} from '../src/todos.js';

const sample = () => [
  createTodo('Write tests', 'a', 1),
  createTodo('Ship the app', 'b', 2),
];

test('createTodo trims text and defaults to active', () => {
  const todo = createTodo('  Buy milk  ', 'x', 5);
  assert.deepEqual(todo, {
    id: 'x',
    text: 'Buy milk',
    completed: false,
    createdAt: 5,
  });
});

test('createTodo rejects empty text', () => {
  assert.throws(() => createTodo('   '), /cannot be empty/);
});

test('addTodo appends and ignores blanks', () => {
  const list = addTodo([], 'First');
  assert.equal(list.length, 1);
  assert.equal(list[0].text, 'First');

  const unchanged = addTodo(list, '   ');
  assert.equal(unchanged, list);
});

test('toggleTodo flips only the matching item (immutably)', () => {
  const list = sample();
  const toggled = toggleTodo(list, 'a');
  assert.equal(toggled[0].completed, true);
  assert.equal(toggled[1].completed, false);
  assert.equal(list[0].completed, false, 'original must not mutate');
});

test('removeTodo drops the matching item', () => {
  const list = sample();
  assert.deepEqual(
    removeTodo(list, 'a').map((t) => t.id),
    ['b'],
  );
});

test('updateTodo changes text and ignores blanks', () => {
  const list = sample();
  assert.equal(updateTodo(list, 'b', 'Ship it')[1].text, 'Ship it');
  assert.equal(updateTodo(list, 'b', '  ')[1].text, 'Ship the app');
});

test('filterTodos returns the right slice', () => {
  const list = toggleTodo(sample(), 'a');
  assert.equal(filterTodos(list, 'all').length, 2);
  assert.deepEqual(
    filterTodos(list, 'active').map((t) => t.id),
    ['b'],
  );
  assert.deepEqual(
    filterTodos(list, 'completed').map((t) => t.id),
    ['a'],
  );
});

test('clearCompleted and countRemaining', () => {
  const list = toggleTodo(sample(), 'a');
  assert.deepEqual(
    clearCompleted(list).map((t) => t.id),
    ['b'],
  );
  assert.equal(countRemaining(list), 1);
});
