"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Calendar, Clock, User, LogOut, Stethoscope, Loader2, Search, X, Menu } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { apiClient } from "@/lib/api";
import { format } from "date-fns";

type Tab = "find-doctors" | "appointments";

export default function PatientDashboard() {
  const { user, token, logout, _hasHydrated } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<Tab>("find-doctors");
  const [searchName, setSearchName] = useState("");
  const [searchSpecialty, setSearchSpecialty] = useState("");
  const [searchQuery, setSearchQuery] = useState({ name: "", specialty: "" });
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (_hasHydrated && !token) router.push("/auth/login");
  }, [token, _hasHydrated, router]);

  const { data: profile } = useQuery({
    queryKey: ["patient-profile"],
    queryFn: () => apiClient.get("/patient/profile").then((r) => r.data),
    enabled: !!token && _hasHydrated,
  });

  const { data: appointments, refetch: refetchAppointments } = useQuery({
    queryKey: ["my-appointments"],
    queryFn: () => apiClient.get("/appointments/my").then((r) => r.data),
    enabled: !!token && _hasHydrated,
  });

  const { data: doctors, isLoading: searchingDoctors } = useQuery({
    queryKey: ["doctor-search", searchQuery],
    queryFn: () =>
      apiClient.get(`/doctor/search?name=${searchQuery.name}&specialty=${searchQuery.specialty}`).then((r) => r.data),
    enabled: !!token && _hasHydrated,
  });

  const cancelMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/appointments/${id}/cancel`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-appointments"] });
      queryClient.invalidateQueries({ queryKey: ["doctor-search"] });
      setCancellingId(null);
    },
    onError: (err: any) => alert(err.response?.data?.message || "Failed to cancel appointment."),
  });

  if (!_hasHydrated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!token) return null;

  const confirmedAppts = appointments?.filter((a: any) => a.status === "CONFIRMED").length ?? 0;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* â”€â”€ Header â”€â”€ */}
      <header className="bg-white border-b border-slate-100 px-4 sm:px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
              <Stethoscope className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-lg">SoloDoc</span>
          </div>
          {/* Desktop nav */}
          <div className="hidden sm:flex items-center gap-4">
            <span className="text-sm text-slate-600">Hi, {user?.fullName?.split(" ")[0]}</span>
            <button onClick={() => { logout(); router.push("/auth/login"); }}
              className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-red-500 transition-colors">
              <LogOut className="w-4 h-4" /> Sign out
            </button>
          </div>
          {/* Mobile hamburger */}
          <button className="sm:hidden p-2 rounded-lg hover:bg-slate-50"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-5 h-5 text-slate-600" /> : <Menu className="w-5 h-5 text-slate-600" />}
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="sm:hidden mt-3 pt-3 border-t border-slate-100 flex flex-col gap-3 pb-2">
            <p className="text-sm text-slate-600 px-1">Hi, {user?.fullName?.split(" ")[0]}</p>
            <button onClick={() => { logout(); router.push("/auth/login"); }}
              className="flex items-center gap-1.5 text-sm text-red-500 px-1">
              <LogOut className="w-4 h-4" /> Sign out
            </button>
          </div>
        )}
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* â”€â”€ Stats: 1 col mobile â†’ 3 cols desktop â”€â”€ */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5 mb-6 sm:mb-8">
          {[
            { icon: Calendar, label: "Total appointments", value: appointments?.length ?? 0 },
            { icon: Clock, label: "Confirmed", value: confirmedAppts },
            { icon: User, label: "Profile", value: profile ? "Complete" : "Loading..." },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="card flex sm:flex-col items-center sm:items-start gap-4 sm:gap-0 p-4 sm:p-5">
              <div className="w-9 h-9 bg-brand-50 rounded-xl flex items-center justify-center sm:mb-3 shrink-0">
                <Icon className="w-4 h-4 text-brand-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{value}</p>
                <p className="text-sm text-slate-500 mt-0.5">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* â”€â”€ Tabs â”€â”€ */}
        <div className="flex gap-1 bg-white border border-slate-100 rounded-xl p-1 mb-6 w-full sm:w-fit">
          {[
            { key: "find-doctors" as Tab, label: "Find Doctors" },
            { key: "appointments" as Tab, label: "My Appointments" },
          ].map(({ key, label }) => (
            <button key={key} onClick={() => setTab(key)}
              className={`flex-1 sm:flex-none px-4 py-2.5 rounded-lg text-sm font-medium transition-all touch-manipulation ${
                tab === key ? "bg-brand-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
              }`}>
              {label}
            </button>
          ))}
        </div>

        {/* â”€â”€ Find Doctors Tab â”€â”€ */}
        {tab === "find-doctors" && (
          <div>
            {/* Search bar â€” stacks on mobile */}
            <div className="card mb-6">
              <h2 className="font-semibold text-slate-900 mb-4">Search for a Doctor</h2>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input value={searchName} onChange={(e) => setSearchName(e.target.value)}
                    placeholder="Doctor name..." className="input pl-9 w-full" />
                </div>
                <div className="relative flex-1">
                  <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input value={searchSpecialty} onChange={(e) => setSearchSpecialty(e.target.value)}
                    placeholder="Specialty (e.g. Cardiology)..." className="input pl-9 w-full" />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSearchQuery({ name: searchName, specialty: searchSpecialty })}
                    className="btn-primary flex items-center gap-2 flex-1 sm:flex-none justify-center touch-manipulation">
                    <Search className="w-4 h-4" /> Search
                  </button>
                  {(searchQuery.name || searchQuery.specialty) && (
                    <button onClick={() => { setSearchName(""); setSearchSpecialty(""); setSearchQuery({ name: "", specialty: "" }); }}
                      className="btn-secondary flex items-center gap-1 touch-manipulation">
                      <X className="w-4 h-4" /> Clear
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Doctor cards */}
            {searchingDoctors ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
              </div>
            ) : !doctors?.length ? (
              <div className="card text-center py-12">
                <p className="text-slate-400">No doctors found. Try a different search.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                {doctors.map((doc: any) => (
                  <DoctorCard key={doc.id} doctor={doc}
                    onBooked={() => {
                      queryClient.invalidateQueries({ queryKey: ["my-appointments"] });
                      queryClient.invalidateQueries({ queryKey: ["doctor-search"] });
                      refetchAppointments();
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* â”€â”€ Appointments Tab â”€â”€ */}
        {tab === "appointments" && (
          <div className="card">
            <h2 className="font-semibold text-slate-900 mb-5">My Appointments</h2>
            {!appointments?.length ? (
              <div className="text-center py-8">
                <p className="text-slate-400 mb-4">No appointments yet.</p>
                <button onClick={() => setTab("find-doctors")} className="btn-primary touch-manipulation">
                  Find a doctor
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {appointments.map((appt: any) => (
                  <div key={appt.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-slate-50 rounded-xl">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        Dr. {appt.availabilitySlot?.doctor?.user?.fullName ?? "Unknown"}
                      </p>
                      <p className="text-xs text-slate-500">
                        {appt.availabilitySlot?.startTime
                          ? format(new Date(appt.availabilitySlot.startTime), "EEEE, MMM d yyyy · h:mm a")
                          : "N/A"}
                      </p>
                      <p className="text-xs text-slate-400">{appt.reason ?? "General consultation"}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        appt.status === "CONFIRMED" ? "bg-green-50 text-green-700" :
                        appt.status === "COMPLETED" ? "bg-blue-50 text-blue-700" :
                        appt.status === "CANCELLED" ? "bg-red-50 text-red-600" :
                        appt.status === "NO_SHOW" ? "bg-slate-100 text-slate-500" :
                        "bg-amber-50 text-amber-700"
                      }`}>{appt.status}</span>
                      {appt.status === "CONFIRMED" && (
                        cancellingId === appt.id ? (
                          <div className="flex gap-1">
                            <button onClick={() => cancelMutation.mutate(appt.id)}
                              disabled={cancelMutation.isPending}
                              className="text-xs bg-red-600 text-white px-3 py-2 rounded-lg flex items-center gap-1 touch-manipulation">
                              {cancelMutation.isPending && <Loader2 className="w-3 h-3 animate-spin" />}
                              Confirm cancel
                            </button>
                            <button onClick={() => setCancellingId(null)}
                              className="text-xs bg-slate-100 text-slate-600 px-3 py-2 rounded-lg touch-manipulation">
                              Keep
                            </button>
                          </div>
                        ) : (
                          <button onClick={() => setCancellingId(appt.id)}
                            className="text-xs bg-red-50 text-red-600 hover:bg-red-100 px-3 py-2 rounded-lg transition-colors touch-manipulation">
                            Cancel
                          </button>
                        )
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function DoctorCard({ doctor, onBooked }: { doctor: any; onBooked: () => void }) {
  const [bookingSlot, setBookingSlot] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const queryClient = useQueryClient();

  const bookMutation = useMutation({
    mutationFn: (slotId: string) =>
      apiClient.post("/appointments/book", { slotId, reason: reason || undefined }),
    onSuccess: () => {
      setBookingSlot(null);
      setReason("");
      queryClient.invalidateQueries({ queryKey: ["doctor-search"] });
      onBooked();
    },
    onError: (err: any) => alert(err.response?.data?.message || "Booking failed."),
  });

  return (
    <div className="card">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center text-xl shrink-0">ðŸ‘¨â€âš•ï¸</div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-900">{doctor.user?.fullName}</h3>
          <p className="text-sm text-brand-600">{doctor.specialty ?? "General Practice"}</p>
          <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{doctor.bio ?? "No bio available"}</p>
          <div className="flex gap-3 mt-2 text-xs text-slate-500 flex-wrap">
            {doctor.yearsOfExperience && <span>ðŸŽ“ {doctor.yearsOfExperience} yrs</span>}
            {doctor.consultationFee && <span>ðŸ’° KES {Number(doctor.consultationFee).toLocaleString()}</span>}
          </div>
        </div>
      </div>

      {doctor.availabilitySlots?.length > 0 ? (
        <div>
          <p className="text-xs font-medium text-slate-600 mb-2">Available slots:</p>
          <div className="space-y-2">
            {doctor.availabilitySlots.map((slot: any) => (
              <div key={slot.id}>
                {bookingSlot === slot.id ? (
                  <div className="bg-brand-50 border border-brand-100 rounded-xl p-3">
                    <p className="text-xs font-medium text-brand-800 mb-2">
                      {format(new Date(slot.startTime), "MMM d · h:mm a")}
                    </p>
                    <input value={reason} onChange={(e) => setReason(e.target.value)}
                      placeholder="Reason for visit (optional)" className="input text-xs mb-2 w-full" />
                    <div className="flex gap-2">
                      <button onClick={() => bookMutation.mutate(slot.id)}
                        disabled={bookMutation.isPending}
                        className="btn-primary text-xs flex-1 flex items-center justify-center gap-1 py-2.5 touch-manipulation">
                        {bookMutation.isPending && <Loader2 className="w-3 h-3 animate-spin" />}
                        Confirm booking
                      </button>
                      <button onClick={() => setBookingSlot(null)}
                        className="btn-secondary text-xs py-2.5 touch-manipulation">
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-700">
                      {format(new Date(slot.startTime), "MMM d, yyyy · h:mm a")}
                    </p>
                    <button onClick={() => setBookingSlot(slot.id)}
                      className="text-xs bg-brand-600 text-white px-3 py-2 rounded-lg hover:bg-brand-700 touch-manipulation">
                      Book
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-xs text-slate-400 bg-slate-50 rounded-lg p-3 text-center">
          No available slots at the moment
        </p>
      )}
    </div>
  );
}


