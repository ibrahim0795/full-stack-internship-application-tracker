export default function CalendarLoading() {
  return (
    <div
      className="mx-auto max-w-7xl animate-pulse space-y-6"
      aria-label="Loading calendar"
    >
      <div className="bg-surface h-24 rounded-3xl" />
      <div className="grid gap-5 xl:grid-cols-[1fr_21rem]">
        <div className="bg-surface h-[42rem] rounded-3xl" />
        <div className="bg-surface h-96 rounded-3xl" />
      </div>
    </div>
  );
}
