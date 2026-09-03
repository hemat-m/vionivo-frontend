import { getDictionary, type Locale } from "@/app/lib/get-dictionary";
const footerLinks = [
  { key: "home", href: "#home" },
  { key: "services", href: "#services" },
  { key: "projects", href: "#projects" },
  { key: "about", href: "#about" },
  { key: "contact", href: "#contact" },
];

export default function Footer({ locale }: { locale: Locale }) {
  const dictionary = getDictionary(locale);
  return (
    <footer className="border-t border-white/10 bg-[#050c16]">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-3">

          <div>
            <a
              href="#home"
              className="text-2xl font-bold tracking-tight text-white"
            >
              VIONIVO
            </a>

            <p className="mt-5 max-w-sm text-sm leading-7 text-gray-400">
              {dictionary.footer.description}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
              {dictionary.footer.navigation}
            </h3>

            <nav className="mt-5 flex flex-col gap-3">
              {footerLinks.map((link) => (
                <a
                  key={dictionary.footer.links[link.key as keyof typeof dictionary.footer.links]}
                  href={link.href}
                  className="w-fit text-sm text-gray-400 transition hover:text-white"
                >
                  {dictionary.footer.links[link.key as keyof typeof dictionary.footer.links]}
                </a>
              ))}
            </nav>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
              {dictionary.footer.connect}
            </h3>

            <div className="mt-5 space-y-3 text-sm text-gray-400">
              <p>{dictionary.footer.engineeringTechnology}</p>
              <p>{dictionary.footer.aiAutomation}</p>
              <p>{dictionary.footer.digitalSolutions}</p>
            </div>
          </div>

        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-8 text-sm text-gray-500 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} VIONIVO. {dictionary.footer.rights}
          </p>

          <p>{dictionary.footer.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
