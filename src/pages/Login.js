import React, { useState } from 'react';
import { login } from '../services/api';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    const data = await login({ email, password });

    if (data.token) {
      localStorage.setItem('token', data.token);
      onLogin(data.user);
    } else {
      setError(data.message || 'Erro ao fazer login');
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" placeholder="Email" value={email}
        onChange={e => setEmail(e.target.value)} required />
      <input type="password" placeholder="Senha" value={password}
        onChange={e => setPassword(e.target.value)} required />
      <button type="submit">Entrar</button>
      {error && <p style={{color:'red'}}>{error}</p>}
    </form>
  );
}