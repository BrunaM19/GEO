const API_URL = 'http://localhost:3000/api';

export async function register(data) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function login(data) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function getProjects(token) {
  const res = await fetch(`${API_URL}/projects`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return res.json();
}