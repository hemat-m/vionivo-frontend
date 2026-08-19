const footerLinks = [
  { name: "Home", href: "#home" },
  { name: "Services", href: "#services" },
  { name: "Projects", href: "#projects" },
  { name: "About", href: "#about" },
  { name: "Contact", href: "#contact" },
];

export default function Footer() {
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
              Engineering, technology, automation, and artificial intelligence
              brought together to build practical digital solutions.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
              Navigation
            </h3>

            <nav className="mt-5 flex flex-col gap-3">
              {footerLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="w-fit text-sm text-gray-400 transition hover:text-white"
                >
                  {link.name}
                </a>
              ))}
            </nav>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
              Connect
            </h3>

            <div className="mt-5 space-y-3 text-sm text-gray-400">
              <p>Engineering & Technology</p>
              <p>AI & Automation</p>
              <p>Digital Solutions</p>
            </div>
          </div>

        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-8 text-sm text-gray-500 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} VIONIVO. All rights reserved.
          </p>

          <p>Engineering • Technology • Innovation</p>
        </div>
      </div>
    </footer>
  );
}
