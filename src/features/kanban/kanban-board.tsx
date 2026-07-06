"use client";

import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { ApplicationStage, WorkArrangement } from "@prisma/client";
import { CalendarDays, GripVertical, Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input, Select } from "@/components/ui/form-field";
import {
  applicationStageLabels,
  workArrangementLabels,
} from "@/features/applications/application-schema";
import { cn } from "@/lib/utils/cn";

export interface BoardApplication {
  closingDate: string | null;
  companyName: string;
  id: string;
  positionTitle: string;
  stage: ApplicationStage;
  tags: { displayName: string; id: string }[];
  workArrangement: WorkArrangement;
}

interface StageMutationResult {
  message?: string;
  success: boolean;
}

interface KanbanBoardProps {
  applications: BoardApplication[];
  moveStage: (
    applicationId: string,
    stage: string,
  ) => Promise<StageMutationResult>;
}

const stages = Object.values(ApplicationStage);

export function KanbanBoard({
  applications: initialApplications,
  moveStage,
}: KanbanBoardProps) {
  const [applications, setApplications] = useState(initialApplications);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const [error, setError] = useState("");
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [workArrangement, setWorkArrangement] = useState<WorkArrangement | "">(
    "",
  );
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor),
  );

  const filteredApplications = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return applications.filter((application) => {
      const matchesQuery =
        !normalizedQuery ||
        application.companyName.toLowerCase().includes(normalizedQuery) ||
        application.positionTitle.toLowerCase().includes(normalizedQuery);
      return (
        matchesQuery &&
        (!workArrangement || application.workArrangement === workArrangement)
      );
    });
  }, [applications, query, workArrangement]);

  async function move(applicationId: string, nextStage: ApplicationStage) {
    if (pendingId) return;
    const application = applications.find((item) => item.id === applicationId);
    if (!application || application.stage === nextStage) return;

    const previousApplications = applications;
    setApplications((current) =>
      current.map((item) =>
        item.id === applicationId ? { ...item, stage: nextStage } : item,
      ),
    );
    setPendingId(applicationId);
    setError("");
    setAnnouncement(
      `Moving ${application.positionTitle} to ${applicationStageLabels[nextStage]}.`,
    );

    let result: StageMutationResult;
    try {
      result = await moveStage(applicationId, nextStage);
    } catch {
      result = {
        message:
          "The stage change could not be saved. Your board was restored.",
        success: false,
      };
    }
    if (!result.success) {
      setApplications(previousApplications);
      setError(result.message ?? "The stage change could not be saved.");
      setAnnouncement(
        `${application.positionTitle} was returned to ${applicationStageLabels[application.stage]}.`,
      );
    } else {
      setAnnouncement(
        `${application.positionTitle} moved to ${applicationStageLabels[nextStage]}.`,
      );
    }
    setPendingId(null);
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id));
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);
    const targetStage = event.over?.id;
    if (targetStage && stages.includes(targetStage as ApplicationStage)) {
      void move(String(event.active.id), targetStage as ApplicationStage);
    }
  }

  const activeApplication = applications.find(({ id }) => id === activeId);

  return (
    <div>
      <div className="border-border bg-surface/55 grid gap-3 rounded-3xl border p-4 sm:grid-cols-[1fr_15rem]">
        <label className="relative">
          <span className="sr-only">Search Kanban applications</span>
          <Search
            className="text-muted absolute top-3 left-4"
            aria-hidden="true"
            size={18}
          />
          <Input
            className="pl-11"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search company or role"
            value={query}
          />
        </label>
        <Select
          aria-label="Filter board by work arrangement"
          onChange={(event) =>
            setWorkArrangement(event.target.value as WorkArrangement | "")
          }
          value={workArrangement}
        >
          <option value="">All arrangements</option>
          {Object.values(WorkArrangement).map((value) => (
            <option key={value} value={value}>
              {workArrangementLabels[value]}
            </option>
          ))}
        </Select>
      </div>

      {error ? (
        <p
          className="border-danger/30 bg-danger/10 text-danger mt-4 rounded-2xl border px-4 py-3 text-sm"
          role="alert"
        >
          {error}
        </p>
      ) : null}
      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>

      <DndContext
        collisionDetection={closestCenter}
        onDragCancel={() => setActiveId(null)}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
        sensors={sensors}
      >
        <div
          className="mt-6 flex snap-x gap-4 overflow-x-auto pb-5"
          aria-label="Application Kanban board"
        >
          {stages.map((stage) => {
            const stageApplications = filteredApplications.filter(
              (application) => application.stage === stage,
            );
            return (
              <KanbanColumn
                applications={stageApplications}
                key={stage}
                move={move}
                pendingId={pendingId}
                stage={stage}
              />
            );
          })}
        </div>
        <DragOverlay>
          {activeApplication ? (
            <ApplicationCardPreview application={activeApplication} />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

function KanbanColumn({
  applications,
  move,
  pendingId,
  stage,
}: {
  applications: BoardApplication[];
  move: (applicationId: string, stage: ApplicationStage) => Promise<void>;
  pendingId: string | null;
  stage: ApplicationStage;
}) {
  const { isOver, setNodeRef } = useDroppable({ id: stage });
  return (
    <section
      className={cn(
        "border-border bg-surface/45 min-h-[28rem] w-[19rem] shrink-0 snap-start rounded-3xl border p-3 transition-colors",
        isOver && "border-primary/60 bg-primary/5",
      )}
      ref={setNodeRef}
    >
      <header className="flex items-center justify-between px-2 py-2">
        <h2 className="text-foreground font-semibold">
          {applicationStageLabels[stage]}
        </h2>
        <Badge tone="neutral">{applications.length}</Badge>
      </header>
      <div className="mt-2 grid gap-3">
        {applications.length ? (
          applications.map((application) => (
            <ApplicationCard
              application={application}
              key={application.id}
              move={move}
              pending={pendingId === application.id}
            />
          ))
        ) : (
          <div className="border-border text-muted grid min-h-28 place-items-center rounded-2xl border border-dashed px-4 text-center text-sm">
            Drop an application here
          </div>
        )}
      </div>
    </section>
  );
}

function ApplicationCard({
  application,
  move,
  pending,
}: {
  application: BoardApplication;
  move: (applicationId: string, stage: ApplicationStage) => Promise<void>;
  pending: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    disabled: pending,
    id: application.id,
  });
  const style = transform
    ? { transform: CSS.Translate.toString(transform) }
    : undefined;

  return (
    <div ref={setNodeRef} style={style}>
      <Card
        className={cn(
          "bg-surface-raised rounded-2xl shadow-none",
          pending && "opacity-60",
        )}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <Link
              className="focus-visible:outline-focus min-w-0 rounded-lg focus-visible:outline-2"
              href={`/applications/${application.id}`}
            >
              <h3 className="text-foreground truncate font-semibold">
                {application.positionTitle}
              </h3>
              <p className="text-muted mt-1 truncate text-sm">
                {application.companyName}
              </p>
            </Link>
            <button
              {...attributes}
              {...listeners}
              aria-label={`Drag ${application.positionTitle}`}
              className="text-muted hover:bg-surface hover:text-foreground focus-visible:outline-focus grid size-9 shrink-0 cursor-grab place-items-center rounded-full focus-visible:outline-2 active:cursor-grabbing"
              type="button"
            >
              <GripVertical aria-hidden="true" size={17} />
            </button>
          </div>
          {application.closingDate ? (
            <p className="text-muted mt-3 flex items-center gap-2 text-xs">
              <CalendarDays aria-hidden="true" size={14} />
              Closes {new Date(application.closingDate).toLocaleDateString()}
            </p>
          ) : null}
          {application.tags.length ? (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {application.tags.slice(0, 3).map((tag) => (
                <span
                  className="bg-accent/10 text-accent-strong rounded-full px-2 py-1 text-[0.68rem]"
                  key={tag.id}
                >
                  {tag.displayName}
                </span>
              ))}
            </div>
          ) : null}
          <label className="mt-4 block">
            <span className="text-muted text-xs font-semibold">
              Move to stage
            </span>
            <Select
              className="mt-1 min-h-9 rounded-xl px-3 text-xs"
              disabled={pending}
              onChange={(event) =>
                void move(
                  application.id,
                  event.target.value as ApplicationStage,
                )
              }
              value={application.stage}
            >
              {stages.map((stage) => (
                <option key={stage} value={stage}>
                  {applicationStageLabels[stage]}
                </option>
              ))}
            </Select>
          </label>
        </CardContent>
      </Card>
    </div>
  );
}

function ApplicationCardPreview({
  application,
}: {
  application: BoardApplication;
}) {
  return (
    <Card className="border-primary/50 bg-surface-raised w-[19rem] rotate-2 rounded-2xl shadow-2xl">
      <CardContent className="p-4">
        <h3 className="text-foreground truncate font-semibold">
          {application.positionTitle}
        </h3>
        <p className="text-muted mt-1 truncate text-sm">
          {application.companyName}
        </p>
      </CardContent>
    </Card>
  );
}
