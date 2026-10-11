import type { DataRequestSummary } from '@/lib/data-requests/types';
import type { Dataset } from '@/lib/dataset-validation';

export interface OverviewReport {
  id: string;
  templateCode: string;
  completion: number;
}

export interface OverviewChecklistItem {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dataPointIds?: string[];
}

export interface OverviewProjectInput {
  projectId: string;
  status: string;
  datasetVersion: number;
  ownerName?: string | null;
  reports: OverviewReport[];
  checklistItems: OverviewChecklistItem[];
  dataset: Dataset | null;
  dataRequests: DataRequestSummary[];
}

export interface OverviewSignal {
  title: string;
  detail: string;
  tone?: 'default' | 'success' | 'warning';
}

export type OverviewActionKind =
  | 'respond_to_requests'
  | 'complete_roadmap'
  | 'add_dataset'
  | 'complete_reports'
  | 'prepare_supplier_package'
  | 'ready';

export type OverviewActionOwnerType = 'external' | 'internal' | 'none';

export interface OverviewAction {
  kind: OverviewActionKind;
  title: string;
  detail: string;
  ownerLabel: string;
  ownerType: OverviewActionOwnerType;
  href?: string;
  tone: 'default' | 'success' | 'warning';
}

export interface MissingWorkItem {
  id: string;
  label: string;
  detail: string;
  ownerLabel: string;
  ownerType: OverviewActionOwnerType;
  href?: string;
}

export interface ProjectOverviewState {
  hasSupplierPackage: boolean;
  avgCompletion: number;
  totalReports: number;
  completedReports: number;
  totalDataPoints: number;
  pendingRequests: number;
  completedRequests: number;
  revokedRequests: number;
  incompleteCount: number;
  signals: OverviewSignal[];
  reportsNeedingAttention: OverviewReport[];
  topIncompleteItems: OverviewChecklistItem[];
  primaryAction: OverviewAction;
  missingWork: MissingWorkItem[];
}

function plural(count: number, singular: string, pluralValue = `${singular}s`) {
  return `${count} ${count === 1 ? singular : pluralValue}`;
}

function getInternalOwner(ownerName?: string | null) {
  return ownerName?.trim() || 'Project team';
}

function buildRequestOwner(request: DataRequestSummary) {
  if (request.contact?.name) {
    return request.contact.name;
  }

  if (request.contact?.email) {
    return request.contact.email;
  }

  return 'External contact';
}

function buildSignals({
  status,
  datasetVersion,
  totalDataPoints,
  incompleteCount,
  pendingRequests,
  completedRequests,
  avgCompletion,
  hasSupplierPackage,
}: {
  status: string;
  datasetVersion: number;
  totalDataPoints: number;
  incompleteCount: number;
  pendingRequests: number;
  completedRequests: number;
  avgCompletion: number;
  hasSupplierPackage: boolean;
}): OverviewSignal[] {
  const signals: OverviewSignal[] = [
    {
      title: 'Project status',
      detail: status.toLowerCase(),
    },
    {
      title: 'Dataset version',
      detail: `Version ${datasetVersion}`,
    },
  ];

  if (incompleteCount > 0) {
    signals.push({
      title: 'Next priority',
      detail: `${plural(incompleteCount, 'roadmap task')} still open`,
      tone: 'warning',
    });
  } else {
    signals.push({
      title: 'Roadmap state',
      detail: 'No open roadmap tasks right now',
      tone: 'success',
    });
  }

  if (pendingRequests > 0) {
    signals.push({
      title: 'Waiting on others',
      detail: plural(pendingRequests, 'pending data request'),
      tone: 'warning',
    });
  } else if (completedRequests > 0) {
    signals.push({
      title: 'Request progress',
      detail: `${plural(completedRequests, 'request')} already completed`,
      tone: 'success',
    });
  } else {
    signals.push({
      title: 'Data collection',
      detail: 'No data requests sent yet',
    });
  }

  signals.push({
    title: 'Coverage signal',
    detail:
      totalDataPoints > 0
        ? `${plural(totalDataPoints, 'data point')} in dataset, ${Math.round(avgCompletion)}% average ${hasSupplierPackage ? 'report field coverage' : 'report completion'}`
        : 'Dataset is still empty',
  });

  return signals;
}

export function buildProjectOverviewState(input: OverviewProjectInput): ProjectOverviewState {
  const supplierPackage = input.reports.find((report) => report.templateCode === 'CBAM_DATA_PACKAGE');
  const supplierPackageHref = supplierPackage ? `/projects/${input.projectId}/reports/${supplierPackage.id}` : undefined;
  const totalReports = input.reports.length;
  const avgCompletion = totalReports > 0
    ? input.reports.reduce((sum, report) => sum + (report.completion || 0), 0) / totalReports
    : 0;
  const completedReports = input.reports.filter((report) => report.completion >= 100).length;
  const reportsNeedingAttention = [...input.reports]
    .filter((report) => report.completion < 100)
    .sort((left, right) => left.completion - right.completion)
    .slice(0, 4);

  const totalDataPoints = input.dataset?.data_points?.length ?? 0;
  const pendingDataRequests = input.dataRequests.filter((request) => request.status === 'pending');
  const completedRequests = input.dataRequests.filter((request) => request.status === 'completed').length;
  const revokedRequests = input.dataRequests.filter((request) => request.status === 'revoked').length;
  const incompleteRoadmapItems = input.checklistItems.filter((item) => !item.completed);
  const incompleteCount = incompleteRoadmapItems.length;
  const internalOwner = getInternalOwner(input.ownerName);

  const missingWork: MissingWorkItem[] = [
    ...pendingDataRequests.slice(0, 4).map((request) => ({
      id: `request:${request.id}`,
      label: request.dataPoint?.label || request.dataPoint?.id || 'Requested data',
      detail: request.deadline ? `Waiting since ${request.requestedAt}; due ${request.deadline}` : `Waiting since ${request.requestedAt}`,
      ownerLabel: buildRequestOwner(request),
      ownerType: 'external' as const,
      href: `/projects/${input.projectId}/data-requests`,
    })),
    ...incompleteRoadmapItems.slice(0, 4).map((item) => ({
      id: `roadmap:${item.id}`,
      label: item.title,
      detail: item.description || 'Roadmap task is still open',
      ownerLabel: internalOwner,
      ownerType: 'internal' as const,
    })),
    ...reportsNeedingAttention.slice(0, 3).map((report) => ({
      id: `report:${report.id}`,
      label: report.templateCode,
      detail: `${Math.round(report.completion)}% ${report.templateCode === 'CBAM_DATA_PACKAGE' ? 'field coverage' : 'complete'}`,
      ownerLabel: internalOwner,
      ownerType: 'internal' as const,
      href: report.templateCode === 'CBAM_DATA_PACKAGE' ? supplierPackageHref : `/projects/${input.projectId}/reports`,
    })),
  ].slice(0, 8);

  if (totalDataPoints === 0) {
    missingWork.unshift({
      id: 'dataset:empty',
      label: supplierPackage ? 'Supplier package inputs' : 'Initial dataset',
      detail: supplierPackage ? 'Add the first inputs in the guided supplier package form' : 'No data points have been added yet',
      ownerLabel: internalOwner,
      ownerType: 'internal',
      ...(supplierPackage ? { href: supplierPackageHref } : {}),
    });
  }

  let primaryAction: OverviewAction;
  if (pendingDataRequests.length > 0) {
    const owner = buildRequestOwner(pendingDataRequests[0]);
    primaryAction = {
      kind: 'respond_to_requests',
      title: 'Follow up on pending data requests',
      detail: `${owner} currently owns the next external response.`,
      ownerLabel: owner,
      ownerType: 'external',
      href: `/projects/${input.projectId}/data-requests`,
      tone: 'warning',
    };
  } else if (incompleteRoadmapItems.length > 0) {
    primaryAction = {
      kind: 'complete_roadmap',
      title: incompleteRoadmapItems[0].title,
      detail: incompleteRoadmapItems[0].description || 'Complete the next open roadmap task.',
      ownerLabel: internalOwner,
      ownerType: 'internal',
      tone: 'warning',
    };
  } else if (supplierPackage) {
    primaryAction = {
      kind: 'prepare_supplier_package',
      title: supplierPackage.completion >= 100 ? 'Review supplier package' : 'Prepare supplier review package',
      detail: supplierPackage.completion >= 100
        ? 'Check saved inputs and package validation in the guided form before downloading. Field coverage alone does not confirm readiness.'
        : 'Add supplier, installation and emissions information in the guided package form, then review its validation checks.',
      ownerLabel: internalOwner,
      ownerType: 'internal',
      href: supplierPackageHref,
      tone: supplierPackage.completion >= 100 ? 'default' : 'warning',
    };
  } else if (totalDataPoints === 0) {
    primaryAction = {
      kind: 'add_dataset',
      title: 'Add the first dataset entries',
      detail: 'The project cannot support report generation until the dataset has real values.',
      ownerLabel: internalOwner,
      ownerType: 'internal',
      href: `/projects/${input.projectId}/dataset`,
      tone: 'warning',
    };
  } else if (reportsNeedingAttention.length > 0) {
    primaryAction = {
      kind: 'complete_reports',
      title: `Complete ${reportsNeedingAttention[0].templateCode}`,
      detail: `${reportsNeedingAttention[0].templateCode} is the least complete selected report.`,
      ownerLabel: internalOwner,
      ownerType: 'internal',
      href: `/projects/${input.projectId}/reports`,
      tone: 'warning',
    };
  } else {
    primaryAction = {
      kind: 'ready',
      title: 'Project is ready for review',
      detail: 'No open roadmap, request, dataset, or report gaps were detected.',
      ownerLabel: 'No owner needed',
      ownerType: 'none',
      tone: 'success',
    };
  }

  return {
    hasSupplierPackage: Boolean(supplierPackage),
    avgCompletion,
    totalReports,
    completedReports,
    totalDataPoints,
    pendingRequests: pendingDataRequests.length,
    completedRequests,
    revokedRequests,
    incompleteCount,
    signals: buildSignals({
      status: input.status,
      datasetVersion: input.datasetVersion,
      totalDataPoints,
      incompleteCount,
      pendingRequests: pendingDataRequests.length,
      completedRequests,
      avgCompletion,
      hasSupplierPackage: Boolean(supplierPackage),
    }),
    reportsNeedingAttention,
    topIncompleteItems: incompleteRoadmapItems.slice(0, 8),
    primaryAction,
    missingWork,
  };
}
