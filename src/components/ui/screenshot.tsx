import { cn } from "@/lib/utils";

interface ScreenshotProps {
  srcLight: string;
  srcDark: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}

export default function Screenshot({
  alt,
  height,
  className,
}: ScreenshotProps) {
  return (
    <div className={cn("relative overflow-hidden rounded-xl border bg-muted flex items-center justify-center text-muted-foreground", className)} style={{ height: height ? `${height}px` : 'auto', minHeight: '300px' }}>
      <div className="text-center p-4">
        <p className="font-medium">App Screenshot Placeholder</p>
        <p className="text-sm">{alt}</p>
      </div>
    </div>
  );
}
