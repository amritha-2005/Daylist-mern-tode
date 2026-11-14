import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import TodoForm from './components/TodoForm.jsx';
import TodoList from './components/TodoList.jsx';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request(path, options) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers
    }
  });

  if (!response.ok) {
    const result = await response.json().catch(() => ({}));
    throw new Error(result.message || `Request failed (${response.status}).`);
  }
  return response.status === 204 ? null : response.json();
}

export default function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [error, setError] = useState('');
  const [announcement, setAnnouncement] = useState('');
  const inputRef = useRef(null);

  const loadTodos = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setTodos(await request('/todos'));
      setLoadFailed(false);
    } catch (loadError) {
      setLoadFailed(true);
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  const remaining = useMemo(() => todos.filter((todo) => !todo.completed).length, [todos]);
  const completed = todos.length - remaining;

  async function addTodo(text) {
    try {
      const todo = await request('/todos', {
        method: 'POST',
        body: JSON.stringify({ text })
      });
      setTodos((current) => [todo, ...current]);
      setError('');
      setAnnouncement(`Added task: ${todo.text}`);
      return true;
    } catch (addError) {
      setError(addError.message);
      return false;
    }
  }

  async function toggleTodo(todo) {
    try {
      const updated = await request(`/todos/${todo._id}`, {
        method: 'PUT',
        body: JSON.stringify({ completed: !todo.completed })
      });
      setTodos((current) => current.map((item) => item._id === updated._id ? updated : item));
      setError('');
    } catch (toggleError) {
      setError(toggleError.message);
    }
  }

  async function deleteTodo(todo) {
    try {
      await request(`/todos/${todo._id}`, { method: 'DELETE' });
      setTodos((current) => current.filter((item) => item._id !== todo._id));
      setError('');
      setAnnouncement(`Deleted task: ${todo.text}`);
      return true;
    } catch (deleteError) {
      setError(deleteError.message);
      return false;
    }
  }

  return (
    <>
      <a className="skip-link" href="#new-todo">Skip to add a task</a>
      <main id="main-content" className="page-shell">
        <section className="todo-card" aria-labelledby="page-title">
          <header className="page-header">
            <div className="brand-mark" aria-hidden="true">d.</div>
            <p className="eyebrow">A little more focus</p>
            <h1 id="page-title">Your day,<br /><span>in good order.</span></h1>
            <p className="subtitle">Keep the important things moving.</p>
          </header>

          <TodoForm onAdd={addTodo} disabled={loading} inputRef={inputRef} />

          <section className="task-section" aria-labelledby="tasks-heading">
            <div className="list-heading">
              <h2 id="tasks-heading">Today&apos;s tasks</h2>
              <span
                className="task-count"
                role={loading ? undefined : 'status'}
                aria-live={loading ? 'off' : 'polite'}
                aria-atomic="true"
              >
                {loading
                  ? 'Loading tasks'
                  : loadFailed
                    ? 'Tasks unavailable'
                    : `${remaining} ${remaining === 1 ? 'task' : 'tasks'} left`}
              </span>
            </div>

            {error && (
              <div className="error-message" role="alert">
                <span>{error}</span>
                <button type="button" onClick={loadTodos}>Reload tasks</button>
              </div>
            )}

            {loading ? (
              <p className="loading-state" role="status">Loading your tasks…</p>
            ) : loadFailed ? null : (
              <TodoList todos={todos} onToggle={toggleTodo} onDelete={deleteTodo} inputRef={inputRef} />
            )}
          </section>

          {!loading && !loadFailed && (
            <footer className="list-footer">
              <span>{completed ? `${completed} completed` : 'One step at a time.'}</span>
              <span className="footer-dot" aria-hidden="true">●</span>
            </footer>
          )}
        </section>
        <p className="page-note">Make space for what matters.</p>
      </main>
      <div className="visually-hidden" aria-live="polite" aria-atomic="true">{announcement}</div>
    </>
  );
}
