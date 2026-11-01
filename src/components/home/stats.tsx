import { CountUp, Stagger, StaggerItem } from "@/components/ui/motion";

type Stat = { key: string; value: number; decimals?: number; suffix?: string | null; label: string };

export function Stats({ items }: { items: Stat[] }) {
  if (!items.length) return null;
  return (
    <section className="py-12 sm:py-16">
      <Stagger className="container-page grid gap-px overflow-hidden rounded-[2rem] bg-line sm:grid-flow-col sm:auto-cols-fr">
        {items.map((s) => (
          <StaggerItem key={s.key} className="bg-canvas px-6 py-7 text-center sm:py-9">
            <p className="text-4xl font-extrabold tracking-tight text-brand-700 sm:text-5xl">
              <CountUp value={s.value} decimals={s.decimals} />
              {s.suffix && <span className="text-mint-500">{s.suffix}</span>}
            </p>
            <p className="mt-2 text-sm font-medium text-ink-soft">{s.label}</p>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
