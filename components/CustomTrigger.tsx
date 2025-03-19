import { useSidebar } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils";
import { PanelLeft } from "lucide-react"

export function CustomTrigger() {
  const { toggleSidebar, open } = useSidebar();

  const handleClick = () => {
    toggleSidebar();
  }
 
  return (
    <button
      onClick={handleClick}
      className={cn(!open && "rotate-180", "fixed flex items-center justify-center z-10 h-9 w-9 mt-3 ml-1 hover:bg-secondary/20 rounded-md transition-hover")}
    >
      <PanelLeft size="16px"/>
    </button>
  );
}