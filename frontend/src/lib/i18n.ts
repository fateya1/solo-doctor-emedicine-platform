"use client";
import { useLanguageStore } from "@/store/language";
import { translations } from "./translations";

type Section = keyof typeof translations.en;
type Keys<S extends Section> = keyof typeof translations.en[S];

/**
 * useT() — returns a typed translation function.
 *
 * Usage:
 *   const t = useT();
 *   t("common", "save")          // → "Save" | "Hifadhi" | "Enregistrer"
 *   t("auth", "welcomeBack")     // → "Welcome back" | "Karibu tena" | "Bon retour"
 */
export function useT() {
  const locale = useLanguageStore((s) => s.locale);

  function t<S extends Section>(section: S, key: Keys<S>): string {
    const localeData = translations[locale] as typeof translations.en;
    const fallback = translations.en;
    const val = (localeData[section] as any)[key as string];
    if (val !== undefined) return val as string;
    return (fallback[section] as any)[key as string] as string;
  }

  return t;
}
