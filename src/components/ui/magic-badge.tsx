import { cn } from "@/lib/utils";

interface MagicBadgeProps {
  title: string;
  className?: string;
}

const MagicBadge = ({ title, className }: MagicBadgeProps) => {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary backdrop-blur-sm",
        className
      )}
    >
      {title}
    </span>
  );
};

export default MagicBadge;
