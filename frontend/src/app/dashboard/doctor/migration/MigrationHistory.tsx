'use client';
import { useState } from 'react';
import { apiClient as api } from '@/lib/api';

const STATUS_COLOR: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  APPROVED: 'bg-blue-100 text-blue-700',
  PROCESSING: 'bg-blue-100 text-blue-700',
  COMPLETED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700',
  FAILED: 'bg-red-100 text-red-700',
};

export default function MigrationHistory() {
  const [migrations, setMigrations] = useState<any[]>([]);
  const [loaded, setLoaded] = useState(false);

  const load = async () => {
    try {
      const res = await api.get('/migration/my');
      setMigrations(res.data);
      setLoaded(true);
    } catch {}
  };

  if (!loaded) {
    return (
      <button onClick={load} className="mt-6 text-teal-600 text-sm font-semibold hover:underline">
        View My Migration History
      </button>
    );
  }

  return (
    <div className="mt-6">
      <h2 className="font-bold text-slate-700 mb-3">Migration History</h2>
      {migrations.length === 0 ? (
        <div className="text-slate-400 text-sm">No migrations yet</div>
      ) : (
        <div className="space-y-3">
          {migrations.map((m: any) => (
            <div key={m.id} className="bg-white rounded-xl border border-slate-200 p-4 flex justify-between items-center">
              <div>
                <div className="font-semibold text-slate-700">{m.fileName}</div>
                <div className="text-slate-400 text-xs mt-1">
                  {new Date(m.createdAt).toLocaleDateString()} · {m._count?.patients ?? m.patients?.length ?? 0} patients
                </div>
              </div>
              <div className="flex items-center gap-3">
                {m.status === 'COMPLETED' && (
                  <div className="text-xs text-slate-500">{m.processedRows} sent · {m.failedRows} failed</div>
                )}
                <span className={"text-xs font-bold px-3 py-1 rounded-full " + STATUS_COLOR[m.status]}>{m.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


