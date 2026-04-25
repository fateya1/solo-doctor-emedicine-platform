'use client';
import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';

const BAR_COLOR = (pct: number) =>
  pct >= 90 ? 'bg-red-500' : pct >= 70 ? 'bg-amber-500' : 'bg-teal-500';

function UsageBar({ label, used, max, pct }: { label: string; used: number; max: number; pct: number }) {
  const isUnlimited = max >= 999999;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="font-medium text-slate-700">{label}</span>
        <span className="text-slate-500">{isUnlimited ? used + ' / Unlimited' : used + ' / ' + max}</span>
      </div>
      {!isUnlimited && (
        <div className="w-full bg-slate-100 rounded-full h-2">
          <div className={"h-2 rounded-full " + BAR_COLOR(pct)} style={{ width: Math.min(pct, 100) + '%' }} />
        </div>
      )}
      {!isUnlimited && pct >= 90 && (
        <p className="text-xs text-red-500 font-medium">Almost at limit — consider upgrading</p>
      )}
    </div>
  );
}

export default function PlanUsageCard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/subscription/usage')
      .then((r) => setData(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="card animate-pulse h-48" />;
  if (!data) return null;

  const PLAN_COLOR: Record<string, string> = {
    BASIC: 'bg-slate-100 text-slate-700',
    PRO: 'bg-teal-50 text-teal-700',
    ENTERPRISE: 'bg-purple-50 text-purple-700',
  };

  const FEATURES = [
    { label: 'Video Consultations', key: 'videoConsultations' },
    { label: 'Digital Prescriptions', key: 'prescriptions' },
    { label: 'Insurance Claims', key: 'insuranceClaims' },
    { label: 'Referrals', key: 'referrals' },
    { label: 'Analytics', key: 'analytics' },
    { label: 'Priority Support', key: 'prioritySupport' },
  ];

  return (
    <div className="card space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-slate-900 text-lg">Plan Usage</h2>
          <p className="text-slate-500 text-sm">Your current usage vs plan limits</p>
        </div>
        <span className={"text-xs font-bold px-3 py-1.5 rounded-full " + PLAN_COLOR[data.plan]}>
          {data.limits.label} Plan
        </span>
      </div>

      <div className="space-y-4">
        <UsageBar
          label="Appointments this month"
          used={data.usage.appointmentsThisMonth}
          max={data.limits.maxAppointmentsPerMonth}
          pct={data.percentages.appointments}
        />
        <UsageBar
          label="Active slots"
          used={data.usage.activeSlots}
          max={data.limits.maxSlots}
          pct={data.percentages.slots}
        />
        <UsageBar
          label="Total patients"
          used={data.usage.totalPatients}
          max={data.limits.maxPatients}
          pct={data.percentages.patients}
        />
      </div>

      <div className="border-t border-slate-100 pt-4">
        <p className="text-sm font-semibold text-slate-700 mb-3">Plan Features</p>
        <div className="grid grid-cols-2 gap-2">
          {FEATURES.map((f) => (
            <div key={f.key} className="flex items-center gap-2 text-sm">
              {data.limits[f.key] ? (
                <span className="text-teal-500 font-bold">✓</span>
              ) : (
                <span className="text-slate-300 font-bold">✗</span>
              )}
              <span className={data.limits[f.key] ? 'text-slate-700' : 'text-slate-400'}>{f.label}</span>
            </div>
          ))}
        </div>
      </div>

      {data.plan === 'BASIC' && (
        <div className="bg-teal-50 border border-teal-200 rounded-xl p-4">
          <p className="text-sm font-bold text-teal-800">Upgrade to Pro — KES 3,500/mo</p>
          <p className="text-xs text-teal-600 mt-1">200 appointments · 500 slots · Insurance claims · Analytics</p>
          <button
            onClick={() => window.location.href = '/dashboard/doctor?tab=subscription'}
            className="mt-3 bg-teal-600 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-teal-700">
            Upgrade Now
          </button>
        </div>
      )}

      {data.plan === 'PRO' && (
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
          <p className="text-sm font-bold text-purple-800">Upgrade to Enterprise</p>
          <p className="text-xs text-purple-600 mt-1">Unlimited everything · Priority support · Custom branding</p>
          <button
            onClick={() => window.open('mailto:support@solodoc.co.ke?subject=Enterprise Plan Inquiry')}
            className="mt-3 bg-purple-600 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-purple-700">
            Contact Sales
          </button>
        </div>
      )}
    </div>
  );
}
