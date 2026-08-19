export default function About() {
  return (
    <section
      id="about"
      className="relative overflow-hidden border-t border-white/10 bg-[#07111f] px-6 py-24 sm:py-32"
    >
      <div className="pointer-events-none absolute right-0 top-1/4 h-80 w-80 rounded-full bg-cyan-400/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <div className="mb-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-400">
            <span className="h-px w-10 bg-cyan-400" />
            About
          </div>

          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            Engineering knowledge.{" "}
            <span className="bg-gradient-to-r from-cyan-300 to-blue-500 bg-clip-text text-transparent">
              Digital thinking.
            </span>
          </h2>

          <p className="mt-7 max-w-2xl text-base leading-8 text-gray-400 sm:text-lg">
            VIONIVO is being built as a technology platform connecting
            engineering, software, automation, and artificial intelligence
            to create practical solutions for real-world projects.
          </p>
        </div>

        <div className="mt-16 grid gap-5 md:grid-cols-3">
          {[
            ["01", "Engineering", "Real-world technical knowledge."],
            ["02", "Technology", "Modern software and digital workflows."],
            ["03", "Intelligence", "AI-powered practical solutions."],
          ].map(([number, title, description]) => (
            <div
              key={number}
              className="rounded-3xl border border-white/10 bg-white/[0.025] p-7 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-white/[0.045]"
            >
              <span className="font-mono text-sm text-cyan-400/70">
                {number}
              </span>

              <h3 className="mt-10 text-xl font-bold text-white">
                {title}
              </h3>

              <p className="mt-3 text-sm leading-7 text-gray-400">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
