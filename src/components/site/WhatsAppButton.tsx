import { whatsappUrl } from "@/data/site";
import { cn } from "@/lib/utils";

export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <img
      src="/whatsapp-logo.png"
      alt="WhatsApp"
      className={cn("size-7 shrink-0 object-contain select-none pointer-events-none", className)}
      width={32}
      height={32}
      loading="eager"
      decoding="async"
    />
  );
}

export function WhatsAppButton() {
  return (
    <a
      href={whatsappUrl()}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="group fixed bottom-[calc(env(safe-area-inset-bottom)+5.25rem)] right-4 z-40 flex items-center gap-3 rounded-full bg-whatsapp p-3.5 text-white shadow-float transition-transform hover:scale-105 active:scale-95 lg:bottom-6 lg:right-6 lg:p-4"
    >
      <span className="absolute inset-0 rounded-full bg-whatsapp animate-pulse-soft" aria-hidden />
      <WhatsAppIcon className="relative size-9 shrink-0 lg:size-10" />
      <span className="relative hidden max-w-0 overflow-hidden whitespace-nowrap text-[15px] font-semibold text-white transition-all duration-500 group-hover:max-w-[14rem] group-hover:pr-2 lg:inline-block">
        Chat with a travel expert
      </span>
    </a>
  );
}
