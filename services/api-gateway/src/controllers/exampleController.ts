import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { AppError } from "../lib/httpError";
import { databaseService } from "../services/databaseService";
import { exampleService } from "../services/exampleService";
import { securityService } from "../services/securityService";

const echoSchema = z.object({
  message: z.string().min(1)
});

export async function listExamples(_req: Request, res: Response) {
  res.status(200).json({
    data: {
      service: exampleService.describe(),
      databases: databaseService.list(),
      security: securityService.describe()
    }
  });
}

export function echoMessage(req: Request, res: Response, next: NextFunction) {
  const result = echoSchema.safeParse(req.body);

  if (!result.success) {
    next(new AppError(400, "Invalid request payload", result.error.flatten()));
    return;
  }

  res.status(200).json({
    data: exampleService.echo(result.data.message)
  });
}
