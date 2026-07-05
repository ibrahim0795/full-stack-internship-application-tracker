export default function Home() {
  return (
    <main className="relative isolate flex min-h-screen items-center overflow-hidden px-6 py-20 sm:px-10 lg:px-16">
      <div className="orbit-glow" aria-hidden="true" />
      <div className="mx-auto w-full max-w-6xl">
        <p className="mb-10 inline-flex items-center gap-3 text-sm font-semibold tracking-[0.22em] text-cyan-300 uppercase">
          <span className="size-2 rounded-full bg-cyan-300 shadow-[0_0_18px_#67e8f9]" />
          Foundation online
        </p>
        <div className="max-w-4xl">
          <h1 className="text-5xl leading-none font-semibold tracking-[-0.05em] text-white sm:text-7xl lg:text-8xl">
            Navigate your path to the right opportunity.
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
            CareerOrbit will bring applications, interviews, deadlines, and CV
            versions into one focused career command centre.
          </p>
        </div>
        <section
          id="foundation"
          aria-labelledby="foundation-title"
          className="mt-16 max-w-xl rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-2xl shadow-cyan-950/30 backdrop-blur-xl"
        >
          <p className="text-xs font-semibold tracking-[0.18em] text-violet-300 uppercase">
            Phase 1
          </p>
          <h2
            id="foundation-title"
            className="mt-3 text-2xl font-semibold text-white"
          >
            Project foundation established
          </h2>
          <p className="mt-3 leading-7 text-slate-300">
            The architecture, quality gates, and implementation roadmap are in
            place. Product features and the cinematic 3D journey arrive in
            focused, reviewable phases.
          </p>
          <a
            className="mt-6 inline-flex min-h-11 items-center rounded-full border border-cyan-300/30 bg-cyan-300/10 px-5 font-semibold text-cyan-100 transition hover:border-cyan-200 hover:bg-cyan-300/20 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300"
            href="https://github.com/ibrahim0795/full-stack-internship-application-tracker"
          >
            View the project on GitHub
          </a>
        </section>
      </div>
    </main>
  );
}
