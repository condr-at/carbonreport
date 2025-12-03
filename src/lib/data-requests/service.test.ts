import assert from 'node:assert/strict';
import test from 'node:test';
import type { PrismaClient } from '@prisma/client';
import { computeStatus, executeBulk, prepareBulk, type BulkRequestInput } from './service';
import type { DataRequestSummary } from './types';

type ContactRecord = {
  id: string;
  organizationId: string;
  createdByUserId: string;
  email: string;
  name: string;
  position: string | null;
};

type DataRequestRecord = {
  id: string;
  userId: string;
  projectId: string;
  contactId: string;
  dataPointId: string;
  itemId: string | null;
  fieldLabel: string | null;
  deadline: Date | null;
  requestedAt: Date;
  revokedAt: Date | null;
  completedAt: Date | null;
};

type MockDataRequestDelegate = {
  findMany: ({ where, select }: { where: any; select: Record<string, boolean> }) => Promise<any[]>;
  updateMany: ({ where, data }: { where: { id?: { in: string[] } }; data: Partial<DataRequestRecord> }) => Promise<{ count: number }>;
  createMany: ({ data }: { data: Array<Omit<DataRequestRecord, 'requestedAt' | 'revokedAt' | 'completedAt'>> }) => Promise<{ count: number }>;
};

class MockPrismaClient {
  private contacts = new Map<string, ContactRecord>();
  private requests: DataRequestRecord[] = [];
  private requestSequence = 0;

  addContact(contact: ContactRecord) {
    this.contacts.set(contact.id, { ...contact });
  }

  contact = {
    findUnique: async ({ where: { id } }: { where: { id: string } }) => this.contacts.get(id) ?? null,
    findFirst: async ({ where: { organizationId, email } }: { where: { organizationId: string; email: string } }) =>
      Array.from(this.contacts.values()).find(
        (contact) => contact.organizationId === organizationId && contact.email === email
      ) ?? null,
    create: async ({ data }: { data: Omit<ContactRecord, 'id'> }) => {
      const record: ContactRecord = {
        id: `contact-${this.contacts.size + 1}`,
        ...data,
      };
      this.addContact(record);
      return record;
    },
  };

  readonly dataRequest: MockDataRequestDelegate = {
    findMany: async ({ where, select }: { where: any; select: Record<string, boolean> }) => {
      const matches = this.filterDataRequests(where);
      return matches.map((record) => this.applySelect(record, select));
    },
    updateMany: async ({ where, data }: { where: { id?: { in: string[] } }; data: Partial<DataRequestRecord> }) => {
      const ids = new Set(where?.id?.in ?? []);
      let count = 0;

      this.requests.forEach((record) => {
        if (!ids.has(record.id)) {
          return;
        }

        if (data.revokedAt !== undefined) {
          if (data.revokedAt === null) {
            record.revokedAt = null;
          } else {
            record.revokedAt = data.revokedAt instanceof Date ? data.revokedAt : new Date(data.revokedAt);
          }
        }

        if (data.completedAt !== undefined) {
          if (data.completedAt === null) {
            record.completedAt = null;
          } else {
            record.completedAt = data.completedAt instanceof Date ? data.completedAt : new Date(data.completedAt);
          }
        }

        count += 1;
      });

      return { count };
    },
    createMany: async ({ data }: { data: Array<Omit<DataRequestRecord, 'requestedAt' | 'revokedAt' | 'completedAt'>> }) => {
      data.forEach((row) => {
        const record: DataRequestRecord = {
          ...row,
          requestedAt: new Date(1_700_000_000_000 + this.requestSequence),
          revokedAt: null,
          completedAt: null,
        };
        this.requestSequence += 1;
        this.requests.push(record);
      });

      return { count: data.length };
    },
  };

  async $transaction<T>(fn: (tx: { dataRequest: MockDataRequestDelegate }) => Promise<T>): Promise<T> {
    return fn({ dataRequest: this.dataRequest });
  }

  getFieldRecords(projectId: string, dataPointId: string, itemId: string | null): DataRequestRecord[] {
    return this.requests.filter(
      (record) =>
        record.projectId === projectId &&
        record.dataPointId === dataPointId &&
        (record.itemId ?? null) === (itemId ?? null)
    );
  }

  toSummaries(records: DataRequestRecord[]): DataRequestSummary[] {
    return records.map((record) => {
      const contact = this.contacts.get(record.contactId);
      return {
        id: record.id,
        status: computeStatus(record),
        requestedAt: record.requestedAt.toISOString(),
        completedAt: record.completedAt ? record.completedAt.toISOString() : null,
        revokedAt: record.revokedAt ? record.revokedAt.toISOString() : null,
        contact: contact
          ? {
              id: contact.id,
              name: contact.name,
              email: contact.email,
            }
          : null,
        dataPoint: {
          id: record.dataPointId,
          itemId: record.itemId,
        },
      };
    });
  }

  asPrisma(): PrismaClient {
    return this as unknown as PrismaClient;
  }

  private filterDataRequests(where: any): DataRequestRecord[] {
    return this.requests.filter((record) => {
      if (where.projectId && record.projectId !== where.projectId) {
        return false;
      }

      if (where.revokedAt === null && record.revokedAt !== null) {
        return false;
      }

      if (where.completedAt === null && record.completedAt !== null) {
        return false;
      }

      if (Array.isArray(where.OR) && where.OR.length > 0) {
        const matchesOr = where.OR.some((clause: any) => {
          const expectedItemId = clause.itemId ?? null;
          return record.dataPointId === clause.dataPointId && (record.itemId ?? null) === expectedItemId;
        });

        if (!matchesOr) {
          return false;
        }
      }

      return true;
    });
  }

  private applySelect(record: DataRequestRecord, select: Record<string, boolean>) {
    if (!select) {
      return record;
    }

    const picked: Record<string, unknown> = {};

    Object.keys(select).forEach((key) => {
      if (select[key]) {
        picked[key] = (record as Record<string, unknown>)[key];
      }
    });

    return picked;
  }
}

function latestPendingLabel(requests: DataRequestSummary[]): string {
  const latestPending = [...requests]
    .filter((request) => request.status === 'pending')
    .sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime())[0];

  if (!latestPending) {
    return '—';
  }

  const label = latestPending.contact?.name?.trim() || latestPending.contact?.email || null;
  return label ?? '—';
}

async function submitRequest(mock: MockPrismaClient, input: BulkRequestInput) {
  const client = mock.asPrisma();
  const plan = await prepareBulk(input, client);
  await executeBulk(plan, client);
}

test('bulk data requests keep only one pending record per field and surface the latest contact', async () => {
  const mock = new MockPrismaClient();
  const projectId = 'project-1';
  const organizationId = 'org-1';
  const userId = 'user-1';
  const field = {
    dataPointId: 'field-A',
    itemId: null,
    fieldLabel: 'Scope 1 emissions',
    group: null,
  };

  const contactX: ContactRecord = {
    id: 'contact-x',
    organizationId,
    createdByUserId: userId,
    email: 'alex@example.com',
    name: 'Alex Rivera',
    position: null,
  };

  const contactY: ContactRecord = {
    id: 'contact-y',
    organizationId,
    createdByUserId: userId,
    email: 'yara@example.com',
    name: 'Yara Singh',
    position: null,
  };

  mock.addContact(contactX);
  mock.addContact(contactY);

  const baseInput: Omit<BulkRequestInput, 'contact' | 'fields'> = {
    projectId,
    organizationId,
    requestedByUserId: userId,
    deadline: null,
    now: undefined,
  };

  const firstNow = new Date('2025-03-01T00:00:00.000Z');
  await submitRequest(mock, {
    ...baseInput,
    contact: { id: contactX.id, email: contactX.email },
    fields: [field],
    now: firstNow,
  });

  let fieldRecords = mock.getFieldRecords(projectId, field.dataPointId, field.itemId);
  let pending = fieldRecords.filter((record) => record.revokedAt === null && record.completedAt === null);

  assert.equal(pending.length, 1);
  assert.equal(pending[0]?.contactId, contactX.id);
  assert.equal(latestPendingLabel(mock.toSummaries(fieldRecords)), contactX.name);

  const secondNow = new Date('2025-03-02T00:00:00.000Z');
  await submitRequest(mock, {
    ...baseInput,
    contact: { id: contactX.id, email: contactX.email },
    fields: [field],
    now: secondNow,
  });

  fieldRecords = mock.getFieldRecords(projectId, field.dataPointId, field.itemId);
  pending = fieldRecords.filter((record) => record.revokedAt === null && record.completedAt === null);
  const revokedAfterSecond = fieldRecords.filter((record) => record.revokedAt !== null);

  assert.equal(fieldRecords.length, 2);
  assert.equal(pending.length, 1, 'only one pending request should remain after resending to same contact');
  assert.equal(pending[0]?.contactId, contactX.id);
  assert.equal(revokedAfterSecond.length, 1, 'previous pending request should be revoked');
  assert.equal(
    revokedAfterSecond[0]?.revokedAt?.toISOString(),
    secondNow.toISOString(),
    'revocation timestamp should match the second submission'
  );
  assert.equal(latestPendingLabel(mock.toSummaries(fieldRecords)), contactX.name);

  const thirdNow = new Date('2025-03-03T00:00:00.000Z');
  await submitRequest(mock, {
    ...baseInput,
    contact: { id: contactY.id, email: contactY.email },
    fields: [field],
    now: thirdNow,
  });

  fieldRecords = mock.getFieldRecords(projectId, field.dataPointId, field.itemId);
  pending = fieldRecords.filter((record) => record.revokedAt === null && record.completedAt === null);
  const revokedAfterThird = fieldRecords.filter((record) => record.revokedAt !== null);

  assert.equal(fieldRecords.length, 3);
  assert.equal(pending.length, 1, 'only the latest request should remain pending');
  assert.equal(pending[0]?.contactId, contactY.id);
  assert.equal(revokedAfterThird.length, 2, 'two previous requests should be revoked');
  const revokedTimestamps = revokedAfterThird
    .map((record) => record.revokedAt?.toISOString())
    .filter((value): value is string => Boolean(value))
    .sort();

  assert.deepStrictEqual(
    revokedTimestamps,
    [secondNow.toISOString(), thirdNow.toISOString()],
    'revoked requests should capture both prior submissions'
  );

  const latestRevoked = [...revokedAfterThird]
    .sort((a, b) => b.requestedAt.getTime() - a.requestedAt.getTime())[0];

  assert.equal(
    latestRevoked?.revokedAt?.toISOString(),
    thirdNow.toISOString(),
    'most recent previous request should be revoked when assigning a new contact'
  );
  assert.equal(latestPendingLabel(mock.toSummaries(fieldRecords)), contactY.name);
});
