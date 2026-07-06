"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  BarChart3,
  BellRing,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  FileText,
  Orbit,
  Radar,
  Sparkles,
  Target,
} from "lucide-react";
import dynamic from "next/dynamic";
import type { PointerEvent as ReactPointerEvent } from "react";
import { useEffect, useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useDeviceCapabilities } from "@/hooks/use-device-capabilities";
import { useMotionPreference } from "@/hooks/use-motion-preference";
import { cn } from "@/lib/utils/cn";

import { MotionToggle } from "./motion-toggle";
import { SceneErrorBoundary } from "./scene-error-boundary";
import { SceneLoadingState } from "./scene-loading-state";
import { StaticSpaceFallback } from "./static-space-fallback";

const DynamicCareerOrbitCanvas = dynamic(
  () =>
    import("./career-orbit-canvas").then((module) => module.CareerOrbitCanvas),
  {
    loading: SceneLoadingState,
    ssr: false,
  },
);

const features = [
  { icon: Target, label: "Applications" },
  { icon: BarChart3, label: "Analytics" },
  { icon: CalendarDays, label: "Deadlines" },
  { icon: BellRing, label: "Interviews" },
  { icon: FileText, label: "CV versions" },
];

const workflow = ["Saved", "Applied", "Assessment", "Interview", "Offer"];

function SceneLabel({
  children,
  number,
}: {
  children: string;
  number: string;
}) {
  return (
    <div className="text-primary-strong mb-5 flex items-center gap-3 text-xs font-semibold tracking-[0.16em] uppercase">
      <span className="border-primary/25 bg-primary/10 grid size-8 place-items-center rounded-full border">
        {number}
      </span>
      {children}
    </div>
  );
}

export function CareerJourney() {
  const journeyRef = useRef<HTMLElement>(null);
  const progressRef = useRef(0);
  const pointerRef = useRef({ x: 0, y: 0 });
  const [inView, setInView] = useState(true);
  const [documentVisible, setDocumentVisible] = useState(true);
  const { compact, constrained, webglSupported } = useDeviceCapabilities();
  const { reduceMotion } = useMotionPreference();
  const useStaticFallback = reduceMotion || constrained || !webglSupported;

  useEffect(() => {
    document.documentElement.toggleAttribute(
      "data-reduce-motion",
      reduceMotion,
    );
    return () => document.documentElement.removeAttribute("data-reduce-motion");
  }, [reduceMotion]);

  useEffect(() => {
    const journey = journeyRef.current;
    if (!journey || useStaticFallback) return;

    gsap.registerPlugin(ScrollTrigger);
    const trigger = ScrollTrigger.create({
      end: "bottom bottom",
      onUpdate: (self) => {
        progressRef.current = self.progress;
      },
      start: "top top",
      trigger: journey,
    });

    return () => trigger.kill();
  }, [useStaticFallback]);

  useEffect(() => {
    const journey = journeyRef.current;
    if (!journey || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "20% 0px" },
    );
    observer.observe(journey);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleVisibility = () =>
      setDocumentVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  function handlePointerMove(event: ReactPointerEvent<HTMLElement>) {
    if (useStaticFallback) return;
    pointerRef.current = {
      x: (event.clientX / window.innerWidth) * 2 - 1,
      y: -(event.clientY / window.innerHeight) * 2 + 1,
    };
  }

  return (
    <section
      className="dark text-foreground relative isolate bg-[#030711] contain-layout"
      onPointerLeave={() => {
        pointerRef.current = { x: 0, y: 0 };
      }}
      onPointerMove={handlePointerMove}
      ref={journeyRef}
    >
      <div
        className="pointer-events-none sticky top-18 z-0 h-[calc(100svh-4.5rem)] overflow-hidden"
        aria-hidden="true"
      >
        {useStaticFallback ? (
          <StaticSpaceFallback />
        ) : (
          <SceneErrorBoundary fallback={<StaticSpaceFallback />}>
            <DynamicCareerOrbitCanvas
              active={inView && documentVisible}
              compact={compact}
              pointer={pointerRef}
              progress={progressRef}
            />
          </SceneErrorBoundary>
        )}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,7,17,0.86)_0%,rgba(3,7,17,0.42)_46%,rgba(3,7,17,0.16)_100%)] lg:bg-[linear-gradient(90deg,rgba(3,7,17,0.9)_0%,rgba(3,7,17,0.46)_42%,rgba(3,7,17,0.08)_76%)]" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#030711] to-transparent" />
      </div>

      <div className="fixed right-4 bottom-4 z-40 sm:right-6 sm:bottom-6">
        <MotionToggle />
      </div>

      <div className="relative z-10 -mt-[calc(100svh-4.5rem)]">
        <section
          className="flex min-h-[110svh] items-center px-5 py-24 sm:px-8 lg:px-10"
          data-scene="hero"
          aria-labelledby="journey-hero-title"
        >
          <div className="mx-auto w-full max-w-7xl">
            <div className="max-w-3xl">
              <Badge>
                <Orbit aria-hidden="true" size={14} />
                Scroll to navigate
              </Badge>
              <h1
                className="mt-7 text-5xl leading-[0.96] font-semibold tracking-[-0.055em] text-white sm:text-6xl lg:text-7xl xl:text-[5.4rem]"
                id="journey-hero-title"
              >
                Navigate your path to the right opportunity.
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
                CareerOrbit turns every application, deadline, interview, and CV
                into one connected career journey.
              </p>
              <a
                className={cn(buttonVariants({ size: "lg" }), "mt-9")}
                href="#problem"
              >
                Begin the journey
                <ArrowRight aria-hidden="true" size={18} />
              </a>
            </div>
          </div>
        </section>

        <section
          className="flex min-h-[115svh] items-center px-5 py-24 sm:px-8 lg:px-10"
          data-scene="problem"
          id="problem"
          aria-labelledby="problem-title"
        >
          <div className="mx-auto flex w-full max-w-7xl justify-end">
            <Card className="max-w-xl border-rose-300/15 bg-[#0b101c]/82 p-7 sm:p-9">
              <SceneLabel number="02">The problem</SceneLabel>
              <h2
                className="text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl"
                id="problem-title"
              >
                A job search should not feel like debris.
              </h2>
              <p className="mt-5 text-lg leading-8 text-slate-300">
                Roles disappear into bookmarks. Deadlines hide in tabs.
                Interview notes live somewhere else. Momentum gets lost between
                them.
              </p>
              <ul className="mt-7 grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
                {[
                  "Scattered opportunities",
                  "Missed follow-ups",
                  "Unclear progress",
                  "Too many CV versions",
                ].map((item) => (
                  <li
                    className="rounded-2xl border border-white/8 bg-white/[0.04] px-4 py-3"
                    key={item}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </section>

        <section
          className="flex min-h-[115svh] items-center px-5 py-24 sm:px-8 lg:px-10"
          data-scene="solution"
          aria-labelledby="solution-title"
        >
          <div className="mx-auto w-full max-w-7xl">
            <div className="border-primary/15 max-w-xl rounded-[2rem] border bg-[#09111f]/80 p-7 shadow-[0_28px_100px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-9">
              <SceneLabel number="03">The solution</SceneLabel>
              <h2
                className="text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl"
                id="solution-title"
              >
                Bring every opportunity into one orbit.
              </h2>
              <p className="mt-5 text-lg leading-8 text-slate-300">
                CareerOrbit connects the role, people, documents, dates,
                preparation, and next action without making the process heavier.
              </p>
              <div className="mt-7 flex flex-wrap gap-2">
                {[
                  "One workspace",
                  "Clear stages",
                  "Useful reminders",
                  "Confident next steps",
                ].map((item) => (
                  <Badge key={item} tone="cyan">
                    <Check aria-hidden="true" size={13} />
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          className="flex min-h-[125svh] items-center px-5 py-24 sm:px-8 lg:px-10"
          data-scene="features"
          id="features"
          aria-labelledby="features-title"
        >
          <div className="mx-auto w-full max-w-7xl">
            <div className="max-w-2xl">
              <SceneLabel number="04">Five connected stations</SceneLabel>
              <h2
                className="text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl"
                id="features-title"
              >
                Your complete career command centre.
              </h2>
            </div>
            <div className="mt-10 grid max-w-3xl gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div
                    className="rounded-2xl border border-white/10 bg-[#0a1322]/78 p-4 backdrop-blur-xl"
                    key={feature.label}
                  >
                    <Icon
                      className="text-primary-strong"
                      aria-hidden="true"
                      size={19}
                    />
                    <p className="mt-5 text-sm font-semibold text-white">
                      {feature.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section
          className="flex min-h-[120svh] items-center px-5 py-24 sm:px-8 lg:px-10"
          data-scene="workflow"
          id="workflow"
          aria-labelledby="workflow-title"
        >
          <div className="mx-auto flex w-full max-w-7xl justify-end">
            <div className="max-w-2xl rounded-[2rem] border border-white/10 bg-[#09111f]/82 p-7 backdrop-blur-xl sm:p-9">
              <SceneLabel number="05">One visible route</SceneLabel>
              <h2
                className="text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl"
                id="workflow-title"
              >
                From saved role to signed offer.
              </h2>
              <ol className="mt-8 grid gap-2 sm:grid-cols-5">
                {workflow.map((stage, index) => (
                  <li
                    className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
                    key={stage}
                  >
                    <span className="text-primary-strong text-xs font-semibold">
                      0{index + 1}
                    </span>
                    <p className="mt-4 text-sm font-semibold text-white">
                      {stage}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section
          className="flex min-h-[120svh] items-center px-5 py-24 sm:px-8 lg:px-10"
          data-scene="dashboard"
          aria-labelledby="dashboard-title"
        >
          <div className="mx-auto w-full max-w-7xl">
            <div className="max-w-xl">
              <SceneLabel number="06">Dashboard preview</SceneLabel>
              <h2
                className="text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl"
                id="dashboard-title"
              >
                See momentum, not meaningless numbers.
              </h2>
              <p className="mt-5 text-lg leading-8 text-slate-300">
                Real data will surface deadlines, interview rate, recent
                activity, and the most useful next action.
              </p>
              <div
                className="mt-8 grid grid-cols-2 gap-3"
                aria-label="Illustrative dashboard preview"
              >
                {[
                  ["Applications", "24"],
                  ["Interviews", "5"],
                  ["Next deadline", "2 days"],
                  ["Follow-ups", "3 due"],
                ].map(([label, value]) => (
                  <div
                    className="rounded-2xl border border-white/10 bg-[#0a1322]/78 p-4"
                    key={label}
                  >
                    <p className="text-xs text-slate-400">{label}</p>
                    <p className="mt-2 text-xl font-semibold text-white">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs text-slate-500">
                Illustrative sample data
              </p>
            </div>
          </div>
        </section>

        <section
          className="flex min-h-[120svh] items-center px-5 py-24 text-center sm:px-8 lg:px-10"
          data-scene="destination"
          id="principles"
          aria-labelledby="destination-title"
        >
          <div className="border-primary/20 mx-auto max-w-3xl rounded-[2.5rem] border bg-[#07101d]/78 p-8 shadow-[0_0_120px_rgba(34,211,238,0.12)] backdrop-blur-xl sm:p-12">
            <SceneLabel number="07">Your destination</SceneLabel>
            <Sparkles
              className="text-primary-strong mx-auto"
              aria-hidden="true"
              size={34}
            />
            <h2
              className="mt-6 text-4xl font-semibold tracking-[-0.045em] text-white sm:text-6xl"
              id="destination-title"
            >
              Your next opportunity is already out there.
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              CareerOrbit will help you approach it with organisation, context,
              and confidence.
            </p>
            <a
              className={cn(buttonVariants({ size: "lg" }), "mt-9")}
              href="/register"
            >
              Start your CareerOrbit
              <BriefcaseBusiness aria-hidden="true" size={18} />
            </a>
            <div className="mt-8 flex flex-wrap justify-center gap-2 text-xs text-slate-400">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2">
                <Radar aria-hidden="true" size={14} /> Accessible by default
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2">
                <Sparkles aria-hidden="true" size={14} /> Performance-aware
              </span>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}
