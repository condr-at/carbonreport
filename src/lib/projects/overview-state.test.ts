import assert from 'node:assert/strict';
import test from 'node:test';
import { buildProjectOverviewState, type OverviewProjectInput } from './overview-state';

function baseInput(overrides: Partial<OverviewProjectInput> = {}): OverviewProjectInput {
  return {
    projectId: 'project-1',
    status: 'ACTIVE',
    datasetVersion: 3,
    ownerName: 'Alex Owner',
    reports: [
      {
        id: 'report-1',
        templateCode: 'ISO14067',
        completion: 100,
      },
    ],
    checklistItems: [],
    dataset: {
      data_points: [
        {
          field_id: 'product_name',
          item_id: null,
          value: 'Widget',
        },
      ],
    },
    dataRequests: [],
    ...overrides,
  };
}

test('prioritizes pending external data requests and names the contact owner', () => {
  const state = buildProjectOverviewState(
    baseInput({
      dataRequests: [
        {
          id: 'request-1',
          status: 'pending',
          requestedAt: '2026-06-01T00:00:00.000Z',
          completedAt: null,
          revokedAt: null,
          deadline: '2026-06-20T00:00:00.000Z',
          contact: {
            id: 'contact-1',
            name: 'Morgan Supplier',
            email: 'morgan@example.com',
          },
          dataPoint: {
            id: 'supplier_energy_mwh',
            label: 'Supplier energy',
          },
        },
      ],
    }),
  );

  assert.equal(state.primaryAction.kind, 'respond_to_requests');
  assert.equal(state.primaryAction.ownerType, 'external');
  assert.equal(state.primaryAction.ownerLabel, 'Morgan Supplier');
  assert.equal(state.primaryAction.href, '/projects/project-1/data-requests');
  assert.equal(state.pendingRequests, 1);
  assert.equal(state.missingWork[0].ownerLabel, 'Morgan Supplier');
  assert.equal(state.missingWork[0].ownerType, 'external');
  assert.equal(state.missingWork[0].href, '/projects/project-1/data-requests');
});

test('assigns open roadmap work to the project owner', () => {
  const state = buildProjectOverviewState(
    baseInput({
      checklistItems: [
        {
          id: 'roadmap-1',
          title: 'Confirm product boundary',
          description: 'Boundary must be reviewed before report generation.',
          completed: false,
        },
      ],
    }),
  );

  assert.equal(state.primaryAction.kind, 'complete_roadmap');
  assert.equal(state.primaryAction.ownerType, 'internal');
  assert.equal(state.primaryAction.ownerLabel, 'Alex Owner');
  assert.equal(state.incompleteCount, 1);
  assert.equal(state.missingWork[0].label, 'Confirm product boundary');
});

test('surfaces an empty dataset as internal missing work', () => {
  const state = buildProjectOverviewState(
    baseInput({
      dataset: {
        data_points: [],
      },
      reports: [
        {
          id: 'report-1',
          templateCode: 'ISO14067',
          completion: 40,
        },
      ],
    }),
  );

  assert.equal(state.totalDataPoints, 0);
  assert.equal(state.primaryAction.href, '/projects/project-1/dataset');
  assert.equal(state.missingWork[0].id, 'dataset:empty');
  assert.equal(state.missingWork[0].ownerType, 'internal');
  assert.equal(state.missingWork[0].ownerLabel, 'Alex Owner');
});

test('links report completion actions to project reports', () => {
  const state = buildProjectOverviewState(
    baseInput({
      reports: [
        {
          id: 'report-1',
          templateCode: 'ISO14067',
          completion: 35,
        },
      ],
    }),
  );

  assert.equal(state.primaryAction.kind, 'complete_reports');
  assert.equal(state.primaryAction.href, '/projects/project-1/reports');
  assert.equal(state.missingWork[0].href, '/projects/project-1/reports');
});

test('does not invent missing work when project state is complete', () => {
  const state = buildProjectOverviewState(baseInput());

  assert.equal(state.primaryAction.kind, 'ready');
  assert.equal(state.primaryAction.ownerType, 'none');
  assert.equal(state.missingWork.length, 0);
  assert.equal(state.completedReports, 1);
  assert.equal(state.hasSupplierPackage, false);
});

test('an empty supplier package project opens its guided report instead of the generic dataset', () => {
  const state = buildProjectOverviewState(baseInput({
    reports: [{ id: 'supplier-report', templateCode: 'CBAM_DATA_PACKAGE', completion: 0 }],
    dataset: { data_points: [] },
  }));

  assert.equal(state.hasSupplierPackage, true);
  assert.equal(state.primaryAction.kind, 'prepare_supplier_package');
  assert.equal(state.primaryAction.title, 'Prepare supplier review package');
  assert.equal(state.primaryAction.href, '/projects/project-1/reports/supplier-report');
  assert.equal(state.primaryAction.ownerLabel, 'Alex Owner');
  assert.equal(state.missingWork[0].href, '/projects/project-1/reports/supplier-report');
  assert.equal(state.missingWork[0].label, 'Supplier package inputs');
});

test('partially filled supplier package links both next action and report work to the guided form', () => {
  const state = buildProjectOverviewState(baseInput({
    reports: [{ id: 'supplier-report', templateCode: 'CBAM_DATA_PACKAGE', completion: 50 }],
  }));

  assert.equal(state.primaryAction.href, '/projects/project-1/reports/supplier-report');
  const reportWork = state.missingWork.find((item) => item.id === 'report:supplier-report');
  assert.equal(reportWork?.href, '/projects/project-1/reports/supplier-report');
  assert.equal(reportWork?.detail, '50% field coverage');
  assert.match(state.signals.find((signal) => signal.title === 'Coverage signal')!.detail, /50% average report field coverage/);
});

test('100% supplier field coverage remains a review action without claiming readiness or download', () => {
  const state = buildProjectOverviewState(baseInput({
    reports: [{ id: 'supplier-report', templateCode: 'CBAM_DATA_PACKAGE', completion: 100 }],
  }));

  assert.equal(state.avgCompletion, 100);
  assert.equal(state.completedReports, 1);
  assert.equal(state.primaryAction.kind, 'prepare_supplier_package');
  assert.equal(state.primaryAction.title, 'Review supplier package');
  assert.equal(state.primaryAction.href, '/projects/project-1/reports/supplier-report');
  assert.equal(state.primaryAction.ownerType, 'internal');
  assert.equal(state.primaryAction.tone, 'default');
  assert.match(state.primaryAction.detail, /Field coverage alone does not confirm readiness/);
  assert.match(state.signals.find((signal) => signal.title === 'Coverage signal')!.detail, /100% average report field coverage/);
});

test('supplier package selection preserves external-request and roadmap priorities', () => {
  const reports = [{ id: 'supplier-report', templateCode: 'CBAM_DATA_PACKAGE', completion: 0 }];
  const checklistItems = [{ id: 'task-1', title: 'Confirm boundary', completed: false }];
  const roadmap = buildProjectOverviewState(baseInput({ reports, checklistItems, dataset: { data_points: [] } }));
  assert.equal(roadmap.primaryAction.kind, 'complete_roadmap');

  const requests = buildProjectOverviewState(baseInput({
    reports, checklistItems, dataset: { data_points: [] },
    dataRequests: [{
      id: 'request-1', status: 'pending', requestedAt: '2026-10-10T00:00:00.000Z',
      completedAt: null, revokedAt: null, deadline: null,
      contact: { id: 'contact-1', name: 'Supplier', email: 'supplier@example.test' },
      dataPoint: { id: 'cbam_operator_name', label: 'Operator' },
    }],
  }));
  assert.equal(requests.primaryAction.kind, 'respond_to_requests');
  assert.equal(requests.primaryAction.href, '/projects/project-1/data-requests');
});

test('only exact supplier profile changes the action; other selected report links retain their behavior', () => {
  const ordinary = buildProjectOverviewState(baseInput({
    reports: [{ id: 'cbam-report', templateCode: 'CBAM', completion: 0 }],
    dataset: { data_points: [] },
  }));
  assert.equal(ordinary.hasSupplierPackage, false);
  assert.equal(ordinary.primaryAction.kind, 'add_dataset');
  assert.equal(ordinary.primaryAction.href, '/projects/project-1/dataset');

  const mixed = buildProjectOverviewState(baseInput({
    reports: [
      { id: 'other-report', templateCode: 'ISO14067', completion: 10 },
      { id: 'supplier-report', templateCode: 'CBAM_DATA_PACKAGE', completion: 50 },
    ],
  }));
  assert.equal(mixed.primaryAction.href, '/projects/project-1/reports/supplier-report');
  assert.equal(mixed.missingWork.find((item) => item.id === 'report:other-report')?.href, '/projects/project-1/reports');
  assert.equal(mixed.missingWork.find((item) => item.id === 'report:other-report')?.detail, '10% complete');
});
