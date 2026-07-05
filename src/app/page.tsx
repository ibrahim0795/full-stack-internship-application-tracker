import {
  BarChart3,
  BellRing,
  CalendarDays,
  FileText,
  MoveRight,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";
import Link from "next/link";

import { MarketingShell } from "@/components/layout/marketing-shell";
import { OrbitPreview } from "@/components/marketing/orbit-preview";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";

const features = [
  {
    description:
      "Keep every opportunity, contact, note, and next action in one calm workspace.",
    icon: Target,
    title: "Application tracking",
  },
  {
    description:
      "See momentum, conversion rates, and bottlenecks without turning people into vanity metrics.",
    icon: BarChart3,
    title: "Useful analytics",
  },
  {
    description:
      "Bring deadlines, interviews, and thoughtful follow-ups into a single timeline.",
    icon: CalendarDays,
    title: "Calendar clarity",
  },
  {
    description:
      "Prepare questions, answers, checklists, and interviewer notes before the conversation.",
    icon: BellRing,
    title: "Interview readiness",
  },
  {
    description:
      "Match each opportunity with the right CV version and understand what you sent.",
    icon: FileText,
    title: "CV control",
  },
];

const stages = ["Saved", "Applied", "Assessment", "Interview", "Offer"];

const principles = [
  {
    description:
      "Private records are authorised on the server and scoped to their owner.",
    icon: ShieldCheck,
    title: "Private by design",
  },
  {
    description:
      "Keyboard access, readable contrast, and reduced motion are product requirements.",
    icon: Sparkles,
    title: "Accessible by default",
  },
  {
    description:
      "Every screen should answer one question: what is the most useful next action?",
    icon: MoveRight,
    title: "Built for momentum",
  },
];

export default function Home() {
  return (
    <MarketingShell>
      <main id="main-content">
        <section className="relative isolate overflow-hidden px-5 pt-18 pb-24 sm:px-8 sm:pt-24 lg:px-10 lg:pt-28 lg:pb-32">
          <div
            className="star-grid pointer-events-none absolute inset-0 -z-10"
            aria-hidden="true"
          />
          <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-[1.02fr_0.98fr]">
            <div>
              <Badge>
                <span className="bg-primary size-1.5 rounded-full" />
                Your career command centre
              </Badge>
              <h1 className="text-foreground mt-7 max-w-4xl text-5xl leading-[0.98] font-semibold tracking-[-0.055em] sm:text-6xl lg:text-7xl xl:text-[5.2rem]">
                Navigate your path to the right opportunity.
              </h1>
              <p className="text-muted mt-7 max-w-2xl text-lg leading-8 sm:text-xl">
                CareerOrbit turns a scattered job search into a clear journey—so
                you always know where things stand and what to do next.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-start xl:flex-row">
                <Link
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "whitespace-nowrap",
                  )}
                  href="#features"
                >
                  Explore the system
                  <MoveRight aria-hidden="true" size={18} />
                </Link>
                <a
                  className={cn(
                    buttonVariants({
                      size: "lg",
                      variant: "secondary",
                    }),
                    "whitespace-nowrap",
                  )}
                  href="https://github.com/ibrahim0795/full-stack-internship-application-tracker"
                >
                  Follow the build on GitHub
                </a>
              </div>
              <p className="text-muted mt-5 text-sm">
                Currently in active development · Built openly, one verified
                phase at a time
              </p>
            </div>
            <OrbitPreview />
          </div>
        </section>

        <section
          className="border-border bg-surface/35 border-y px-5 py-7 sm:px-8 lg:px-10"
          aria-label="Product promise"
        >
          <div className="text-muted mx-auto grid max-w-7xl gap-5 text-sm font-medium sm:grid-cols-3 sm:text-center">
            <p>One source of truth</p>
            <p>Every deadline visible</p>
            <p>Every next action clear</p>
          </div>
        </section>

        <section
          className="px-5 py-24 sm:px-8 lg:px-10 lg:py-32"
          id="features"
          aria-labelledby="features-title"
        >
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <Badge tone="violet">The complete system</Badge>
              <h2
                id="features-title"
                className="text-foreground mt-6 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl"
              >
                Less application chaos. More deliberate progress.
              </h2>
              <p className="text-muted mt-5 text-lg leading-8">
                Each part of the search stays connected, from the first saved
                role to the final decision.
              </p>
            </div>
            <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card
                    className={cn(
                      "lg:col-span-2",
                      index > 2 && "lg:col-span-3",
                    )}
                    key={feature.title}
                  >
                    <CardHeader>
                      <span className="border-primary/20 bg-primary/10 text-primary-strong grid size-11 place-items-center rounded-2xl border">
                        <Icon aria-hidden="true" size={20} />
                      </span>
                      <h3 className="text-foreground pt-3 text-xl font-semibold tracking-[-0.02em]">
                        {feature.title}
                      </h3>
                    </CardHeader>
                    <CardContent className="text-muted pt-4 text-sm leading-7">
                      {feature.description}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section
          className="px-5 py-24 sm:px-8 lg:px-10 lg:py-32"
          id="workflow"
          aria-labelledby="workflow-title"
        >
          <div className="border-border bg-surface/70 mx-auto max-w-7xl rounded-[2rem] border p-6 shadow-[0_28px_100px_var(--panel-shadow)] backdrop-blur-xl sm:p-10 lg:p-14">
            <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
              <div>
                <Badge>One connected orbit</Badge>
                <h2
                  id="workflow-title"
                  className="text-foreground mt-6 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl"
                >
                  A workflow that shows the whole journey.
                </h2>
              </div>
              <p className="text-muted max-w-2xl text-lg leading-8 lg:justify-self-end">
                CareerOrbit keeps each stage visible without losing the notes,
                deadlines, people, and documents that move with it.
              </p>
            </div>
            <ol className="mt-12 grid gap-3 md:grid-cols-5">
              {stages.map((stage, index) => (
                <li
                  className="border-border bg-background/70 relative rounded-2xl border p-4"
                  key={stage}
                >
                  <span className="text-primary-strong text-xs font-semibold">
                    0{index + 1}
                  </span>
                  <p className="text-foreground mt-5 font-semibold">{stage}</p>
                  {index < stages.length - 1 ? (
                    <MoveRight
                      className="text-muted absolute top-4 right-4 hidden md:block"
                      aria-hidden="true"
                      size={16}
                    />
                  ) : null}
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section
          className="px-5 py-24 sm:px-8 lg:px-10 lg:py-32"
          id="principles"
          aria-labelledby="principles-title"
        >
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <Badge tone="neutral">Product principles</Badge>
              <h2
                id="principles-title"
                className="text-foreground mt-6 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl"
              >
                Serious foundations beneath the glow.
              </h2>
            </div>
            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {principles.map((principle) => {
                const Icon = principle.icon;
                return (
                  <div
                    className="border-border-strong border-l py-2 pl-6"
                    key={principle.title}
                  >
                    <Icon
                      className="text-accent-strong"
                      aria-hidden="true"
                      size={22}
                    />
                    <h3 className="text-foreground mt-5 text-lg font-semibold">
                      {principle.title}
                    </h3>
                    <p className="text-muted mt-3 text-sm leading-7">
                      {principle.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="px-5 pb-24 sm:px-8 lg:px-10 lg:pb-32">
          <div className="orbital-ring border-primary/20 bg-surface mx-auto max-w-7xl overflow-hidden rounded-[2rem] border p-8 text-center sm:p-12 lg:p-18">
            <Badge tone="success">Foundation in motion</Badge>
            <h2 className="text-foreground mx-auto mt-6 max-w-3xl text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
              The route is mapped. Now we build the journey.
            </h2>
            <p className="text-muted mx-auto mt-5 max-w-2xl text-lg leading-8">
              Follow the repository as CareerOrbit moves from design system to a
              cinematic 3D experience and complete product.
            </p>
            <a
              className={cn(buttonVariants({ size: "lg" }), "mt-9")}
              href="https://github.com/ibrahim0795/full-stack-internship-application-tracker"
            >
              View the development roadmap
            </a>
          </div>
        </section>
      </main>
    </MarketingShell>
  );
}
