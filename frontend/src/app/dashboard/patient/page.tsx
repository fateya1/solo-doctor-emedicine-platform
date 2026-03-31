"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Clock, User, LogOut, Stethoscope } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { apiClient } from "@/lib/api";
import { format } from "date-fns";

export default function PatientDashboard() {
  const { user, token, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!token) router.push("/auth/login");
  }, [token, router]);

  const { data: profile } = useQuery({
    queryKey: ["patient-profile"],
    queryFn: () => apiClient.get("/patient/profile").then((r) => r.data),
    enabled: !!token,
  });

  const { data: appointments } = useQuery({
    queryKey: ["appointments"],
    queryFn: () => apiClient.get("/appointments").then((r) => r.data),
    enabled: !!token,
  });

  const { data: slots } = useQuery({
    queryKey: ["available-slots"],
    queryFn: () => apiClient.get("/availability/slots").then((r) => r.data),
    enabled: !!token,
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
              <Stethoscope className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-lg">SoloDoc</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600">Hi, {user?.fullName?.split(" ")[0]}</span>
            <button onClick={() => { logout(); router.push("/auth/login"); }}
              className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-red-500 transition-colors">
              <LogOut className="w-4 h-4" /> Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-5 mb-8">
          {[
            { icon: Calendar, label: "Total appointments", value: appointments?.length ?? 0, color: "brand" },
            { icon: Clock, label: "Upcoming", value: appointments?.filter((a: any) => a.status === "CONFIRMED").length ?? 0, color: "teal" },
            { icon: User, label: "Profile complete", value: profile ? "Yes" : "No", color: "brand" },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="card">
              <div className={`w-9 h-9 bg-${color}-50 rounded-xl flex items-center justify-center mb-3`}>
                <Icon className={`w-4 h-4 text-${color}-600`} />
              </div>
              <p className="text-2xl font-bold text-slate-900">{value}</p>
              <p className="text-sm text-slate-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Available slots */}
          <div className="card">
            <h2 className="font-semibold text-slate-900 mb-4">Available slots</h2>
            {!slots?.length ? (
              <p className="text-slate-400 text-sm">No available slots right now.</p>
            ) : (
              <div className="space-y-3">
                {slots.slice(0, 5).map((slot: any) => (
                  <div key={slot.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <div>
                      <p className="text-sm font-medium text-slate-800">
                        {format(new Date(slot.startTime), "MMM d, yyyy")}
                      </p>
                      <p className="text-xs text-slate-500">
                        {format(new Date(slot.startTime), "h:mm a")} â€” {format(new Date(slot.endTime), "h:mm a")}
                      </p>
                    </div>
                    <BookButton slotId={slot.id} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* My appointments */}
          <div className="card">
            <h2 className="font-semibold text-slate-900 mb-4">My appointments</h2>
            {!appointments?.length ? (
              <p className="text-slate-400 text-sm">No appointments yet.</p>
            ) : (
              <div className="space-y-3">
                {appointments.map((appt: any) => (
                  <div key={appt.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <div>
                      <p className="text-sm font-medium text-slate-800">
                        {format(new Date(appt.availabilitySlot?.startTime ?? appt.createdAt), "MMM d, yyyy")}
                      </p>
                      <p className="text-xs text-slate-500">{appt.reason ?? "General consultation"}</p>
                    </div>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      appt.status === "CONFIRMED" ? "bg-green-50 text-green-700" :
                      appt.status === "CANCELLED" ? "bg-red-50 text-red-600" :
                      "bg-amber-50 text-amber-700"
                    }`}>{appt.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function BookButton({ slotId }: { slotId: string }) {
  const [loading, setLoading] = useState(false);
  const [booked, setBooked] = useState(false);
  const { useState } = require("react");

  const book = async () => {
    setLoading(true);
    try {
      await apiClient.post("/appointments/book", { slotId });
      setBooked(true);
    } catch {
      alert("Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (booked) return <span className="text-xs text-green-600 font-medium">Booked!</span>;
  return (
    <button onClick={book} disabled={loading}
      className="text-xs btn-primary px-3 py-1.5 disabled:opacity-50">
      {loading ? "..." : "Book"}
    </button>
  );
}