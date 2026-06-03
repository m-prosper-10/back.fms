import { Filter, Sort } from "mongodb";
import { getReportingCollections } from "../../config/database";
import {
  DateRange,
  ExtinguisherDocument,
  ExtinguisherReportEntry,
  InspectionDocument,
  InspectionReportEntry,
  MaintenanceDocument,
  MaintenanceReportEntry,
  ReportMetric
} from "./report.types";

function collections() {
  return getReportingCollections();
}

function toObjectIdString(value: { toHexString: () => string }) {
  return value.toHexString();
}

function toExtinguisherEntry(doc: ExtinguisherDocument): ExtinguisherReportEntry {
  return {
    id: toObjectIdString(doc._id),
    serialNumber: doc.serialNumber,
    location: doc.location,
    type: doc.type,
    size: doc.size,
    installationDate: doc.installationDate,
    expiryDate: doc.expiryDate,
    status: doc.status,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt
  };
}

function toInspectionEntry(doc: InspectionDocument): InspectionReportEntry {
  return {
    id: toObjectIdString(doc._id),
    extinguisherId: toObjectIdString(doc.extinguisherId),
    assignedInspectorId: toObjectIdString(doc.assignedInspectorId),
    inspectionDate: doc.inspectionDate,
    inspectionTime: doc.inspectionTime,
    status: doc.status,
    result: doc.result ?? null,
    findings: doc.findings ?? null,
    completedAt: doc.completedAt ?? null,
    notes: doc.notes ?? null,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt
  };
}

function toMaintenanceEntry(doc: MaintenanceDocument): MaintenanceReportEntry {
  return {
    id: toObjectIdString(doc._id),
    extinguisherId: toObjectIdString(doc.extinguisherId),
    inspectorId: toObjectIdString(doc.inspectorId),
    actionTaken: doc.actionTaken,
    maintenanceDate: doc.maintenanceDate,
    issuesIdentified: doc.issuesIdentified,
    notesAndRecommendations: doc.notesAndRecommendations ?? null,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt
  };
}

export function buildDateRangeFilter(field: string, range?: DateRange): Filter<Record<string, unknown>> {
  if (!range?.from && !range?.to) {
    return {};
  }

  const filter: Record<string, unknown> = {};
  if (range.from) {
    filter.$gte = range.from;
  }
  if (range.to) {
    filter.$lte = range.to;
  }

  return { [field]: filter } as Filter<Record<string, unknown>>;
}

export async function countExtinguishers(match: Filter<ExtinguisherDocument> = {}) {
  return collections().fireExtinguishers.countDocuments(match);
}

export async function listExtinguishers(
  match: Filter<ExtinguisherDocument> = {},
  options: { limit?: number; sort?: Sort } = {}
) {
  const cursor = collections()
    .fireExtinguishers.find(match)
    .sort(options.sort ?? { createdAt: -1 });

  if (options.limit) {
    cursor.limit(options.limit);
  }

  const documents = await cursor.toArray();
  return documents.map(toExtinguisherEntry);
}

export async function aggregateExtinguishersBy(field: "status" | "type" | "location", match: Filter<ExtinguisherDocument> = {}) {
  const documents = await collections()
    .fireExtinguishers.aggregate<{ _id: string; count: number }>([
      { $match: match },
      { $group: { _id: `$${field}`, count: { $sum: 1 } } },
      { $sort: { count: -1, _id: 1 } }
    ])
    .toArray();

  return documents.map(({ _id, count }) => ({
    label: String(_id),
    count
  })) satisfies ReportMetric[];
}

export async function aggregateExtinguishersByDate(
  period: "daily" | "monthly" | "yearly",
  match: Filter<ExtinguisherDocument> = {}
) {
  const format = period === "daily" ? "%Y-%m-%d" : period === "monthly" ? "%Y-%m" : "%Y";
  const documents = await collections()
    .fireExtinguishers.aggregate<{ _id: string; count: number }>([
      { $match: match },
      {
        $group: {
          _id: {
            $dateToString: {
              format,
              date: "$createdAt"
            }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ])
    .toArray();

  return documents.map(({ _id, count }) => ({
    label: String(_id),
    count
  })) satisfies ReportMetric[];
}

export async function countInspections(match: Filter<InspectionDocument> = {}) {
  return collections().inspections.countDocuments(match);
}

export async function listInspections(
  match: Filter<InspectionDocument> = {},
  options: { limit?: number; sort?: Sort } = {}
) {
  const cursor = collections()
    .inspections.find(match)
    .sort(options.sort ?? { inspectionDate: -1 });

  if (options.limit) {
    cursor.limit(options.limit);
  }

  const documents = await cursor.toArray();
  return documents.map(toInspectionEntry);
}

export async function aggregateInspectionsBy(field: "status" | "result", match: Filter<InspectionDocument> = {}) {
  const documents = await collections()
    .inspections.aggregate<{ _id: string; count: number }>([
      { $match: match },
      { $group: { _id: `$${field}`, count: { $sum: 1 } } },
      { $sort: { count: -1, _id: 1 } }
    ])
    .toArray();

  return documents.map(({ _id, count }) => ({
    label: String(_id ?? "unknown"),
    count
  })) satisfies ReportMetric[];
}

export async function countMaintenanceLogs(match: Filter<MaintenanceDocument> = {}) {
  return collections().maintenanceLogs.countDocuments(match);
}

export async function listMaintenanceLogs(
  match: Filter<MaintenanceDocument> = {},
  options: { limit?: number; sort?: Sort } = {}
) {
  const cursor = collections()
    .maintenanceLogs.find(match)
    .sort(options.sort ?? { maintenanceDate: -1 });

  if (options.limit) {
    cursor.limit(options.limit);
  }

  const documents = await cursor.toArray();
  return documents.map(toMaintenanceEntry);
}

export async function aggregateMaintenanceBy(field: "actionTaken" | "maintenanceDate", match: Filter<MaintenanceDocument> = {}) {
  const pipeline =
    field === "maintenanceDate"
      ? [
          { $match: match },
          {
            $group: {
              _id: {
                $dateToString: {
                  format: "%Y-%m",
                  date: "$maintenanceDate"
                }
              },
              count: { $sum: 1 }
            }
          },
          { $sort: { _id: 1 } }
        ]
      : [
          { $match: match },
          { $group: { _id: "$actionTaken", count: { $sum: 1 } } },
          { $sort: { count: -1, _id: 1 } }
        ];

  const documents = await collections().maintenanceLogs.aggregate<{ _id: string; count: number }>(pipeline).toArray();

  return documents.map(({ _id, count }) => ({
    label: String(_id),
    count
  })) satisfies ReportMetric[];
}
