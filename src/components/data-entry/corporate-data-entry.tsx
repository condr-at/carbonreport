'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';
import { useProjectDataset, useUpdateFullDataset } from '@/lib/data-client/dataset';
import type { Dataset } from '@/lib/dataset-validation';

interface CorporateDataEntryProps {
  projectId: string;
}

interface Facility {
  id: string;
  name: string;
  address: string;
  country: string;
}

interface EnergyEntry {
  id: string;
  facilityId: string;
  source: string;
  amount: number;
  unit: string;
}

export function CorporateDataEntry({ projectId }: CorporateDataEntryProps) {
  const { data: projectDataset } = useProjectDataset(projectId);
  const updateDataset = useUpdateFullDataset(projectId);
  const dataset = projectDataset?.dataset;

  const facilities = (dataset?.facilities as Facility[]) || [];
  const energyEntries = ((dataset as any)?.energy_entries as EnergyEntry[]) || [];

  const handleAddFacility = () => {
    const newFacility: Facility = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2) + Date.now().toString(36),
      name: 'New Facility',
      address: '',
      country: '',
    };
    const newDataset = {
      ...dataset,
      facilities: [...facilities, newFacility],
    } as Dataset;
    updateDataset.mutate({ dataset: newDataset });
  };

  const handleUpdateFacility = (id: string, field: keyof Facility, value: string) => {
    const newFacilities = facilities.map(f => f.id === id ? { ...f, [field]: value } : f);
    const newDataset = { ...dataset, facilities: newFacilities } as Dataset;
    updateDataset.mutate({ dataset: newDataset });
  };

  const handleDeleteFacility = (id: string) => {
    const newFacilities = facilities.filter(f => f.id !== id);
    const newDataset = { ...dataset, facilities: newFacilities } as Dataset;
    updateDataset.mutate({ dataset: newDataset });
  };

  const handleAddEnergy = () => {
    const newEnergy: EnergyEntry = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2) + Date.now().toString(36),
      facilityId: facilities[0]?.id || '',
      source: 'electricity',
      amount: 0,
      unit: 'kWh',
    };
    const newDataset = {
      ...dataset,
      energy_entries: [...energyEntries, newEnergy],
    } as Dataset;
    updateDataset.mutate({ dataset: newDataset });
  };

  const handleUpdateEnergy = (id: string, field: keyof EnergyEntry, value: string | number) => {
    const newEntries = energyEntries.map(e => e.id === id ? { ...e, [field]: value } : e);
    const newDataset = { ...dataset, energy_entries: newEntries } as Dataset;
    updateDataset.mutate({ dataset: newDataset });
  };

  const handleDeleteEnergy = (id: string) => {
    const newEntries = energyEntries.filter(e => e.id !== id);
    const newDataset = { ...dataset, energy_entries: newEntries } as Dataset;
    updateDataset.mutate({ dataset: newDataset });
  };

  return (
    <Tabs defaultValue="structure" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="structure">Organizational Structure</TabsTrigger>
        <TabsTrigger value="energy">Energy (Scope 1&2)</TabsTrigger>
        <TabsTrigger value="supply">Supply Chain (Scope 3)</TabsTrigger>
      </TabsList>
      
      <TabsContent value="structure">
        <Card>
          <CardHeader>
            <CardTitle>Facilities List</CardTitle>
            <CardDescription>Manage your organization&apos;s facilities and branches.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="p-3 text-left font-medium">Name</th>
                      <th className="p-3 text-left font-medium">Address</th>
                      <th className="p-3 text-left font-medium">Country</th>
                      <th className="p-3 text-right font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {facilities.map((facility) => (
                      <tr key={facility.id} className="border-b last:border-0">
                        <td className="p-3">
                          <Input 
                            value={facility.name} 
                            onChange={(e) => handleUpdateFacility(facility.id, 'name', e.target.value)}
                          />
                        </td>
                        <td className="p-3">
                          <Input 
                            value={facility.address} 
                            onChange={(e) => handleUpdateFacility(facility.id, 'address', e.target.value)}
                          />
                        </td>
                        <td className="p-3">
                          <Input 
                            value={facility.country} 
                            onChange={(e) => handleUpdateFacility(facility.id, 'country', e.target.value)}
                          />
                        </td>
                        <td className="p-3 text-right">
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteFacility(facility.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {facilities.length === 0 && (
                      <tr>
                        <td colSpan={4} className="p-4 text-center text-muted-foreground">
                          No facilities added yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <Button onClick={handleAddFacility}>
                <Plus className="mr-2 h-4 w-4" /> Add Facility
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="energy">
        <Card>
          <CardHeader>
            <CardTitle>Energy Consumption</CardTitle>
            <CardDescription>Enter energy consumption data for each facility.</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="space-y-4">
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="p-3 text-left font-medium">Facility</th>
                      <th className="p-3 text-left font-medium">Source</th>
                      <th className="p-3 text-left font-medium">Amount</th>
                      <th className="p-3 text-left font-medium">Unit</th>
                      <th className="p-3 text-right font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {energyEntries.map((entry) => (
                      <tr key={entry.id} className="border-b last:border-0">
                        <td className="p-3">
                          <Select 
                            value={entry.facilityId} 
                            onValueChange={(val) => handleUpdateEnergy(entry.id, 'facilityId', val)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select facility" />
                            </SelectTrigger>
                            <SelectContent>
                              {facilities.map(f => (
                                <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="p-3">
                           <Select 
                            value={entry.source} 
                            onValueChange={(val) => handleUpdateEnergy(entry.id, 'source', val)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select source" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="electricity">Electricity</SelectItem>
                              <SelectItem value="heat">Heat</SelectItem>
                              <SelectItem value="fuel">Fuel</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="p-3">
                          <Input 
                            type="number"
                            value={entry.amount} 
                            onChange={(e) => handleUpdateEnergy(entry.id, 'amount', parseFloat(e.target.value))}
                          />
                        </td>
                        <td className="p-3">
                          <Input 
                            value={entry.unit} 
                            onChange={(e) => handleUpdateEnergy(entry.id, 'unit', e.target.value)}
                          />
                        </td>
                        <td className="p-3 text-right">
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteEnergy(entry.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                     {energyEntries.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-4 text-center text-muted-foreground">
                          No energy data added yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <Button onClick={handleAddEnergy} disabled={facilities.length === 0}>
                <Plus className="mr-2 h-4 w-4" /> Add Energy Entry
              </Button>
              {facilities.length === 0 && <p className="text-sm text-muted-foreground">Add facilities first.</p>}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="supply">
        <Card>
          <CardHeader>
            <CardTitle>Supply Chain</CardTitle>
            <CardDescription>Scope 3 data entry (Coming Soon).</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Supply chain data entry interface will be implemented here.</p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
