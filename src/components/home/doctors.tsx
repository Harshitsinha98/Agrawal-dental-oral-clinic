import Link from "next/link";
import { ArrowRight, BadgeCheck, GraduationCap } from "lucide-react";
import type { Doctor } from "@/lib/types";
import { SanityImage } from "@/components/ui/sanity-image";
import { RichText } from "@/components/ui/rich-text";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";
import { TiltCard } from "@/components/fx/tilt-card";
import { cn } from "@/lib/utils";

export const doctorId = (d: Doctor) => d.name.toLowerCase().replace(/^dr\.?\s*/, "").replace(/[^a-z]+/g, "-").replace(/(^-|-$)/g, "");

/** Home page: the doctors side by side as tilting portrait cards. */
export function DoctorCards({ doctors }: { doctors: Doctor[] }) {
  return (
    <Stagger className={cn("grid gap-8", doctors.length > 1 && "md:grid-cols-2 lg:gap-10")} gap={0.12}>
      {doctors.map((d) => (
        <StaggerItem key={d._id ?? d.name}>
          <TiltCard className="h-full rounded-[2.25rem]">
            <article className="flex h-full flex-col overflow-hidden rounded-[2.25rem] border border-line bg-white shadow-lift">
              <div className="relative aspect-[4/5] overflow-hidden bg-brand-900 sm:aspect-[5/5]">
                <SanityImage image={d.photo} alt={d.name} sizes="(min-width: 768px) 560px, 100vw" placeholderIcon="checkup" position="50% 22%" className="transition-transform duration-1000 ease-out-soft group-hover/tilt:scale-[1.04]" />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-950/30 to-transparent" />
                {d.experienceYears ? (
                  <span className="absolute right-5 top-5 rounded-full bg-brand-950/75 px-3.5 py-1.5 text-xs font-semibold text-white ring-1 ring-gold-300/40 backdrop-blur">
                    <span className="font-display text-base text-gold-200">{d.experienceYears}+</span> years
                  </span>
                ) : null}
                <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
                  {d.role && <p className="eyebrow text-gold-300">{d.role}</p>}
                  <h3 className="font-display mt-2 text-3xl font-medium sm:text-4xl">{d.name}</h3>
                  {d.qualifications && (
                    <p className="mt-3 flex items-start gap-2 text-sm font-medium text-white/80">
                      <GraduationCap className="mt-0.5 size-4 shrink-0 text-gold-300" />
                      {d.qualifications}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-1 flex-col p-6 sm:p-8">
                {!!d.highlights?.length && (
                  <ul className="space-y-3">
                    {d.highlights.slice(0, 3).map((h) => (
                      <li key={h} className="flex gap-3 text-[0.9375rem] leading-snug text-ink-soft">
                        <BadgeCheck className="size-5 shrink-0 text-gold-500" />
                        {h}
                      </li>
                    ))}
                  </ul>
                )}
                <Link href={`/about#${doctorId(d)}`} className="group mt-auto inline-flex items-center gap-2 pt-7 font-semibold text-brand-800 hover:text-gold-700">
                  Read full profile
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </article>
          </TiltCard>
        </StaggerItem>
      ))}
    </Stagger>
  );
}

/** About page: one doctor per row, photo and full biography. */
export function DoctorProfile({ doctor, index = 0 }: { doctor: Doctor; index?: number }) {
  const flip = index % 2 === 1;
  return (
    <div id={doctorId(doctor)} className="grid scroll-mt-28 items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
      <Reveal className={cn("relative mx-auto w-full max-w-md", flip && "lg:order-2")}>
        <div className="absolute -inset-3 -z-10 rounded-t-[999px] rounded-b-[2.75rem] border border-gold-300/60" aria-hidden />
        <div className="relative aspect-[4/5] overflow-hidden rounded-t-[999px] rounded-b-[2.25rem] bg-white shadow-lift">
          <SanityImage image={doctor.photo} alt={doctor.name} aspect={4 / 5} sizes="(min-width: 1024px) 420px, 90vw" placeholderIcon="checkup" position="50% 22%" />
        </div>
        {doctor.experienceYears ? (
          <div className="absolute -bottom-5 left-6 rounded-2xl bg-brand-950 px-5 py-3 text-white shadow-lift ring-1 ring-gold-300/40">
            <p className="font-display text-3xl text-gold">{doctor.experienceYears}+</p>
            <p className="text-xs font-semibold text-white/70">years of practice</p>
          </div>
        ) : null}
      </Reveal>

      <Reveal delay={0.1}>
        {doctor.role && <p className="eyebrow mb-3">{doctor.role}</p>}
        <h3 className="font-display text-4xl font-medium text-ink sm:text-5xl">{doctor.name}</h3>
        {doctor.qualifications && (
          <p className="mt-4 flex items-start gap-2 font-semibold text-ink-soft">
            <GraduationCap className="mt-0.5 size-5 shrink-0 text-gold-500" />
            {doctor.qualifications}
          </p>
        )}
        <RichText value={doctor.bio} className="mt-6" />
        {!!doctor.highlights?.length && (
          <ul className="mt-7 grid gap-3 sm:grid-cols-2">
            {doctor.highlights.map((h) => (
              <li key={h} className="flex gap-2.5 rounded-2xl border border-line bg-white p-4 text-[0.9375rem] font-medium text-ink">
                <BadgeCheck className="size-5 shrink-0 text-gold-500" />
                {h}
              </li>
            ))}
          </ul>
        )}
        {doctor.registration && <p className="mt-6 text-sm text-ink-mute">Dental council registration: {doctor.registration}</p>}
      </Reveal>
    </div>
  );
}
