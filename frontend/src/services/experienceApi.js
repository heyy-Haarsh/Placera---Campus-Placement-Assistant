const API_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
const BASE = `${API_URL}/api/experiences`;

export async function fetchExperiences(filters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v); });
  const res = await fetch(`${BASE}?${params}`);
  if (!res.ok) throw new Error('Failed to fetch experiences');
  return res.json(); // { experiences, total }
}

export async function submitExperience(data) {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to submit experience');
  return res.json();
}

export async function voteExperience(id, direction, userId) {
  const res = await fetch(`${BASE}/${id}/vote`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ direction, userId }),
  });
  if (!res.ok) throw new Error('Failed to vote');
  return res.json(); // { upvotes, downvotes }
}
