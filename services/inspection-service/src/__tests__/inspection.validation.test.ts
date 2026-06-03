import {
  completeInspectionSchema,
  maintenanceRequestSchema,
  scheduleInspectionSchema,
  updateInspectionSchema
} from "../modules/inspections/inspection.validation";

describe("inspection validation", () => {
  it("accepts a valid inspection schedule", () => {
    const result = scheduleInspectionSchema.safeParse({
      extinguisherId: "66a0d8f6f2b3a4c7d1e8a901",
      inspectionDate: "2026-06-10",
      inspectionTime: "10:30",
      assignedInspectorId: "66a0d8f6f2b3a4c7d1e8a902",
      notes: "Monthly inspection"
    });

    expect(result.success).toBe(true);
  });

  it("rejects an invalid inspection time", () => {
    const result = scheduleInspectionSchema.safeParse({
      extinguisherId: "66a0d8f6f2b3a4c7d1e8a901",
      inspectionDate: "2026-06-10",
      inspectionTime: "10-30",
      assignedInspectorId: "66a0d8f6f2b3a4c7d1e8a902"
    });

    expect(result.success).toBe(false);
  });

  it("rejects an inspection update with an invalid status", () => {
    const result = updateInspectionSchema.safeParse({
      status: "done"
    });

    expect(result.success).toBe(false);
  });

  it("accepts a valid maintenance request", () => {
    const result = maintenanceRequestSchema.safeParse({
      extinguisherId: "66a0d8f6f2b3a4c7d1e8a901",
      actionTaken: "Replaced pressure gauge",
      maintenanceDate: "2026-06-03",
      issuesIdentified: "Low pressure",
      notesAndRecommendations: "Recheck in 30 days"
    });

    expect(result.success).toBe(true);
  });

  it("rejects an incomplete inspection completion payload", () => {
    const result = completeInspectionSchema.safeParse({
      findings: "Minor rust"
    });

    expect(result.success).toBe(false);
  });
});
