const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || `Request failed: ${response.status}`);
  return data;
}

export async function createMockSession(payload) {
  return request('/api/mock-arena/sessions', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function getMockSessions(userId) {
  return request(`/api/mock-arena/sessions?userId=${encodeURIComponent(userId)}`);
}

export async function getMockSessionById(sessionId) {
  return request(`/api/mock-arena/sessions/${sessionId}`);
}

export async function submitMockAnswer(sessionId, payload) {
  return request(`/api/mock-arena/sessions/${sessionId}/answers`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function completeMockSession(sessionId) {
  return request(`/api/mock-arena/sessions/${sessionId}/complete`, { method: 'POST' });
}
