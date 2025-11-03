export type Meme = { _id: string; name: string; imageUrl: string };

const API = process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:3000';

export async function listMemes(skip = 0, limit = 10): Promise<Meme[]> {
  const res = await fetch(`${API}/memes?skip=${skip}&limit=${limit}`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`List failed: ${res.status}`);
  return res.json();
}

export async function updateMemeName(id: string, name: string): Promise<Meme> {
  const res = await fetch(`${API}/memes/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error(`Update failed: ${res.status}`);
  return res.json();
}
