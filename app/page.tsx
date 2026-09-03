import Header from "./components/Header";
import Services from "./components/Services";
import Projects from "./components/Projects";
import About from "./components/About";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <Header locale="en" />

      <section
        id="home"
        className="relative isolate overflow-hidden"
      >
        {/* Background glow */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="absolute right-0 top-1/3 h-[300px] w-[300px] rounded-full bg-blue-500/10 blur-3xl" />
        </div>

        <div className="mx-auto flex min-h-[calc(100vh-81px)] max-w-7xl items-center px-6 py-24">
          <div className="w-full">

            <div className="max-w-4xl">
              <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
                <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.9)]" />
                Engineering • Technology • Innovation
              </div>

              <h1 className="text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
                Building the future of{" "}
                <span className="bg-gradient-to-r from-cyan-300 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  engineering
                </span>{" "}
                with intelligence.
              </h1>

              <p className="mt-8 max-w-2xl text-base leading-8 text-gray-300 sm:text-lg md:text-xl">
                VIONIVO connects engineering expertise, digital technology,
                automation, and artificial intelligence to create practical
                solutions for real-world projects.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <a
                  href="#projects"
                  className="rounded-full bg-cyan-400 px-7 py-3.5 text-center font-semibold text-[#07111f] shadow-[0_0_30px_rgba(34,211,238,0.15)] transition duration-300 hover:-translate-y-0.5 hover:bg-cyan-300 hover:shadow-[0_0_40px_rgba(34,211,238,0.25)]"
                >
                  Explore Projects
                </a>

                <a
                  href="#contact"
                  className="rounded-full border border-white/15 bg-white/[0.03] px-7 py-3.5 text-center font-semibold text-white backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-cyan-400/40 hover:bg-white/[0.06]"
                >
                  Start a Project
                </a>
              </div>
            </div>

            <div className="mt-20 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur">
                <p className="text-sm font-semibold text-cyan-400">
                  ENGINEERING
                </p>
                <p className="mt-2 text-sm text-gray-400">
                  Technical knowledge turned into practical digital solutions.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur">
                <p className="text-sm font-semibold text-cyan-400">
                  AUTOMATION
                </p>
                <p className="mt-2 text-sm text-gray-400">
                  Faster workflows with less repetitive work.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur">
                <p className="text-sm font-semibold text-cyan-400">
                  AI
                </p>
                <p className="mt-2 text-sm text-gray-400">
                  Intelligent systems for modern engineering projects.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Services locale="en" />

      <Projects locale="en" />

      <About locale="en" />

      <Contact locale="en" />
      <Footer locale="en" />
    </main>
  );
}
