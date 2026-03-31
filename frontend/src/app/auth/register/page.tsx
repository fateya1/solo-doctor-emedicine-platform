"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Stethoscope, Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { apiClient } from "@/lib/api";

const schema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["PATIENT", "DOCTOR"]),
});
type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((s) => s.setAuth);
  const defaultRole = (searchParams.get("role") as "PATIENT" | "DOCTOR") ?? "PATIENT";

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: defaultRole },
  });

  const role = watch("role");

  const onSubmit = async (data: FormData) => {
    setError("");
    try {
      await apiClient.post("/auth/register", data);
      const loginRes = await apiClient.post("/auth/login", { email: data.email, password: data.password });
      setAuth(loginRes.data.accessToken, loginRes.data.user);
      router.push(data.role === "DOCTOR" ? "/dashboard/doctor" : "/dashboard/patient");
    } catch (err: any) {
      setError(err.response?.data?.message?.[0] || err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-brand-600 rounded-2xl mb-4">
            <Stethoscope className="w-6 h-6 text-white" />
          </div>
          <h1 className="font-display text-3xl font-bold text-slate-900">Create account</h1>
          <p className="text-slate-500 mt-2">Join the platform today</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            {/* Role selector */}
            <div className="grid grid-cols-2 gap-3">
              {(["PATIENT", "DOCTOR"] as const).map((r) => (
                <label key={r} className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                  role === r ? "border-brand-500 bg-brand-50 text-brand-700" : "border-slate-200 text-slate-500 hover:border-slate-300"
                }`}>
                  <input {...register("role")} type="radio" value={r} className="hidden" />
                  <span className="font-medium text-sm">{r === "PATIENT" ? "ðŸ§‘ Patient" : "ðŸ‘¨â€âš•ï¸ Doctor"}</span>
                </label>
              ))}
            </div>

            <div>
              <label className="label">Full name</label>
              <input {...register("fullName")} placeholder="John Doe" className="input" />
              {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
            </div>

            <div>
              <label className="label">Email address</label>
              <input {...register("email")} type="email" placeholder="you@example.com" className="input" />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="label">Password</label>
              <input {...register("password")} type="password" placeholder="Min. 8 characters" className="input" />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={isSubmitting} className="btn-primary w-full flex items-center justify-center gap-2">
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {isSubmitting ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-brand-600 font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}