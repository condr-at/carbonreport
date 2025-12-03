'use client';

import { useEffect } from 'react';
import { saveProjectPrefill } from '@/lib/project-prefill';

interface ReportSummary {
  id: string;
  templateCode: string;
  completion?: number;
}

interface ProjectSummary {
  id: string;
  name: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  datasetVersion?: number;
}

interface ProjectPrefillHydratorProps {
  project: ProjectSummary;
  reports?: ReportSummary[];
}

export function ProjectPrefillHydrator({ project, reports }: ProjectPrefillHydratorProps) {
  useEffect(() => {
    if (!project?.id) return;

    const completion = reports && reports.length > 0
      ? Math.round(
          reports.reduce((sum, report) => sum + (report?.completion ?? 0), 0) / reports.length
        )
      : 0;

    saveProjectPrefill({
      id: project.id,
      name: project.name,
      status: project.status,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      datasetVersion: project.datasetVersion,
      reportsCount: reports?.length,
      completion,
      templateCodes: reports?.map((report) => report.templateCode) ?? [],
      source: 'server',
    });
  }, [project, reports]);

  return null;
}
