const API_URL = process.env.API_URL || 'http://localhost:8000';

async function requestJson(method, path, body) {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok && res.status !== 204) {
    throw new Error(`${method} ${path} failed: ${res.status} ${await res.text()}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  resetTodos: () => requestJson('POST', '/api/todos/reset'),
  resetCounter: () => requestJson('POST', '/api/counter/reset'),
  listTodos: () => requestJson('GET', '/api/todos'),
  getCounter: () => requestJson('GET', '/api/counter'),
};
