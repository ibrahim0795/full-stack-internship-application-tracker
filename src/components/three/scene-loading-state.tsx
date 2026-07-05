export function SceneLoadingState() {
  return (
    <div className="absolute inset-0 grid place-items-center" role="status">
      <div className="text-center">
        <span className="border-primary/35 bg-primary/10 mx-auto block size-12 rounded-full border shadow-[0_0_45px_var(--primary-shadow)]" />
        <p className="text-primary-strong mt-4 text-xs font-semibold tracking-[0.18em] uppercase">
          Calibrating orbit
        </p>
      </div>
    </div>
  );
}
