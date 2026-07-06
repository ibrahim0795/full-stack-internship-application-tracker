import { OrbitPreview } from "@/components/marketing/orbit-preview";

export function StaticSpaceFallback() {
  return (
    <div
      className="absolute inset-0 overflow-hidden"
      data-scene-fallback="true"
      aria-hidden="true"
    >
      <div className="star-grid absolute inset-0 opacity-70" />
      <div className="absolute top-1/2 left-1/2 w-[min(42rem,92vw)] -translate-x-1/2 -translate-y-1/2 opacity-55">
        <OrbitPreview />
      </div>
      <div className="from-background/35 via-background/15 to-background absolute inset-0 bg-gradient-to-b" />
    </div>
  );
}
