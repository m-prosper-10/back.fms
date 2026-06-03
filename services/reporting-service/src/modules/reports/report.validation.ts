import { z } from "zod";

export const reportRangeSchema = z
  .object({
    from: z.coerce.date().optional(),
    to: z.coerce.date().optional()
  })
  .refine(
    (data) => {
      if (!data.from || !data.to) {
        return true;
      }

      return data.from <= data.to;
    },
    {
      message: "End date must be on or after start date",
      path: ["to"]
    }
  );

export const reportPeriodSchema = z.enum(["daily", "monthly", "yearly"]);
export const reportExportFormatSchema = z.enum(["pdf", "csv"]);
