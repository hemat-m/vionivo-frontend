import en from "@/app/dictionaries/en.json";
import fa from "@/app/dictionaries/fa.json";

export const dictionaries = {
  en,
  fa,
} as const;

export type Locale = keyof typeof dictionaries;

export function getDictionary(locale: Locale) {
  return dictionaries[locale];
}
