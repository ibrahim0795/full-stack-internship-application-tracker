import { Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { moveApplicationStageAction } from "@/app/actions/applications";
import { appNavigation } from "@/components/layout/app-navigation";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { KanbanBoard } from "@/features/kanban/kanban-board";
import { requireUserId } from "@/lib/auth/require-user";
import { applicationRepository } from "@/server/repositories/application-repository";

export const metadata: Metadata = { title: "Kanban" };

export default async function KanbanPage() {
  const userId = await requireUserId("/kanban");
  const applications = await applicationRepository.list(userId);
  const boardApplications = applications.map((application) => ({
    closingDate: application.closingDate?.toISOString() ?? null,
    companyName: application.companyName,
    id: application.id,
    positionTitle: application.positionTitle,
    stage: application.stage,
    tags: application.tags.map(({ tag }) => ({
      displayName: tag.displayName,
      id: tag.id,
    })),
    workArrangement: application.workArrangement,
  }));

  return (
    <AppShell navigation={appNavigation("kanban")} title="Kanban">
      <div className="mx-auto max-w-[1800px]">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Badge tone="violet">Pipeline board</Badge>
            <h2 className="text-foreground mt-4 text-3xl font-semibold tracking-[-0.04em]">
              Move work forward
            </h2>
            <p className="text-muted mt-2 max-w-2xl">
              Drag by the handle, use the keyboard, or choose a stage from each
              card. Every move is saved to your private workspace.
            </p>
          </div>
          <Link className={buttonVariants()} href="/applications/new">
            <Plus aria-hidden="true" size={17} /> Add application
          </Link>
        </div>
        <div className="mt-8">
          <KanbanBoard
            applications={boardApplications}
            moveStage={moveApplicationStageAction}
          />
        </div>
      </div>
    </AppShell>
  );
}
