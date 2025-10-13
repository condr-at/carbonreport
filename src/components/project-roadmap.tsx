'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Circle } from 'lucide-react';

interface RoadmapItem {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dataPointIds?: string[];
}

interface ProjectRoadmapProps {
  items: RoadmapItem[];
  incompleteCount: number;
}

export function ProjectRoadmap({ items, incompleteCount }: ProjectRoadmapProps) {
  const [hideCompleted, setHideCompleted] = useState(false);

  const displayedItems = hideCompleted 
    ? items.filter(item => !item.completed) 
    : items;

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Project Roadmap</CardTitle>
            <CardDescription>
              {incompleteCount > 0
                ? `${incompleteCount} tasks remaining`
                : 'All tasks complete!'}
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setHideCompleted(!hideCompleted)}
            className="text-xs"
          >
            {hideCompleted ? 'Show completed' : 'Hide completed'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto max-h-[546px]">
        {displayedItems.length > 0 ? (
          <div className="space-y-3">
            {displayedItems.map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                {item.completed ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                )}
                <div className="flex-1 space-y-1 pt-[2px]">
                  <p
                    className={`text-sm ${
                      item.completed ? 'line-through text-muted-foreground' : ''
                    }`}
                  >
                    {item.title}
                  </p>
                  {item.description && (
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            {hideCompleted ? 'All tasks completed!' : 'No roadmap items yet'}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
