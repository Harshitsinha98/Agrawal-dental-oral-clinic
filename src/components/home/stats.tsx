import { CountUp, Stagger, StaggerItem } from "@/components/ui/motion";

type Stat = { key: string; value: number; decimals?: number; suffix?: string | null; label: string };

export function Stats({ items }: { items: Stat[] }) {
  if (!items.length) return null;
  return (
    <section className="py-10 sm:py-14">
      <Stagger className="container-page grid grid-cols-2 gap-px overflow-hidden rounded-[2rem] border border-line bg-line shadow-soft lg:grid-flow-col lg:auto-cols-fr lg:grid-cols-none">
        {items.map((s) => (
          <StaggerItem key={s.key} className="group relative bg-pearl px-6 py-8 text-center sm:py-10">
            <span aria-hidden className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-gold-300 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <p className="font-display text-5xl text-ink sm:text-6xl">
              <CountUp value={s.value} decimals={s.decimals} />
              {s.suffix && <span className="text-gold-500">{s.suffix}</span>}
            </p>
            <p className="mt-3 text-sm font-medium text-ink-soft">{s.label}</p>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
