import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle } from 'lucide-react';
import Link from 'next/link';

interface Project {
  id: string;
  name: string;
  checklist: any; // JSONB with roadmap items
}

interface NextStepsWidgetProps {
  projects: Project[];
}

interface RoadmapItem {
  id: string;
  title: string;
  completed: boolean;
  projectId: string;
  projectName: string;
}

export function NextStepsWidget({ projects }: NextStepsWidgetProps) {
  // Extract all incomplete roadmap items from all projects
  const nextSteps: RoadmapItem[] = [];
  
  projects.forEach((project) => {
    if (project.checklist && Array.isArray(project.checklist.items)) {
      const incompleteItems = project.checklist.items
        .filter((item: any) => !item.completed)
        .map((item: any) => ({
          id: item.id,
          title: item.title,
          completed: item.completed,
          projectId: project.id,
          projectName: project.name,
        }));
      
      nextSteps.push(...incompleteItems);
    }
  });

  // Limit to first 10 items
  const displayItems = nextSteps.slice(0, 10);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Next Steps</CardTitle>
        <CardDescription>
          {nextSteps.length === 0
            ? 'All tasks completed! 🎉'
            : `${nextSteps.length} action${nextSteps.length === 1 ? '' : 's'} across your projects`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {displayItems.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <CheckCircle2 className="h-12 w-12 mx-auto mb-3 text-success" />
            <p className="text-sm">No pending tasks found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {displayItems.map((item) => (
              <Link
                key={`${item.projectId}-${item.id}`}
                href={`/projects/${item.projectId}`}
                className="block group"
              >
                <div className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent transition-colors">
                  <Circle className="h-4 w-4 mt-0.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-none mb-1 group-hover:text-foreground transition-colors">
                      {item.title}
                    </p>
                    <Badge variant="outline" className="text-xs mt-1">
                      {item.projectName}
                    </Badge>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
