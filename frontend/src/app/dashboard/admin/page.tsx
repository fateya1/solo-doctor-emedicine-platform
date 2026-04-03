"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Users, Building2, Stethoscope, Calendar, ShieldCheck,
  LogOut, CheckCircle, XCircle, Clock, ChevronRight,
  Activity, CreditCard, TrendingUp, Menu, X
} from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { apiClient } from "@/lib/api";
import { format } from "date-fns";

type Tab = "overview" | "tenants" | "doctors" | "patients" | "appointments" | "subscriptions";

export default function AdminDashboard() {
  const { user, token, logout, _hasHydrated } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<Tab>("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (_hasHydrated && !token) router.push("/auth/login");
    if (_hasHydrated && token && user?.role !== "ADMIN") router.push("/auth/login");
  }, [token, _hasHydrated, user, router]);

  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => apiClient.get("/admin/stats").then((r) => r.data),
    enabled: !!token && _hasHydrated,
  });

  const { data: tenants } = useQuery({
    queryKey: ["admin-tenants"],
    queryFn: () => apiClient.get("/admin/tenants").then((r) => r.data),
    enabled: !!token && _hasHydrated && tab === "tenants",
  });

  const { data: doctors } = useQuery({
    queryKey: ["admin-doctors"],
    queryFn: () => apiClient.get("/admin/doctors").then((r) => r.data),
    enabled: !!token && _hasHydrated && tab === "doctors",
  });

  const { data: pendingDoctors } = useQuery({
    queryKey: ["admin-pending-doctors"],
    queryFn: () => apiClient.get("/admin/doctors/pending").then((r) => r.data),
    enabled: !!token && _hasHydrated,
  });

  const { data: patients } = useQuery({
    queryKey: ["admin-patients"],
    queryFn: () => apiClient.get("/admin/patients").then((r) => r.data),
    enabled: !!token && _hasHydrated && tab === "patients",
  });

  const { data: recentAppointments } = useQuery({
    queryKey: ["admin-appointments"],
    queryFn: () => apiClient.get("/admin/appointments/recent").then((r) => r.data),
    enabled: !!token && _hasHydrated && tab === "appointments",
  });

  const { data: subscriptions } = useQuery({
    queryKey: ["admin-subscriptions"],
    queryFn: () => apiClient.get("/admin/subscriptions").then((r) => r.data),
    enabled: !!token && _hasHydrated && tab === "subscriptions",
  });

  const verifyMutation = useMutation({
    mutationFn: (doctorProfileId: string) => apiClient.patch(`/admin/doctors/${doctorProfileId}/verify`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-pending-doctors"] });
      queryClient.invalidateQueries({ queryKey: ["admin-doctors"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    },
  });

  const toggleTenantMutation = useMutation({
    mutationFn: (tenantId: string) => apiClient.patch(`/admin/tenants/${tenantId}/toggle`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-tenants"] }),
  });

  const toggleUserMutation = useMutation({
    mutationFn: (userId: string) => apiClient.patch(`/admin/users/${userId}/toggle`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-doctors"] });
      queryClient.invalidateQueries({ queryKey: ["admin-patients"] });
    },
  });

  if (!_hasHydrated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!token || user?.role !== "ADMIN") return null;

  const tabs: { key: Tab; label: string; icon: any }[] = [
    { key: "overview", label: "Overview", icon: Activity },
    { key: "tenants", label: "Tenants", icon: Building2 },
    { key: "doctors", label: "Doctors", icon: Stethoscope },
    { key: "patients", label: "Patients", icon: Users },
    { key: "appointments", label: "Appointments", icon: Calendar },
    { key: "subscriptions", label: "Subscriptions", icon: CreditCard },
  ];

  const statusColor: Record<string, string> = {
    ACTIVE: "bg-green-50 text-green-700",
    TRIAL: "bg-blue-50 text-blue-700",
    EXPIRED: "bg-red-50 text-red-600",
    CANCELLED: "bg-slate-100 text-slate-500",
    SUSPENDED: "bg-amber-50 text-amber-700",
  };

  const planColor: Record<string, string> = {
    BASIC: "bg-slate-100 text-slate-600",
    PRO: "bg-brand-50 text-brand-700",
    ENTERPRISE: "bg-purple-50 text-purple-700",
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── Header ── */}
      <header className="bg-white border-b border-slate-100 px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-lg">SoloDoc</span>
            <span className="text-xs bg-red-50 text-red-700 font-medium px-2 py-0.5 rounded-full hidden sm:inline">Admin</span>
          </div>
          {/* Desktop nav */}
          <div className="hidden sm:flex items-center gap-4">
            {(pendingDoctors?.length ?? 0) > 0 && (
              <button onClick={() => setTab("doctors")}
                className="flex items-center gap-1.5 text-xs bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1.5 rounded-full font-medium touch-manipulation">
                <Clock className="w-3 h-3" />
                {pendingDoctors.length} pending
              </button>
            )}
            <span className="text-sm text-slate-600 truncate max-w-[150px]">{user?.fullName}</span>
            <button onClick={() => { logout(); router.push("/auth/login"); }}
              className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-red-500 transition-colors">
              <LogOut className="w-4 h-4" /> Sign out
            </button>
          </div>
          {/* Mobile: pending badge + hamburger */}
          <div className="flex sm:hidden items-center gap-2">
            {(pendingDoctors?.length ?? 0) > 0 && (
              <button onClick={() => { setTab("doctors"); setMobileMenuOpen(false); }}
                className="flex items-center gap-1 text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1.5 rounded-full font-medium touch-manipulation">
                <Clock className="w-3 h-3" />
                {pendingDoctors.length}
              </button>
            )}
            <button className="p-2 rounded-lg hover:bg-slate-50"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-5 h-5 text-slate-600" /> : <Menu className="w-5 h-5 text-slate-600" />}
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="sm:hidden mt-3 pt-3 border-t border-slate-100 flex flex-col gap-3 pb-2">
            <p className="text-sm text-slate-600 px-1">{user?.fullName}</p>
            <button onClick={() => { logout(); router.push("/auth/login"); }}
              className="flex items-center gap-1.5 text-sm text-red-500 px-1">
              <LogOut className="w-4 h-4" /> Sign out
            </button>
          </div>
        )}
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* ── Tabs: horizontally scrollable on mobile ── */}
        <div className="mb-6 sm:mb-8 overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
          <div className="flex gap-1 bg-white border border-slate-100 rounded-xl p-1 w-max">
            {tabs.map(({ key, label, icon: Icon }) => (
              <button key={key} onClick={() => setTab(key)}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap touch-manipulation ${
                  tab === key ? "bg-brand-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                }`}>
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Overview ── */}
        {tab === "overview" && (
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-5 sm:mb-6">Platform Overview</h2>
            {/* 2 cols mobile → 3 cols tablet → 6 cols desktop */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-6 sm:mb-8">
              {[
                { label: "Tenants", value: stats?.totalTenants ?? 0, icon: Building2, color: "bg-blue-50 text-blue-600" },
                { label: "Doctors", value: stats?.totalDoctors ?? 0, icon: Stethoscope, color: "bg-teal-50 text-teal-600" },
                { label: "Patients", value: stats?.totalPatients ?? 0, icon: Users, color: "bg-green-50 text-green-600" },
                { label: "Appointments", value: stats?.totalAppointments ?? 0, icon: Calendar, color: "bg-purple-50 text-purple-600" },
                { label: "Pending", value: stats?.pendingVerifications ?? 0, icon: Clock, color: "bg-amber-50 text-amber-600" },
                { label: "Active Subs", value: stats?.activeSubscriptions ?? 0, icon: TrendingUp, color: "bg-brand-50 text-brand-600" },
              ].map(({ label, value, icon: Icon, color }) => (
                <div key={label} className="card p-3 sm:p-5">
                  <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center mb-2 sm:mb-3 ${color}`}>
                    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <p className="text-xl sm:text-2xl font-bold text-slate-900">{value}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            {(pendingDoctors?.length ?? 0) > 0 && (
              <div className="card">
                <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-500" /> Pending Doctor Verifications
                </h3>
                <div className="space-y-3">
                  {pendingDoctors.map((d: any) => (
                    <div key={d.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 bg-slate-50 rounded-xl">
                      <div>
                        <p className="text-sm font-medium text-slate-800">{d.user.fullName}</p>
                        <p className="text-xs text-slate-500">{d.user.email}</p>
                        <p className="text-xs text-slate-400">Registered {format(new Date(d.user.createdAt), "MMM d, yyyy")}</p>
                      </div>
                      <button onClick={() => verifyMutation.mutate(d.id)} disabled={verifyMutation.isPending}
                        className="flex items-center gap-1.5 text-xs bg-green-600 text-white px-4 py-2.5 rounded-lg hover:bg-green-700 w-fit touch-manipulation">
                        <CheckCircle className="w-3 h-3" /> Verify
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Tenants ── */}
        {tab === "tenants" && (
          <div className="card">
            <h2 className="font-semibold text-slate-900 mb-5">All Tenants ({tenants?.length ?? 0})</h2>
            <div className="space-y-3">
              {tenants?.map((t: any) => (
                <div key={t.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-slate-50 rounded-xl">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800">{t.name}</p>
                    <p className="text-xs text-slate-500">Slug: {t.slug}</p>
                    <p className="text-xs text-slate-400">
                      {t._count.users} users · Created {format(new Date(t.createdAt), "MMM d, yyyy")}
                    </p>
                    {t.subscription && (
                      <div className="flex gap-2 mt-1 flex-wrap">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${planColor[t.subscription.plan] ?? "bg-slate-100 text-slate-500"}`}>
                          {t.subscription.plan}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[t.subscription.status] ?? "bg-slate-100 text-slate-500"}`}>
                          {t.subscription.status}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${t.isActive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
                      {t.isActive ? "Active" : "Suspended"}
                    </span>
                    <button onClick={() => toggleTenantMutation.mutate(t.id)} disabled={toggleTenantMutation.isPending}
                      className={`text-xs px-3 py-2 rounded-lg font-medium touch-manipulation ${t.isActive ? "bg-red-50 text-red-600 hover:bg-red-100" : "bg-green-50 text-green-700 hover:bg-green-100"}`}>
                      {t.isActive ? "Suspend" : "Activate"}
                    </button>
                    <button onClick={() => router.push(`/dashboard/admin/tenants/${t.id}`)} className="text-slate-400 hover:text-slate-600 p-1">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {!tenants?.length && <p className="text-slate-400 text-sm">No tenants yet.</p>}
            </div>
          </div>
        )}

        {/* ── Doctors ── */}
        {tab === "doctors" && (
          <div className="space-y-6">
            {(pendingDoctors?.length ?? 0) > 0 && (
              <div className="card border-l-4 border-amber-400">
                <h3 className="font-semibold text-slate-900 mb-4">Pending Verification ({pendingDoctors.length})</h3>
                <div className="space-y-3">
                  {pendingDoctors.map((d: any) => (
                    <div key={d.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 bg-amber-50 rounded-xl">
                      <div>
                        <p className="text-sm font-medium text-slate-800">{d.user.fullName}</p>
                        <p className="text-xs text-slate-500">{d.user.email}</p>
                        {d.licenseNumber && <p className="text-xs text-slate-400">License: {d.licenseNumber}</p>}
                      </div>
                      <button onClick={() => verifyMutation.mutate(d.id)} disabled={verifyMutation.isPending}
                        className="flex items-center gap-1.5 text-xs bg-green-600 text-white px-4 py-2.5 rounded-lg hover:bg-green-700 w-fit touch-manipulation">
                        <CheckCircle className="w-3 h-3" /> Verify
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="card">
              <h3 className="font-semibold text-slate-900 mb-4">All Doctors ({doctors?.length ?? 0})</h3>
              <div className="space-y-3">
                {doctors?.map((d: any) => (
                  <div key={d.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 bg-slate-50 rounded-xl">
                    <div>
                      <p className="text-sm font-medium text-slate-800">{d.user.fullName}</p>
                      <p className="text-xs text-slate-500">{d.user.email}</p>
                      <p className="text-xs text-slate-400">{d.specialty ?? "General Practice"} · Joined {format(new Date(d.user.createdAt), "MMM d, yyyy")}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${d.isVerified ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-600"}`}>
                        {d.isVerified ? "Verified" : "Unverified"}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${d.user.isActive ? "bg-blue-50 text-blue-700" : "bg-red-50 text-red-600"}`}>
                        {d.user.isActive ? "Active" : "Suspended"}
                      </span>
                      <button onClick={() => toggleUserMutation.mutate(d.user.id)} disabled={toggleUserMutation.isPending}
                        className={`text-xs px-3 py-2 rounded-lg font-medium flex items-center touch-manipulation ${d.user.isActive ? "bg-red-50 text-red-600 hover:bg-red-100" : "bg-green-50 text-green-700 hover:bg-green-100"}`}>
                        {d.user.isActive ? <XCircle className="w-3.5 h-3.5" /> : <CheckCircle className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                ))}
                {!doctors?.length && <p className="text-slate-400 text-sm">No doctors yet.</p>}
              </div>
            </div>
          </div>
        )}

        {/* ── Patients ── */}
        {tab === "patients" && (
          <div className="card">
            <h2 className="font-semibold text-slate-900 mb-5">All Patients ({patients?.length ?? 0})</h2>
            <div className="space-y-3">
              {patients?.map((p: any) => (
                <div key={p.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 bg-slate-50 rounded-xl">
                  <div>
                    <p className="text-sm font-medium text-slate-800">{p.user.fullName}</p>
                    <p className="text-xs text-slate-500">{p.user.email}</p>
                    <p className="text-xs text-slate-400">{p._count.appointments} appointments · Joined {format(new Date(p.user.createdAt), "MMM d, yyyy")}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.user.isActive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
                      {p.user.isActive ? "Active" : "Suspended"}
                    </span>
                    <button onClick={() => toggleUserMutation.mutate(p.user.id)} disabled={toggleUserMutation.isPending}
                      className={`text-xs px-3 py-2 rounded-lg font-medium touch-manipulation ${p.user.isActive ? "bg-red-50 text-red-600 hover:bg-red-100" : "bg-green-50 text-green-700 hover:bg-green-100"}`}>
                      {p.user.isActive ? "Suspend" : "Activate"}
                    </button>
                  </div>
                </div>
              ))}
              {!patients?.length && <p className="text-slate-400 text-sm">No patients yet.</p>}
            </div>
          </div>
        )}

        {/* ── Appointments ── */}
        {tab === "appointments" && (
          <div className="card">
            <h2 className="font-semibold text-slate-900 mb-5">Recent Appointments</h2>
            <div className="space-y-3">
              {recentAppointments?.map((a: any) => (
                <div key={a.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 bg-slate-50 rounded-xl">
                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      {a.patient?.user?.fullName} → Dr. {a.availabilitySlot?.doctor?.user?.fullName}
                    </p>
                    <p className="text-xs text-slate-500">
                      {a.availabilitySlot?.startTime ? format(new Date(a.availabilitySlot.startTime), "MMM d, yyyy · h:mm a") : "N/A"}
                    </p>
                    <p className="text-xs text-slate-400">{a.reason ?? "General consultation"}</p>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full w-fit ${
                    a.status === "CONFIRMED" ? "bg-green-50 text-green-700" :
                    a.status === "CANCELLED" ? "bg-red-50 text-red-600" :
                    a.status === "COMPLETED" ? "bg-blue-50 text-blue-700" :
                    "bg-amber-50 text-amber-700"
                  }`}>{a.status}</span>
                </div>
              ))}
              {!recentAppointments?.length && <p className="text-slate-400 text-sm">No appointments yet.</p>}
            </div>
          </div>
        )}

        {/* ── Subscriptions ── */}
        {tab === "subscriptions" && (
          <div className="card">
            <h2 className="font-semibold text-slate-900 mb-5">All Subscriptions ({subscriptions?.length ?? 0})</h2>
            <div className="space-y-3">
              {subscriptions?.map((s: any) => (
                <div key={s.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-slate-50 rounded-xl">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{s.tenant?.name}</p>
                    <p className="text-xs text-slate-500">
                      Period: {format(new Date(s.currentPeriodStart), "MMM d")} – {format(new Date(s.currentPeriodEnd), "MMM d, yyyy")}
                    </p>
                    <p className="text-xs text-slate-400">
                      {s.payments?.length ?? 0} payments · Last updated {format(new Date(s.updatedAt), "MMM d, yyyy")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${planColor[s.plan] ?? "bg-slate-100 text-slate-500"}`}>
                      {s.plan}
                    </span>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColor[s.status] ?? "bg-slate-100 text-slate-500"}`}>
                      {s.status}
                    </span>
                  </div>
                </div>
              ))}
              {!subscriptions?.length && <p className="text-slate-400 text-sm">No subscriptions yet.</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
