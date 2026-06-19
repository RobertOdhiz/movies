import { cn } from "@/lib/utils";

/** Shared positioning for nav-attached dropdown panels (mobile-friendly). */
export function navDropdownPanelClass(widthClass = "sm:w-80") {
  return cn(
    "z-[60] overflow-hidden rounded-2xl border border-white/10 bg-[#141414]/95 shadow-2xl backdrop-blur-xl",
    "fixed left-3 right-3 top-[calc(4.25rem+env(safe-area-inset-top,0px))] max-h-[min(75dvh,calc(100dvh-5.5rem))] overflow-y-auto",
    "sm:absolute sm:left-auto sm:right-0 sm:top-full sm:mt-2 sm:max-h-[min(80vh,640px)]",
    widthClass
  );
}
