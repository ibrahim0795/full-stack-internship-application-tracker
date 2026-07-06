import { ApplicationStage, WorkArrangement } from "@prisma/client";
import { BriefcaseBusiness, Plus, Search } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { appNavigation } from "@/components/layout/app-navigation";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input, Select } from "@/components/ui/form-field";
import {
  applicationStageLabels,
  workArrangementLabels,
} from "@/features/applications/application-schema";
import { requireUserId } from "@/lib/auth/require-user";
import { cn } from "@/lib/utils/cn";
import { applicationRepository } from "@/server/repositories/application-repository";

export const metadata: Metadata = { title: "Applications" };

interface ApplicationsPageProps {
  searchParams: Promise<{
    q?: string;
    sort?: string;
    stage?: string;
    work?: string;
  }>;
}

function enumValue<T extends string>(values: readonly T[], value?: string) {
  return value && values.includes(value as T) ? (value as T) : undefined;
}

export default async function ApplicationsPage({
  searchParams,
}: ApplicationsPageProps) {
  const userId = await requireUserId("/applications");
  const parameters = await searchParams;
  const applications = await applicationRepository.list(userId, {
    query: parameters.q?.trim(),
    sort: enumValue(
      ["company", "closing", "newest", "oldest"] as const,
      parameters.sort,
    ),
    stage: enumValue(Object.values(ApplicationStage), parameters.stage),
    workArrangement: enumValue(Object.values(WorkArrangement), parameters.work),
  });

  return (
    <AppShell navigation={appNavigation("applications")} title="Applications">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Badge tone="violet">Application pipeline</Badge>
            <h2 className="text-foreground mt-4 text-3xl font-semibold tracking-[-0.04em]">
              Your opportunities
            </h2>
            <p className="text-muted mt-2">
              Search, filter, and keep every next action visible.
            </p>
          </div>
          <Link className={buttonVariants()} href="/applications/new">
            <Plus aria-hidden="true" size={17} /> Add application
          </Link>
        </div>

        <form className="border-border bg-surface/55 mt-8 grid gap-3 rounded-3xl border p-4 md:grid-cols-[1fr_repeat(3,minmax(10rem,auto))_auto]">
          <label className="relative">
            <span className="sr-only">Search applications</span>
            <Search
              className="text-muted absolute top-3 left-4"
              aria-hidden="true"
              size={18}
            />
            <Input
              className="pl-11"
              defaultValue={parameters.q}
              name="q"
              placeholder="Search company or role"
            />
          </label>
          <Select
            aria-label="Filter by stage"
            defaultValue={parameters.stage ?? ""}
            name="stage"
          >
            <option value="">All stages</option>
            {Object.values(ApplicationStage).map((stage) => (
              <option key={stage} value={stage}>
                {applicationStageLabels[stage]}
              </option>
            ))}
          </Select>
          <Select
            aria-label="Filter by work arrangement"
            defaultValue={parameters.work ?? ""}
            name="work"
          >
            <option value="">All arrangements</option>
            {Object.values(WorkArrangement).map((work) => (
              <option key={work} value={work}>
                {workArrangementLabels[work]}
              </option>
            ))}
          </Select>
          <Select
            aria-label="Sort applications"
            defaultValue={parameters.sort ?? "newest"}
            name="sort"
          >
            <option value="newest">Recently updated</option>
            <option value="oldest">Oldest first</option>
            <option value="company">Company A–Z</option>
            <option value="closing">Closing soon</option>
          </Select>
          <button
            className={buttonVariants({ variant: "secondary" })}
            type="submit"
          >
            Apply
          </button>
        </form>

        {applications.length ? (
          <div className="mt-6 grid gap-4">
            {applications.map((application) => (
              <Link
                className="focus-visible:outline-focus rounded-3xl focus-visible:outline-2 focus-visible:outline-offset-2"
                href={`/applications/${application.id}`}
                key={application.id}
              >
                <Card className="hover:border-primary/35 transition hover:-translate-y-0.5">
                  <CardContent className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge>
                          {applicationStageLabels[application.stage]}
                        </Badge>
                        <span className="text-muted text-xs">
                          {workArrangementLabels[application.workArrangement]}
                        </span>
                      </div>
                      <h3 className="text-foreground mt-3 truncate text-xl font-semibold">
                        {application.positionTitle}
                      </h3>
                      <p className="text-muted mt-1">
                        {application.companyName}
                      </p>
                      {application.tags.length ? (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {application.tags.slice(0, 4).map(({ tag }) => (
                            <span
                              className="bg-accent/10 text-accent-strong rounded-full px-2.5 py-1 text-xs"
                              key={tag.id}
                            >
                              {tag.displayName}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </div>
                    <div className="text-muted shrink-0 text-sm sm:text-right">
                      {application.closingDate ? (
                        <p>
                          Closes {application.closingDate.toLocaleDateString()}
                        </p>
                      ) : (
                        <p>No closing date</p>
                      )}
                      <p className="mt-1">
                        Updated {application.updatedAt.toLocaleDateString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card className="mt-6 border-dashed">
            <CardContent className="grid min-h-64 place-items-center text-center">
              <div>
                <BriefcaseBusiness
                  className="text-primary-strong mx-auto"
                  aria-hidden="true"
                  size={34}
                />
                <h3 className="text-foreground mt-4 text-xl font-semibold">
                  No applications found
                </h3>
                <p className="text-muted mt-2 max-w-md">
                  Add your first opportunity or adjust the current search and
                  filters.
                </p>
                <Link
                  className={cn(buttonVariants(), "mt-5")}
                  href="/applications/new"
                >
                  Add application
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppShell>
  );
}
