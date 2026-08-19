"use client";

import { FormEvent, useState } from "react";

export default function Contact() {
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");

  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      company: String(formData.get("company") ?? ""),
      projectType: String(formData.get("projectType") ?? ""),
      message: String(formData.get("message") ?? ""),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Something went wrong.");
      }

      form.reset();
      setStatus("success");
      setMessage("Your message has been received. We will get back to you.");
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to send your message."
      );
    }
  }

  return (
    <section
      id="contact"
      className="relative overflow-hidden border-t border-white/10 bg-[#050c16] px-6 py-24 sm:py-32"
    >
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/5 blur-3xl" />

      <div className="relative mx-auto max-w-5xl">
        <div className="text-center">
          <div className="mb-5 flex items-center justify-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-400">
            <span className="h-px w-10 bg-cyan-400" />
            Contact
            <span className="h-px w-10 bg-cyan-400" />
          </div>

          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            Let&apos;s build something{" "}
            <span className="bg-gradient-to-r from-cyan-300 to-blue-500 bg-clip-text text-transparent">
              useful.
            </span>
          </h2>

          <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-gray-400 sm:text-lg">
            Have an engineering, automation, software, or AI project?
            Let&apos;s talk.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-14 max-w-3xl rounded-3xl border border-white/10 bg-white/[0.025] p-6 backdrop-blur sm:p-8"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <input
              name="name"
              required
              maxLength={100}
              placeholder="Your name"
              className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-white outline-none placeholder:text-gray-500 focus:border-cyan-400/50"
            />

            <input
              name="email"
              type="email"
              required
              maxLength={254}
              placeholder="Email address"
              className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-white outline-none placeholder:text-gray-500 focus:border-cyan-400/50"
            />

            <input
              name="company"
              maxLength={150}
              placeholder="Company"
              className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-white outline-none placeholder:text-gray-500 focus:border-cyan-400/50"
            />

            <select
              name="projectType"
              defaultValue=""
              className="rounded-2xl border border-white/10 bg-[#0b1726] px-5 py-4 text-gray-300 outline-none focus:border-cyan-400/50"
            >
              <option value="" disabled>
                Project type
              </option>
              <option value="Engineering">Engineering</option>
              <option value="AI">AI</option>
              <option value="Document Control">Document Control</option>
              <option value="Automation">Automation</option>
              <option value="Software">Software</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <textarea
            name="message"
            required
            maxLength={5000}
            rows={6}
            placeholder="Tell us about your project..."
            className="mt-5 w-full resize-none rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-white outline-none placeholder:text-gray-500 focus:border-cyan-400/50"
          />

          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="submit"
              disabled={status === "sending"}
              className="rounded-full bg-cyan-400 px-7 py-3.5 font-semibold text-[#07111f] transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {status === "sending" ? "Sending..." : "Send Message →"}
            </button>

            {message && (
              <p
                className={
                  status === "success"
                    ? "text-sm text-cyan-300"
                    : "text-sm text-red-300"
                }
              >
                {message}
              </p>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
