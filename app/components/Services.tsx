

import { getDictionary, type Locale } from "@/app/lib/get-dictionary";

export default function Services({ locale }: { locale: Locale }) {
  const dictionary = getDictionary(locale);

  const services = [
    {
      number: "01",
      ...dictionary.services.items.engineering,
    },
    {
      number: "02",
      ...dictionary.services.items.ai,
    },
    {
      number: "03",
      ...dictionary.services.items.documentControl,
    },
    {
      number: "04",
      ...dictionary.services.items.automation,
    },
  ];

  return (
    <section
      id="services"
      className="relative overflow-hidden border-t border-white/10 bg-[#07111f] px-6 py-24 sm:py-32"
    >
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-1/4 h-72 w-72 rounded-full bg-cyan-400/5 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-blue-500/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl">

        {/* Section heading */}
        <div className="max-w-3xl">
          <div className="mb-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-400">
            <span className="h-px w-10 bg-cyan-400" />
            {dictionary.services.eyebrow}
          </div>

          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            <span className="bg-gradient-to-r from-cyan-300 to-blue-500 bg-clip-text text-transparent">
              {dictionary.services.title}
            </span>
          </h2>

          <p className="mt-6 max-w-2xl text-base leading-8 text-gray-400 sm:text-lg">
            {dictionary.services.description}
          </p>
        </div>

        {/* Services grid */}
        <div className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 md:grid-cols-2">

          {services.map((service) => (
            <article
              key={service.number}
              className="group relative overflow-hidden bg-[#07111f] p-8 transition duration-500 hover:bg-[#0a1728] sm:p-10"
            >
              {/* Hover glow */}
              <div className="pointer-events-none absolute -right-24 -top-24 h-48 w-48 rounded-full bg-cyan-400/10 opacity-0 blur-3xl transition duration-500 group-hover:opacity-100" />

              <div className="relative">

                {/* Top row */}
                <div className="flex items-start justify-between">
                  <span className="font-mono text-sm text-cyan-400/70">
                    {service.number}
                  </span>

                  <span className="text-2xl text-gray-500 transition duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-cyan-400">
                    ↗
                  </span>
                </div>

                {/* Label */}
                <p className="mt-12 text-xs font-semibold tracking-[0.25em] text-cyan-400">
                  {service.label}
                </p>

                {/* Title */}
                <h3 className="mt-4 text-2xl font-bold text-white transition duration-300 group-hover:text-cyan-300 sm:text-3xl">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="mt-5 max-w-lg text-sm leading-7 text-gray-400">
                  {service.description}
                </p>

                {/* Bottom line */}
                <div className="mt-10 h-px w-12 bg-white/20 transition-all duration-500 group-hover:w-full group-hover:bg-cyan-400/50" />

              </div>
            </article>
          ))}

        </div>
      </div>
    </section>
  );
}
