import { prisma } from "../lib/prisma";
import { getDictionary, type Locale } from "@/app/lib/get-dictionary";

export default async function Projects({ locale }: { locale: Locale }) {
  const dictionary = getDictionary(locale);
  const projects = await prisma.project.findMany({
    where: {
      published: true,
      featured: true,
    },
    orderBy: {
      sortOrder: "asc",
    },
  });

  return (
    <section
      id="projects"
      className="relative overflow-hidden border-t border-white/10 bg-[#050c16] px-6 py-24 sm:py-32"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/3 top-0 h-80 w-80 rounded-full bg-cyan-400/5 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-blue-500/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <div className="mb-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-400">
              <span className="h-px w-10 bg-cyan-400" />
              {dictionary.projects.eyebrow}
            </div>

            <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
              {dictionary.projects.titleStart}{" "}
              <span className="bg-gradient-to-r from-cyan-300 to-blue-500 bg-clip-text text-transparent">
                {dictionary.projects.titleHighlight}
              </span>
            </h2>

            <p className="mt-6 max-w-2xl text-base leading-8 text-gray-400 sm:text-lg">
              {dictionary.projects.description}
            </p>
          </div>

          <a
            href="#contact"
            className="w-fit rounded-full border border-cyan-400/30 bg-cyan-400/5 px-6 py-3 text-sm font-semibold text-cyan-300 transition duration-300 hover:border-cyan-400/60 hover:bg-cyan-400/10"
          >
            {dictionary.projects.startProject}
          </a>
        </div>

        <div className="mt-16 grid gap-5 lg:grid-cols-3">
          {projects.map((project, index) => (
            <article
              key={project.id}
              className="group relative flex min-h-[420px] flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025] p-7 backdrop-blur-sm transition duration-500 hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-white/[0.045] sm:p-9"
            >
              <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-cyan-400/10 opacity-0 blur-3xl transition duration-500 group-hover:opacity-100" />

              <div className="relative flex flex-1 flex-col">
                <div className="flex items-start justify-between">
                  <span className="font-mono text-sm text-cyan-400/70">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="text-2xl text-gray-500 transition duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-cyan-400">
                    ↗
                  </span>
                </div>

                <p className="mt-14 text-xs font-semibold tracking-[0.22em] text-cyan-400">
                  {project.category}
                </p>

                <h3 className="mt-4 text-2xl font-bold leading-tight text-white transition duration-300 group-hover:text-cyan-300">
                  {project.title}
                </h3>

                <p className="mt-5 text-sm leading-7 text-gray-400">
                  {project.description}
                </p>

                <div className="mt-auto pt-10">
                  <div className="mb-5 h-px w-full bg-white/10 transition duration-500 group-hover:bg-cyan-400/30" />

                  <a
                    href="#contact"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-gray-300 transition group-hover:text-cyan-300"
                  >
                    {dictionary.projects.exploreProject}
                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
