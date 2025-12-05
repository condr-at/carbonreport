'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2 } from 'lucide-react';
import { useProjectDataset, useUpdateFullDataset } from '@/lib/data-client/dataset';
import type { Dataset } from '@/lib/dataset-validation';

interface ProductDataEntryProps {
  projectId: string;
}

interface BOMItem {
  id: string;
  name: string;
  weight: number;
  origin: string;
  materialType: string;
}

export function ProductDataEntry({ projectId }: ProductDataEntryProps) {
  const { data: projectDataset } = useProjectDataset(projectId);
  const updateDataset = useUpdateFullDataset(projectId);
  const dataset = projectDataset?.dataset;

  const bomItems = (dataset?.bom_items as BOMItem[]) || [];

  const handleAddBOMItem = () => {
    const newItem: BOMItem = {
      id: crypto.randomUUID(),
      name: 'New Material',
      weight: 0,
      origin: '',
      materialType: '',
    };
    const newDataset = {
      ...dataset,
      bom_items: [...bomItems, newItem],
    } as Dataset;
    updateDataset.mutate({ dataset: newDataset });
  };

  const handleUpdateBOMItem = (id: string, field: keyof BOMItem, value: string | number) => {
    const newItems = bomItems.map(item => item.id === id ? { ...item, [field]: value } : item);
    const newDataset = { ...dataset, bom_items: newItems } as Dataset;
    updateDataset.mutate({ dataset: newDataset });
  };

  const handleDeleteBOMItem = (id: string) => {
    const newItems = bomItems.filter(item => item.id !== id);
    const newDataset = { ...dataset, bom_items: newItems } as Dataset;
    updateDataset.mutate({ dataset: newDataset });
  };

  return (
    <Tabs defaultValue="bom" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="bom">Bill of Materials (BOM)</TabsTrigger>
        <TabsTrigger value="processes">Processes</TabsTrigger>
        <TabsTrigger value="logistics">Logistics</TabsTrigger>
        <TabsTrigger value="packaging">Packaging</TabsTrigger>
      </TabsList>
      
      <TabsContent value="bom">
        <Card>
          <CardHeader>
            <CardTitle>Bill of Materials</CardTitle>
            <CardDescription>Define the materials used in your product.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="p-3 text-left font-medium">Name</th>
                      <th className="p-3 text-left font-medium">Weight (kg)</th>
                      <th className="p-3 text-left font-medium">Origin</th>
                      <th className="p-3 text-left font-medium">Material Type</th>
                      <th className="p-3 text-right font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bomItems.map((item) => (
                      <tr key={item.id} className="border-b last:border-0">
                        <td className="p-3">
                          <Input 
                            value={item.name} 
                            onChange={(e) => handleUpdateBOMItem(item.id, 'name', e.target.value)}
                          />
                        </td>
                        <td className="p-3">
                          <Input 
                            type="number"
                            value={item.weight} 
                            onChange={(e) => handleUpdateBOMItem(item.id, 'weight', parseFloat(e.target.value))}
                          />
                        </td>
                        <td className="p-3">
                          <Input 
                            value={item.origin} 
                            onChange={(e) => handleUpdateBOMItem(item.id, 'origin', e.target.value)}
                          />
                        </td>
                        <td className="p-3">
                          <Input 
                            value={item.materialType} 
                            onChange={(e) => handleUpdateBOMItem(item.id, 'materialType', e.target.value)}
                          />
                        </td>
                        <td className="p-3 text-right">
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteBOMItem(item.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {bomItems.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-4 text-center text-muted-foreground">
                          No materials added yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <Button onClick={handleAddBOMItem}>
                <Plus className="mr-2 h-4 w-4" /> Add Material
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="processes">
        <Card>
          <CardHeader>
            <CardTitle>Production Processes</CardTitle>
            <CardDescription>Coming Soon</CardDescription>
          </CardHeader>
          <CardContent>
             <p className="text-muted-foreground">Process editor will be implemented here.</p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="logistics">
        <Card>
          <CardHeader>
            <CardTitle>Logistics</CardTitle>
            <CardDescription>Coming Soon</CardDescription>
          </CardHeader>
          <CardContent>
             <p className="text-muted-foreground">Logistics editor will be implemented here.</p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="packaging">
        <Card>
          <CardHeader>
            <CardTitle>Packaging</CardTitle>
            <CardDescription>Coming Soon</CardDescription>
          </CardHeader>
          <CardContent>
             <p className="text-muted-foreground">Packaging editor will be implemented here.</p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
