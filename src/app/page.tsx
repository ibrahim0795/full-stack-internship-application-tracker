import { MarketingShell } from "@/components/layout/marketing-shell";
import { CareerJourney } from "@/components/three/career-journey";

export default function Home() {
  return (
    <MarketingShell>
      <main id="main-content" tabIndex={-1}>
        <CareerJourney />
      </main>
    </MarketingShell>
  );
}
