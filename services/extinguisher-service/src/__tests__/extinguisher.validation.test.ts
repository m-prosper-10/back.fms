import { createExtinguisherSchema, updateExtinguisherSchema } from "../modules/extinguishers/extinguisher.validation";

describe("extinguisher validation", () => {
  it("accepts a valid extinguisher payload", () => {
    const result = createExtinguisherSchema.safeParse({
      serialNumber: "EXT-001",
      location: "Main Lobby",
      type: "CO2",
      size: "9 lb",
      installationDate: "2024-01-01",
      expiryDate: "2026-01-01"
    });

    expect(result.success).toBe(true);
  });

  it("rejects invalid date ordering", () => {
    const result = createExtinguisherSchema.safeParse({
      serialNumber: "EXT-002",
      location: "Main Lobby",
      type: "CO2",
      size: "9 lb",
      installationDate: "2026-01-01",
      expiryDate: "2024-01-01"
    });

    expect(result.success).toBe(false);
  });

  it("rejects invalid update status", () => {
    const result = updateExtinguisherSchema.safeParse({
      status: "retired"
    });

    expect(result.success).toBe(false);
  });
});
