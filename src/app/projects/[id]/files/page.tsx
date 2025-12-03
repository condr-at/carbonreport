import { Card, CardContent } from '@/components/ui/card';
import { Folder } from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function FilesPage({ params }: PageProps) {
  void (await params);

  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <Folder className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold">Project Files</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Coming soon - Document uploads and attachments
        </p>
      </CardContent>
    </Card>
  );
}
