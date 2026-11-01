import { BadgeCheck, GraduationCap } from "lucide-react";
import type { Doctor } from "@/lib/types";
import { SanityImage } from "@/components/ui/sanity-image";
import { RichText } from "@/components/ui/rich-text";
import { Reveal } from "@/components/ui/motion";
import { cn } from "@/lib/utils";

export function DoctorProfile({ doctor, index = 0 }: { doctor: Doctor; index?: number }) {
  const flip = index % 2 === 1;
  return (
    <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
      <Reveal className={cn("relative mx-auto w-full max-w-md", flip && "lg:order-2")}>
        <div className="absolute -inset-3 -z-10 rounded-[2.75rem] border border-dashed border-brand-200" aria-hidden />
        <div className="relative aspect-[4/5] overflow-hidden rounded-[2.25rem] bg-white shadow-lift">
          <SanityImage image={doctor.photo} alt={doctor.name} aspect={4 / 5} sizes="(min-width: 1024px) 420px, 90vw" placeholderIcon="checkup" />
        </div>
        {doctor.experienceYears ? (
          <div className="absolute -bottom-5 left-6 rounded-2xl bg-white px-5 py-3 shadow-lift">
            <p className="text-3xl font-extrabold text-brand-700">
              {doctor.experienceYears}
              <span className="text-mint-500">+</span>
            </p>
            <p className="text-xs font-semibold text-ink-mute">years of practice</p>
          </div>
        ) : null}
      </Reveal>

      <Reveal delay={0.1}>
        {doctor.role && <p className="eyebrow mb-3">{doctor.role}</p>}
        <h3 className="text-3xl font-bold text-ink sm:text-4xl">{doctor.name}</h3>
        {doctor.qualifications && (
          <p className="mt-3 flex items-center gap-2 font-semibold text-ink-soft">
            <GraduationCap className="size-5 text-brand-500" />
            {doctor.qualifications}
          </p>
        )}
        <RichText value={doctor.bio} className="mt-6" />
        {!!doctor.highlights?.length && (
          <ul className="mt-7 grid gap-3 sm:grid-cols-2">
            {doctor.highlights.map((h) => (
              <li key={h} className="flex gap-2.5 rounded-2xl border border-line bg-white p-4 text-[0.9375rem] font-medium text-ink">
                <BadgeCheck className="size-5 shrink-0 text-mint-500" />
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
