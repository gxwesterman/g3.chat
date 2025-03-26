import { useSidebar } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/ModeToggle";

export function Border() {
  const { open } = useSidebar();

  return (
    <>
      <div className={cn(open ? "translate-y-3.5 rounded-tl-xl border-l border-t" : "translate-y-0 rounded-none border-none", "absolute bottom-0 top-0 w-full overflow-hidden border-border bg-background bg-fixed pb-[140px] transition-all ease-snappy")}>
        <div className="bg-noise absolute inset-0 -top-3.5 bg-fixed transition-transform ease-snappy [background-position:right_bottom]"></div>
      </div>
      <div className={cn(open ? "border-b" : "border-none -translate-y-[15px]", "absolute inset-x-3 top-0 z-10 box-content h-3.5 overflow-hidden border-border gradient-noise-top backdrop-blur-md transition-[transform,border] ease-snappy")}>
        <div className="absolute left-0 top-0 h-full w-8 bg-gradient-to-r from-gradient-noise-top to-transparent"></div>
        <div className="absolute right-24 top-0 h-full w-8 bg-gradient-to-l from-gradient-noise-top to-transparent"></div>
        <div className="absolute right-0 top-0 h-full w-24 gradient-noise-top"></div>
      </div>
      <div className="fixed right-0 top-0 z-20 h-16 w-28 max-sm:hidden">
        <div className={cn(!open && "-translate-y-3.5 scale-y-0", "group pointer-events-none absolute top-3.5 z-10 -mb-8 h-32 w-full origin-top transition-all ease-snappy")} style={{boxShadow: "10px -10px 8px 2px hsl(var(--gradient-noise-top))"}}>
          <svg className="absolute -right-8 h-9 origin-top-left skew-x-[30deg] overflow-visible" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 128 32" xmlSpace="preserve">
            <line stroke="hsl(var(--gradient-noise-top))" strokeWidth="2px" shapeRendering="optimizeQuality" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeMiterlimit="10" x1="1" y1="0" x2="128" y2="0"></line>
            <path className="translate-y-[0.5px]" fill="hsl(var(--gradient-noise-top))" shapeRendering="optimizeQuality" strokeWidth="1px" strokeLinecap="round" strokeMiterlimit="10" vectorEffect="non-scaling-stroke" d="M0,0c5.9,0,10.7,4.8,10.7,10.7v10.7c0,5.9,4.8,10.7,10.7,10.7H128V0" stroke="hsl(var(--chat-border))"></path>
          </svg>
        </div>
      </div>
      <ModeToggle />
    </>
  )
}