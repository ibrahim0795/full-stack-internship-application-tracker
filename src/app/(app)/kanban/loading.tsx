export default function KanbanLoading() {
  return (
    <div
      className="flex animate-pulse gap-4 overflow-hidden"
      aria-label="Loading Kanban board"
    >
      {Array.from({ length: 4 }, (_, index) => (
        <div
          className="bg-surface h-[32rem] w-[19rem] shrink-0 rounded-3xl"
          key={index}
        />
      ))}
    </div>
  );
}
