import { useSidebar } from "@/components/ui/sidebar"
import { PanelLeft } from "lucide-react"

export function CustomTrigger() {
  const { toggleSidebar } = useSidebar();

  const handleClick = () => {
    toggleSidebar();
  }
 
  return (
    <div className="pointer-events-auto fixed left-2 top-2 z-50 flex flex-row gap-0.5 p-1">
      <button
        onClick={handleClick}
        className="fixed flex items-center justify-center z-10 h-8 w-8 hover:bg-secondary/50 rounded-md transition-hover"
      >
        <PanelLeft size="16px" className="text-pink-200/80" />
      </button>
    </div>
  );
}