import {
  reportExportFormatSchema,
  reportPeriodSchema,
  reportRangeSchema
} from "../modules/reports/report.validation";

describe("report validation", () => {
  it("accepts a valid report range", () => {
    const result = reportRangeSchema.safeParse({
      from: "2026-01-01",
      to: "2026-02-01"
    });

    expect(result.success).toBe(true);
  });

  it("rejects an inverted report range", () => {
    const result = reportRangeSchema.safeParse({
      from: "2026-02-01",
      to: "2026-01-01"
    });

    expect(result.success).toBe(false);
  });

  it("accepts a valid report period", () => {
    const result = reportPeriodSchema.safeParse("monthly");

    expect(result.success).toBe(true);
  });

  it("rejects an invalid export format", () => {
    const result = reportExportFormatSchema.safeParse("xlsx");

    expect(result.success).toBe(false);
  });
});
