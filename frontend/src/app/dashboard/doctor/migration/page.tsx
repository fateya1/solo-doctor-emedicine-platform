'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function DoctorMigrationPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleUpload = async () => {
    if (!file) return setError('Please select a CSV or Excel file');
    setLoading(true); setError(''); setResult(null);
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await api.post('/migration/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResult(res.data);
    } catch (e: any) {
      setError(e.response?.data?.message || 'Upload failed');
    } finally { setLoading(false); }
  };

  const downloadTemplate = () => {
    const csv = 'fullName,email,phone,medicalHistory,diagnoses\nJohn Doe,john@example.com,+254700000000,Hypertension since 2020,Type 2 Diabetes';
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url;
    a.download = 'solodoc_migration_template.csv'; a.click();
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Migrate Your Patients</h1>
        <p className="text-slate-500 mt-1">Upload your existing patient list. After admin approval, each patient will receive a welcome email with login credentials.</p>
      </div>

      {/* Steps */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { step: '1', title: 'Download Template', desc: 'Get the CSV template with required columns' },
          { step: '2', title: 'Fill & Upload', desc: 'Add your patients and upload the file' },
          { step: '3', title: 'Admin Approves', desc: 'Patients receive welcome emails automatically' },
        ].map(s => (
          <div key={s.step} className="bg-white rounded-xl p-4 border border-slate-200 text-center">
            <div className="w-8 h-8 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center mx-auto mb-2">{s.step}</div>
            <div className="font-semibold text-slate-700 text-sm">{s.title}</div>
            <div className="text-slate-400 text-xs mt-1">{s.desc}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <button onClick={downloadTemplate} className="flex items-center gap-2 text-teal-600 font-semibold hover:underline text-sm">
          ⬇ Download CSV Template
        </button>

        <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center">
          <input type="file" accept=".csv,.xlsx,.xls" onChange={e => setFile(e.target.files?.[0] || null)}
            className="hidden" id="file-upload" />
          <label htmlFor="file-upload" className="cursor-pointer">
            <div className="text-4xl mb-2">📋</div>
            <div className="font-semibold text-slate-700">{file ? file.name : 'Click to select CSV or Excel file'}</div>
            <div className="text-slate-400 text-sm mt-1">Supports .csv, .xlsx, .xls</div>
          </label>
        </div>

        {error && <div className="bg-red-50 text-red-600 rounded-lg p-3 text-sm">{error}</div>}

        {result && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="font-bold text-green-700">✅ Upload Successful!</div>
            <div className="text-green-600 text-sm mt-1">{result.totalPatients} patients uploaded. Awaiting admin approval.</div>
            <div className="text-slate-500 text-xs mt-1">Migration ID: {result.migrationId}</div>
          </div>
        )}

        <button onClick={handleUpload} disabled={loading || !file}
          className="w-full bg-teal-600 text-white font-bold py-3 rounded-xl hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed">
          {loading ? 'Uploading...' : 'Upload Patient List'}
        </button>
      </div>

      {/* Migration history */}
      <MigrationHistory />
    </div>
  );
}

function MigrationHistory() {
  const [migrations, setMigrations] = useState<any[]>([]);
  const [loaded, setLoaded] = useState(false);

  const load = async () => {
    try {
      const res = await api.get('/migration/my');
      setMigrations(res.data); setLoaded(true);
    } catch {}
  };

  if (!loaded) return (
    <button onClick={load} className="mt-6 text-teal-600 text-sm font-semibold hover:underline">
      View My Migration History
    </button>
  );

  const STATUS_COLOR: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-700',
    APPROVED: 'bg-blue-100 text-blue-700',
    PROCESSING: 'bg-blue-100 text-blue-700',
    COMPLETED: 'bg-green-100 text-green-700',
    REJECTED: 'bg-red-100 text-red-700',
    FAILED: 'bg-red-100 text-red-700',
  };

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
                <div className="text-slate-400 text-xs mt-1">{new Date(m.createdAt).toLocaleDateString()} · {m._count?.patients ?? m.patients?.length ?? 0} patients</div>
              </div>
              <div className="flex items-center gap-3">
                {m.status === 'COMPLETED' && (
                  <div className="text-xs text-slate-500">{m.processedRows} sent · {m.failedRows} failed</div>
                )}
                <span className={	ext-xs font-bold px-3 py-1 rounded-full }>{m.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
