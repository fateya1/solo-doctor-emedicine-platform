"use client";
import { useEffect } from "react";

export function KeepAlive() {
  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ?? "";
    if (!base) return;
    const ping = () => fetch(base + "/health", { method: "GET" }).catch(() => {});
    ping();
    const id = setInterval(ping, 9 * 60 * 1000); // every 9 minutes
    return () => clearInterval(id);
  }, []);
  return null;
}
