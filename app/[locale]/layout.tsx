import type { ReactNode } from "react";
import { notFound } from "next/navigation";

const locales = ["en", "fa"] as const;

type Locale = (typeof locales)[number];

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  return (
    <div
      lang={locale}
      dir={locale === "fa" ? "rtl" : "ltr"}
      className="min-h-full"
    >
      {children}
    </div>
  );
}
