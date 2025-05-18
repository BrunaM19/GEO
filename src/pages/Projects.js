import React, { useEffect, useState } from 'react';
import { getProjects } from '../services/api';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    async function fetchProjects() {
      const data = await getProjects(token);
      setProjects(data);
    }
    fetchProjects();
  }, [token]);

  return (
    <div>
      <h2>Meus Projetos</h2>
      <ul>
        {projects.length === 0 && <li>Nenhum projeto encontrado</li>}
        {projects.map(p => (
          <li key={p.id}>{p.title} - {p.status}</li>
        ))}
      </ul>
    </div>
  );
}
