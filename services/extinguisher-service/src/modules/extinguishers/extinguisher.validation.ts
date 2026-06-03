import { z } from "zod";
import { ObjectId } from "mongodb";

const types = ["Water", "CO2", "Foam", "Dry Chemical"] as const;
const sizes = ["1.5 lb", "5 lb", "9 lb", "12 lb"] as const;
const statuses = ["active", "expired", "maintenance", "decommissioned"] as const;

export const createExtinguisherSchema = z
  .object({
    serialNumber: z.string().min(1, "Serial number is required"),
    location: z.string().min(1, "Location is required"),
    type: z.enum(types),
    size: z.enum(sizes),
    installationDate: z.coerce.date(),
    expiryDate: z.coerce.date()
  })
  .refine((data) => data.expiryDate > data.installationDate, {
    message: "Expiry date must be after installation date",
    path: ["expiryDate"]
  });

export const updateExtinguisherSchema = z
  .object({
    serialNumber: z.string().min(1).optional(),
    location: z.string().min(1).optional(),
    type: z.enum(types).optional(),
    size: z.enum(sizes).optional(),
    installationDate: z.coerce.date().optional(),
    expiryDate: z.coerce.date().optional(),
    status: z.enum(statuses).optional()
  })
  .refine(
    (data) => {
      if (data.installationDate && data.expiryDate) {
        return data.expiryDate > data.installationDate;
      }

      return true;
    },
    {
      message: "Expiry date must be after installation date",
      path: ["expiryDate"]
    }
  );

export const statusFilterSchema = z.object({
  status: z.enum(statuses)
});

export const locationFilterSchema = z.object({
  location: z.string().min(1, "Location is required")
});

export const idParamSchema = z.object({
  id: z.string().refine((value) => ObjectId.isValid(value), "Extinguisher id must be a valid ObjectId")
});
