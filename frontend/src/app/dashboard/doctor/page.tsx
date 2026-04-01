"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Calendar, Users, Clock, LogOut, Stethoscope, Plus, Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { apiClient } from "@/lib/api";
import { format } from "date-fns";

export default function DoctorDashboard() {
  const { user, token, logout, _hasHydrated } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showAddSlot, setShowAddSlot] = useState(false);
  const [slotDate, setSlotDate] = useState("");
  const [slotTime, setSlotTime] = useState("09:00");

  useEffect(() => {
    if (_hasHydrated && !token) {
      router.push("/auth/login");
    }
  }, [token, _hasHydrated, router]);

  const today = new Date();
  const fromDate = today.toISOString();
  const toDate = new Date(today.getFullYear(), today.getMonth() + 3, today.getDate()).toISOString();

  // Fetch doctor profile using userId — returns DoctorProfile with its own id
  const { data: profile } = useQuery({
    queryKey: ["doctor-profile", user?.id],
    queryFn: () => apiClient.get(`/doctor/profile?userId=${user?.id}`).then((r) => r.data),
    enabled: !!token && _hasHydrated && !!user?.id,
  });

  const doctorProfileId = profile?.id;

  const { data: slots } = useQuery({
    queryKey: ["my-slots", doctorProfileId],
    queryFn: () =>
      apiClient
        .get(`/availability/slots?doctorId=${doctorProfileId}&from=${fromDate}&to=${toDate}`)
        .then((r) => r.data),
    enabled: !!token && _hasHydrated && !!doctorProfileId,
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
      alert(err.response?.data?.message || err.message || "Failed to add slot.");
    },
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
            <button
              onClick={() => { logout(); router.push("/auth/login"); }}
              className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-red-500 transition-colors"
            >
              <LogOut className="w-4 h-4" /> Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {profile && (
          <div className="card mb-6 flex items-center gap-5">
            <div className="w-14 h-14 bg-brand-100 rounded-2xl flex items-center justify-center text-2xl">👨‍⚕️</div>
            <div>
              <h2 className="font-semibold text-slate-900">{user?.fullName}</h2>
              <p className="text-sm text-slate-500">{profile.specialty ?? "General Practice"}</p>
              <p className="text-xs text-slate-400 mt-0.5">{profile.bio ?? "No bio yet"}</p>
            </div>
            <div className="ml-auto">
              <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                profile.isVerified ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-600"
              }`}>
                {profile.isVerified ? "✓ Verified" : "Pending verification"}
              </span>
            </div>
          </div>
        )}

        {!profile && _hasHydrated && (
          <div className="card mb-6 bg-amber-50 border border-amber-100">
            <p className="text-sm text-amber-700">⚠️ Doctor profile not found. Please contact support to set up your profile.</p>
          </div>
        )}

        <div className="grid grid-cols-3 gap-5 mb-8">
          {[
            { icon: Calendar, label: "Total slots", value: totalSlots },
            { icon: Users, label: "Booked slots", value: bookedSlots },
            { icon: Clock, label: "Available slots", value: totalSlots - bookedSlots },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="card">
              <div className="w-9 h-9 bg-brand-50 rounded-xl flex items-center justify-center mb-3">
                <Icon className="w-4 h-4 text-brand-600" />
              </div>
              <p className="text-2xl font-bold text-slate-900">{value}</p>
              <p className="text-sm text-slate-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-slate-900">Availability slots</h2>
            <button
              onClick={() => setShowAddSlot(!showAddSlot)}
              disabled={!doctorProfileId}
              title={!doctorProfileId ? "Doctor profile loading..." : ""}
              className="btn-primary text-sm flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" /> Add slot
            </button>
          </div>

          {showAddSlot && (
            <div className="bg-brand-50 border border-brand-100 rounded-xl p-4 mb-5">
              <h3 className="text-sm font-medium text-brand-800 mb-3">New availability slot (1 hour)</h3>
              <div className="flex gap-3">
                <input
                  type="date"
                  value={slotDate}
                  onChange={(e) => setSlotDate(e.target.value)}
                  className="input flex-1"
                  min={new Date().toISOString().split("T")[0]}
                />
                <input
                  type="time"
                  value={slotTime}
                  onChange={(e) => setSlotTime(e.target.value)}
                  className="input w-36"
                />
                <button
                  onClick={() => addSlotMutation.mutate()}
                  disabled={!slotDate || addSlotMutation.isPending}
                  className="btn-primary flex items-center gap-1.5"
                >
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
      </div>
    </div>
  );
}
