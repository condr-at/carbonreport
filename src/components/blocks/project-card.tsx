import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, ExternalLink, Copy, Archive, Clock, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Report {
  id: string;
  templateCode: string;
  completion: number;
}

interface Project {
  id: string;
  name: string;
  status: string;
  reportsCount: number;
  reports?: Report[];
  createdAt: string;
}

interface ProjectCardProps {
  project: Project;
  onDuplicate?: (projectId: string) => void;
  onArchive?: (projectId: string) => void;
}

export function ProjectCard({ project, onDuplicate, onArchive }: ProjectCardProps) {
  // Calculate overall completion (average of all reports)
  const completion = project.reports && project.reports.length > 0
    ? Math.round(project.reports.reduce((sum, r) => sum + r.completion, 0) / project.reports.length)
    : 0;

  const statusColor = project.status === 'ACTIVE' ? 'default' : 'secondary';
  const statusIcon = completion === 100 ? CheckCircle2 : Clock;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <Card className="group hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg truncate">{project.name}</CardTitle>
            <CardDescription className="mt-1">
              Created {formatDate(project.createdAt)}
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="ml-2">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/projects/${project.id}`} className="cursor-pointer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open Project
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDuplicate?.(project.id)}
              >
                <Copy className="mr-2 h-4 w-4" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onArchive?.(project.id)}
                className="text-destructive"
              >
                <Archive className="mr-2 h-4 w-4" />
                Archive
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant={statusColor}>{project.status}</Badge>
          <Badge variant="outline">
            {project.reportsCount} {project.reportsCount === 1 ? 'Report' : 'Reports'}
          </Badge>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Completion</span>
            <span className="font-medium">{completion}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${completion}%` }}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full" variant="outline">
          <Link href={`/projects/${project.id}`}>
            View Details
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
