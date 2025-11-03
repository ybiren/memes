'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './page.module.css';
import type { Meme } from '../lib/api';
import { listMemes, updateMemeName } from '../lib/api';

export default function Page() {
  const [items, setItems] = useState<Meme[]>([]);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const [editing, setEditing] = useState<Meme | null>(null);
  const [editName, setEditName] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const guardRef = useRef<HTMLDivElement | null>(null);
  const batchSize = 10;

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const batch = await listMemes(skip, batchSize);
      setItems(prev => [...prev, ...batch]);
      setSkip(prev => prev + batch.length);
      if (batch.length < batchSize) setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [skip, loading, hasMore]);

  useEffect(() => { loadMore(); }, []);

  useEffect(() => {
    if (!guardRef.current) return;
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) loadMore();
    });
    io.observe(guardRef.current);
    return () => io.disconnect();
  }, [loadMore]);

  const openEdit = (m: Meme) => {
    setEditing(m);
    setEditName(m.name);
    setError(null);
  };

  const save = async () => {
    if (!editing) return;
    const newName = editName.trim();
    if (!newName) { setError('Name is required'); return; }

    setSaving(true);
    try {
      const updated = await updateMemeName(editing._id, newName);
      setItems(prev => prev.map(x => x._id === updated._id ? updated : x));
      setEditing(null);
    } catch (err: any) {
      setError(err?.message ?? 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className={styles.wrap}>
      <h2 className={styles.title}>Memes</h2>

      <div className={styles.grid}>
        {items.map(m => (
          <article key={m._id} className={styles.card}>
            <img src={m.imageUrl} alt={m.name} className={styles.thumb} />
            <div className={styles.row}>
              <span className={styles.name}>{m.name}</span>
              <button className={styles.btn} onClick={() => openEdit(m)}>עריכה</button>
            </div>
          </article>
        ))}
      </div>

      <div ref={guardRef} className={styles.guard} />

      {/* Modal */}
      {editing && (
        <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && setEditing(null)}>
          <div className={styles.modal}>
            <h3 className={styles.modalTitle}>Edit Meme Name</h3>
            <input className={styles.input} value={editName} onChange={(e) => setEditName(e.target.value)} />
            {error && <div className={styles.error}>{error}</div>}
            <div className={styles.actions}>
              <button className={styles.cancel} onClick={() => setEditing(null)}>ביטול</button>
              <button className={styles.save} disabled={saving} onClick={save}>שמירה</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
