import { useSidebar } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils";

export function Border() {
  const { open } = useSidebar();

  return (
    <>
      <div className={cn(open ? "translate-y-3.5 rounded-tl-xl border-l border-t" : "translate-y-0 rounded-none border-none", "absolute bottom-0 top-0 w-full overflow-hidden border-chat-border bg-chat-background bg-fixed pb-[140px] transition-all ease-snappy")}>
        <div className="bg-noise absolute inset-0 -top-3.5 bg-fixed transition-transform ease-snappy [background-position:right_bottom]"></div>
      </div>
      <div className={cn(open ? "border-b" : "border-none -translate-y-[15px]", "absolute inset-x-3 top-0 z-10 box-content h-3.5 overflow-hidden border-chat-border bg-gradient-noise-top backdrop-blur-md transition-[transform,border] ease-snappy")}>
        <div className="absolute left-0 top-0 h-full w-8 bg-gradient-to-r from-gradient-noise-top to-transparent"></div>
        <div className="absolute right-24 top-0 h-full w-8 bg-gradient-to-l from-gradient-noise-top to-transparent"></div>
        <div className="absolute right-0 top-0 h-full w-24 bg-gradient-noise-top"></div>
      </div>
    </>
  )
}