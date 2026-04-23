'use client';
import { useEffect, useState } from 'react';
import { apiClient as api } from '@/lib/api';

const STATUS_COLOR: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  APPROVED: 'bg-blue-100 text-blue-700',
  PROCESSING: 'bg-blue-100 text-blue-700',
  COMPLETED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700',
  FAILED: 'bg-red-100 text-red-700',
};

export default function AdminMigrationsPage() {
  const [migrations, setMigrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);
  const [processing, setProcessing] = useState('');

  const load = async () => {
    try {
      const res = await api.get('/migration/all');
      setMigrations(res.data);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const approve = async (id: string) => {
    if (!confirm('Approve this migration? Patients will receive welcome emails immediately.')) return;
    setProcessing(id);
    try {
      await api.patch('/migration/' + id + '/approve');
      await load();
      setSelected(null);
    } catch (e: any) {
      alert(e.response?.data?.message || 'Failed to approve');
    }
    setProcessing('');
  };

  const reject = async (id: string) => {
    if (!confirm('Reject this migration?')) return;
    setProcessing(id);
    try {
      await api.patch('/migration/' + id + '/reject');
      await load();
      setSelected(null);
    } catch {}
    setProcessing('');
  };

  const pending = migrations.filter((m) => m.status === 'PENDING');
  const others = migrations.filter((m) => m.status !== 'PENDING');

  if (loading) {
    return <div className="p-6 text-slate-500">Loading migrations...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Patient Migrations</h1>
        <p className="text-slate-500 mt-1">Review and approve doctor patient migration requests.</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total', value: migrations.length, color: 'text-slate-700' },
          { label: 'Pending', value: pending.length, color: 'text-yellow-600' },
          { label: 'Completed', value: migrations.filter((m) => m.status === 'COMPLETED').length, color: 'text-green-600' },
          { label: 'Rejected', value: migrations.filter((m) => m.status === 'REJECTED').length, color: 'text-red-600' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-200 p-4 text-center">
            <div className={"text-3xl font-bold " + s.color}>{s.value}</div>
            <div className="text-slate-400 text-sm">{s.label}</div>
          </div>
        ))}
      </div>

      {pending.length > 0 && (
        <div className="mb-8">
          <h2 className="font-bold text-slate-700 mb-3">Pending Approval ({pending.length})</h2>
          <div className="space-y-3">
            {pending.map((m: any) => (
              <div key={m.id} className="bg-white rounded-xl border-2 border-yellow-200 p-4">
                <div className="flex justify-between items-start flex-wrap gap-3">
                  <div>
                    <div className="font-bold text-slate-800">{m.doctor?.user?.fullName}</div>
                    <div className="text-slate-500 text-sm">{m.doctor?.user?.email}</div>
                    <div className="text-slate-400 text-xs mt-1">
                      {m.fileName} · {m._count?.patients ?? m.patients?.length} patients · {new Date(m.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <button onClick={() => setSelected(selected === m.id ? null : m.id)}
                      className="text-teal-600 text-sm font-semibold hover:underline">
                      {selected === m.id ? 'Hide' : 'Preview'}
                    </button>
                    <button onClick={() => reject(m.id)} disabled={processing === m.id}
                      className="bg-red-50 text-red-600 font-bold text-sm px-4 py-2 rounded-lg hover:bg-red-100 disabled:opacity-50">
                      Reject
                    </button>
                    <button onClick={() => approve(m.id)} disabled={processing === m.id}
                      className="bg-teal-600 text-white font-bold text-sm px-4 py-2 rounded-lg hover:bg-teal-700 disabled:opacity-50">
                      {processing === m.id ? 'Processing...' : 'Approve and Send Emails'}
                    </button>
                  </div>
                </div>
                {selected === m.id && m.patients && (
                  <div className="mt-4 border-t border-slate-100 pt-4 overflow-x-auto">
                    <div className="text-sm font-semibold text-slate-600 mb-2">Patient Preview ({m.patients.length})</div>
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="text-slate-400">
                          <th className="text-left py-1 pr-4">Name</th>
                          <th className="text-left py-1 pr-4">Email</th>
                          <th className="text-left py-1 pr-4">Phone</th>
                          <th className="text-left py-1">Diagnoses</th>
                        </tr>
                      </thead>
                      <tbody>
                        {m.patients.slice(0, 10).map((p: any) => (
                          <tr key={p.id} className="border-t border-slate-50">
                            <td className="py-1 pr-4 font-medium">{p.fullName}</td>
                            <td className="py-1 pr-4 text-slate-500">{p.email}</td>
                            <td className="py-1 pr-4 text-slate-500">{p.phone || '-'}</td>
                            <td className="py-1 text-slate-500">{p.diagnoses || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {m.patients.length > 10 && (
                      <div className="text-slate-400 text-xs mt-2">...and {m.patients.length - 10} more patients</div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="font-bold text-slate-700 mb-3">All Migrations</h2>
        {others.length === 0 && pending.length === 0 ? (
          <div className="text-slate-400 text-sm bg-white rounded-xl border p-8 text-center">No migrations yet</div>
        ) : (
          <div className="space-y-2">
            {others.map((m: any) => (
              <div key={m.id} className="bg-white rounded-xl border border-slate-200 p-4 flex justify-between items-center">
                <div>
                  <div className="font-semibold text-slate-700">{m.doctor?.user?.fullName}</div>
                  <div className="text-slate-400 text-xs mt-1">
                    {m.fileName} · {m._count?.patients} patients · {new Date(m.createdAt).toLocaleDateString()}
                  </div>
                  {m.status === 'COMPLETED' && (
                    <div className="text-xs text-slate-500 mt-1">{m.processedRows} sent · {m.failedRows} failed</div>
                  )}
                </div>
                <span className={"text-xs font-bold px-3 py-1 rounded-full " + STATUS_COLOR[m.status]}>{m.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


