import { Button } from "@/components/ui/button";
import { DentalIcon } from "@/components/ui/icons";

export default function NotFound() {
  return (
    <section className="flex min-h-[80vh] items-center pt-28">
      <div className="container-page text-center">
        <span className="mx-auto grid size-20 place-items-center rounded-3xl bg-brand-50 text-brand-500">
          <DentalIcon name="extraction" className="size-10" />
        </span>
        <h1 className="mt-8 text-4xl font-extrabold text-ink sm:text-5xl">This page has been taken out</h1>
        <p className="mx-auto mt-4 max-w-md text-lg text-ink-soft">The link may be old or mistyped. Everything else is where it should be.</p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Button href="/">Go to the home page</Button>
          <Button href="/book" variant="outline">
            Book a visit
          </Button>
        </div>
      </div>
    </section>
  );
}
