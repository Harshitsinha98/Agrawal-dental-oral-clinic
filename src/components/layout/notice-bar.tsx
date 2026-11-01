import { Megaphone } from "lucide-react";

export function NoticeBar({ text }: { text?: string | null }) {
  if (!text) return null;
  return (
    <div className="bg-brand-700 text-white">
      <p className="container-page flex items-center justify-center gap-2 py-2 text-center text-sm font-medium">
        <Megaphone className="size-4 shrink-0 text-mint-300" aria-hidden />
        {text}
      </p>
    </div>
  );
}
