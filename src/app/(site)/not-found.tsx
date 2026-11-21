import { Button } from "@/components/ui/button";
import { DentalIcon } from "@/components/ui/icons";
import { Aurora } from "@/components/fx/aurora";

export default function NotFound() {
  return (
    <section className="relative isolate flex min-h-[90vh] items-center overflow-hidden bg-brand-950 pt-28 text-white">
      <Aurora className="-z-10" />
      <div className="container-page text-center">
        <span className="glass mx-auto grid size-20 place-items-center rounded-3xl text-gold-200">
          <DentalIcon name="extraction" className="size-10" />
        </span>
        <h1 className="font-display mt-8 text-5xl font-medium sm:text-6xl">
          This page has been <em className="text-gold italic">taken out</em>
        </h1>
        <p className="mx-auto mt-5 max-w-md text-lg text-white/70">The link may be old or mistyped. Everything else is where it should be.</p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Button href="/" variant="gold">
            Go to the home page
          </Button>
          <Button href="/book" variant="glass">
            Book a visit
          </Button>
        </div>
      </div>
    </section>
  );
}
