"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Calendar, Users, Clock, LogOut, Stethoscope, Plus, Loader2,
  CheckCircle, XCircle, AlertCircle, CreditCard, TrendingUp
} from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { apiClient } from "@/lib/api";
import { format } from "date-fns";

type Tab = "appointments" | "slots" | "subscription";

export default function DoctorDashboard() {
  const { user, token, logout, _hasHydrated } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<Tab>("appointments");
  const [showAddSlot, setShowAddSlot] = useState(false);
  const [slotDate, setSlotDate] = useState("");
  const [slotTime, setSlotTime] = useState("09:00");

  useEffect(() => {
    if (_hasHydrated && !token) router.push("/auth/login");
  }, [token, _hasHydrated, router]);

  const today = new Date();
  const fromDate = today.toISOString();
  const toDate = new Date(today.getFullYear(), today.getMonth() + 3, today.getDate()).toISOString();

  const { data: profile } = useQuery({
    queryKey: ["doctor-profile", user?.id],
    queryFn: () => apiClient.get("/doctor/profile").then((r) => r.data),
    enabled: !!token && _hasHydrated,
  });

  const doctorProfileId = profile?.id;

  const { data: appointments, refetch: refetchAppointments } = useQuery({
    queryKey: ["doctor-appointments"],
    queryFn: () => apiClient.get("/appointments/doctor").then((r) => r.data),
    enabled: !!token && _hasHydrated,
  });

  const { data: slots, refetch: refetchSlots } = useQuery({
    queryKey: ["my-slots", doctorProfileId],
    queryFn: () =>
      apiClient.get(`/availability/slots?doctorId=${doctorProfileId}&from=${fromDate}&to=${toDate}`).then((r) => r.data),
    enabled: !!token && _hasHydrated && !!doctorProfileId,
  });

  const { data: subscription } = useQuery({
    queryKey: ["my-subscription"],
    queryFn: () => apiClient.get("/subscription/my").then((r) => r.data),
    enabled: !!token && _hasHydrated,
  });

  const addSlotMutation = useMutation({
    mutationFn: async () => {
      if (!doctorProfileId) throw new Error("Doctor profile not loaded");
      const start = new Date(`${slotDate}T${slotTime}`);
      const end = new Date(start.getTime() + 60 * 60_000);
      return apiClient.post(`/availability/slots?doctorId=${doctorProfileId}`, {
        from: start.toISOString(),
        to: end.toISOString(),
        slotMinutes: 60,
        breakMinutes: 0,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-slots", doctorProfileId] });
      setShowAddSlot(false);
      setSlotDate("");
      setSlotTime("09:00");
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || "Failed to add slot.");
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      apiClient.patch(`/appointments/${id}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctor-appointments"] });
      refetchSlots();
    },
    onError: (err: any) => alert(err.response?.data?.message || "Failed to update status."),
  });

  if (!_hasHydrated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!token) return null;

  const totalSlots = slots?.length ?? 0;
  const bookedSlots = slots?.filter((s: any) => s.appointment).length ?? 0;
  const confirmedAppts = appointments?.filter((a: any) => a.status === "CONFIRMED").length ?? 0;
  const completedAppts = appointments?.filter((a: any) => a.status === "COMPLETED").length ?? 0;

  const subDaysLeft = subscription
    ? Math.ceil((new Date(subscription.currentPeriodEnd).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  const tabs: { key: Tab; label: string }[] = [
    { key: "appointments", label: "Appointments" },
    { key: "slots", label: "Availability Slots" },
    { key: "subscription", label: "Subscription" },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
              <Stethoscope className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-lg">SoloDoc</span>
            <span className="text-xs bg-teal-50 text-teal-700 font-medium px-2 py-0.5 rounded-full ml-2">Doctor</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600">Dr. {user?.fullName?.split(" ").slice(-1)[0]}</span>
            <button onClick={() => { logout(); router.push("/auth/login"); }}
              className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-red-500 transition-colors">
              <LogOut className="w-4 h-4" /> Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Profile card */}
        {profile && (
          <div className="card mb-6 flex items-center gap-5">
            <div className="w-14 h-14 bg-brand-100 rounded-2xl flex items-center justify-center text-2xl">👨‍⚕️</div>
            <div>
              <h2 className="font-semibold text-slate-900">{user?.fullName}</h2>
              <p className="text-sm text-slate-500">{profile.specialty ?? "General Practice"} · {profile.yearsOfExperience ?? 0} yrs experience</p>
              <p className="text-xs text-slate-400 mt-0.5">{profile.bio ?? "No bio yet"}</p>
            </div>
            <div className="ml-auto flex flex-col items-end gap-2">
              <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                profile.isVerified ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-600"
              }`}>
                {profile.isVerified ? "✓ Verified" : "⏳ Pending verification"}
              </span>
              {subDaysLeft !== null && (
                <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                  subDaysLeft > 7 ? "bg-blue-50 text-blue-700" :
                  subDaysLeft > 0 ? "bg-amber-50 text-amber-700" :
                  "bg-red-50 text-red-600"
                }`}>
                  {subDaysLeft > 0 ? `${subscription?.plan} · ${subDaysLeft}d left` : "Subscription expired"}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { icon: Calendar, label: "Total appointments", value: appointments?.length ?? 0, color: "bg-purple-50 text-purple-600" },
            { icon: CheckCircle, label: "Confirmed", value: confirmedAppts, color: "bg-green-50 text-green-600" },
            { icon: TrendingUp, label: "Completed", value: completedAppts, color: "bg-blue-50 text-blue-600" },
            { icon: Clock, label: "Available slots", value: totalSlots - bookedSlots, color: "bg-teal-50 text-teal-600" },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="card">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <p className="text-2xl font-bold text-slate-900">{value}</p>
              <p className="text-sm text-slate-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white border border-slate-100 rounded-xl p-1 mb-6 w-fit">
          {tabs.map(({ key, label }) => (
            <button key={key} onClick={() => setTab(key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === key ? "bg-brand-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
              }`}>
              {label}
            </button>
          ))}
        </div>

        {/* Appointments Tab */}
        {tab === "appointments" && (
          <div className="card">
            <h2 className="font-semibold text-slate-900 mb-5">Patient Appointments</h2>
            {!appointments?.length ? (
              <p className="text-slate-400 text-sm">No appointments yet.</p>
            ) : (
              <div className="space-y-3">
                {appointments.map((appt: any) => (
                  <div key={appt.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {appt.patient?.user?.fullName ?? "Unknown Patient"}
                      </p>
                      <p className="text-xs text-slate-500">
                        {appt.availabilitySlot?.startTime
                          ? format(new Date(appt.availabilitySlot.startTime), "EEEE, MMM d yyyy · h:mm a")
                          : "N/A"}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">{appt.reason ?? "General consultation"}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        appt.status === "CONFIRMED" ? "bg-green-50 text-green-700" :
                        appt.status === "COMPLETED" ? "bg-blue-50 text-blue-700" :
                        appt.status === "CANCELLED" ? "bg-red-50 text-red-600" :
                        appt.status === "NO_SHOW" ? "bg-slate-100 text-slate-500" :
                        "bg-amber-50 text-amber-700"
                      }`}>{appt.status}</span>
                      {appt.status === "CONFIRMED" && (
                        <div className="flex gap-1">
                          <button
                            onClick={() => updateStatusMutation.mutate({ id: appt.id, status: "COMPLETED" })}
                            disabled={updateStatusMutation.isPending}
                            title="Mark as completed"
                            className="w-7 h-7 flex items-center justify-center bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => updateStatusMutation.mutate({ id: appt.id, status: "NO_SHOW" })}
                            disabled={updateStatusMutation.isPending}
                            title="Mark as no-show"
                            className="w-7 h-7 flex items-center justify-center bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100 transition-colors">
                            <AlertCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => updateStatusMutation.mutate({ id: appt.id, status: "CANCELLED" })}
                            disabled={updateStatusMutation.isPending}
                            title="Cancel appointment"
                            className="w-7 h-7 flex items-center justify-center bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors">
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Slots Tab */}
        {tab === "slots" && (
          <div className="card">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-slate-900">Availability Slots</h2>
              <button onClick={() => setShowAddSlot(!showAddSlot)} disabled={!doctorProfileId}
                className="btn-primary text-sm flex items-center gap-1.5 disabled:opacity-50">
                <Plus className="w-4 h-4" /> Add slot
              </button>
            </div>

            {showAddSlot && (
              <div className="bg-brand-50 border border-brand-100 rounded-xl p-4 mb-5">
                <h3 className="text-sm font-medium text-brand-800 mb-3">New availability slot (1 hour)</h3>
                <div className="flex gap-3">
                  <input type="date" value={slotDate} onChange={(e) => setSlotDate(e.target.value)}
                    className="input flex-1" min={new Date().toISOString().split("T")[0]} />
                  <input type="time" value={slotTime} onChange={(e) => setSlotTime(e.target.value)}
                    className="input w-36" />
                  <button onClick={() => addSlotMutation.mutate()}
                    disabled={!slotDate || addSlotMutation.isPending}
                    className="btn-primary flex items-center gap-1.5">
                    {addSlotMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                    Save
                  </button>
                </div>
              </div>
            )}

            {!slots?.length ? (
              <p className="text-slate-400 text-sm">No slots added yet.</p>
            ) : (
              <div className="space-y-2">
                {slots.map((slot: any) => (
                  <div key={slot.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <div>
                      <p className="text-sm font-medium text-slate-800">
                        {format(new Date(slot.startTime), "EEEE, MMM d yyyy")}
                      </p>
                      <p className="text-xs text-slate-500">
                        {format(new Date(slot.startTime), "h:mm a")} – {format(new Date(slot.endTime), "h:mm a")}
                      </p>
                      {slot.appointment && (
                        <p className="text-xs text-brand-600 mt-0.5">
                          Patient booked
                        </p>
                      )}
                    </div>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      !slot.appointment ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-500"
                    }`}>
                      {!slot.appointment ? "Available" : "Booked"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Subscription Tab */}
        {tab === "subscription" && (
          <div className="card">
            <h2 className="font-semibold text-slate-900 mb-5 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-brand-600" /> Subscription
            </h2>
            {!subscription ? (
              <div className="text-center py-8">
                <p className="text-slate-500 mb-4">No active subscription found.</p>
                <button onClick={() => router.push("/onboarding")} className="btn-primary">
                  Set up subscription
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: "Plan", value: subscription.plan },
                    { label: "Status", value: subscription.status },
                    { label: "Days remaining", value: subDaysLeft !== null ? `${subDaysLeft} days` : "N/A" },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-slate-50 rounded-xl p-4">
                      <p className="text-xs text-slate-500 mb-1">{label}</p>
                      <p className="font-semibold text-slate-900">{value}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs text-slate-500 mb-1">Billing period</p>
                  <p className="text-sm font-medium text-slate-800">
                    {format(new Date(subscription.currentPeriodStart), "MMM d, yyyy")} –{" "}
                    {format(new Date(subscription.currentPeriodEnd), "MMM d, yyyy")}
                  </p>
                </div>

                {subDaysLeft !== null && subDaysLeft <= 7 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <p className="text-sm text-amber-800 font-medium">⚠️ Your subscription expires soon</p>
                    <p className="text-xs text-amber-700 mt-1">Renew now to avoid service interruption.</p>
                    <button onClick={() => router.push("/onboarding")}
                      className="mt-3 text-xs bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700">
                      Renew subscription
                    </button>
                  </div>
                )}

                {subscription.payments?.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-slate-800 mb-3">Recent payments</h3>
                    <div className="space-y-2">
                      {subscription.payments.map((p: any) => (
                        <div key={p.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                          <div>
                            <p className="text-sm font-medium text-slate-800">
                              KES {Number(p.amount).toLocaleString()} · {p.plan}
                            </p>
                            <p className="text-xs text-slate-500">
                              {p.mpesaReceiptNo ?? "Pending"} · {p.paidAt ? format(new Date(p.paidAt), "MMM d, yyyy") : "—"}
                            </p>
                          </div>
                          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                            p.status === "COMPLETED" ? "bg-green-50 text-green-700" :
                            p.status === "FAILED" ? "bg-red-50 text-red-600" :
                            "bg-amber-50 text-amber-700"
                          }`}>{p.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}