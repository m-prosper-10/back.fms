import { NextFunction, Request, Response } from "express";
import { AppError } from "../../../../../shared/lib/httpError";
import { extinguisherService } from "./extinguisher.service";
import {
  createExtinguisherSchema,
  idParamSchema,
  locationFilterSchema,
  statusFilterSchema,
  updateExtinguisherSchema
} from "./extinguisher.validation";

function requireUser(req: Request) {
  if (!req.user) {
    throw new AppError(401, "Unauthorized");
  }

  return req.user;
}

function parseId(id: string) {
  const result = idParamSchema.safeParse({ id });
  if (!result.success) {
    throw new AppError(400, "Invalid extinguisher id");
  }

  return result.data.id;
}

export async function getModuleStatus(_req: Request, res: Response) {
  res.status(200).json({
    success: true,
    data: {
      module: "extinguishers",
      status: "ready",
      endpoints: [
        "POST /api/extinguishers",
        "GET /api/extinguishers",
        "GET /api/extinguishers/:id",
        "PATCH /api/extinguishers/:id",
        "DELETE /api/extinguishers/:id",
        "GET /api/extinguishers/status/:status",
        "GET /api/extinguishers/location/:location"
      ]
    }
  });
}

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const user = requireUser(req);
    const data = await extinguisherService.list(user.role);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const user = requireUser(req);
    const data = await extinguisherService.getById(parseId(req.params.id), user.role);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  const result = createExtinguisherSchema.safeParse(req.body);

  if (!result.success) {
    next(new AppError(400, "Invalid request payload", result.error.flatten()));
    return;
  }

  try {
    const user = requireUser(req);
    const data = await extinguisherService.create(result.data, user.id, user.role);
    res.status(201).json({
      success: true,
      message: "Extinguisher created successfully",
      data
    });
  } catch (error) {
    next(error);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  const result = updateExtinguisherSchema.safeParse(req.body);

  if (!result.success) {
    next(new AppError(400, "Invalid request payload", result.error.flatten()));
    return;
  }

  try {
    const user = requireUser(req);
    const data = await extinguisherService.update(parseId(req.params.id), result.data, user.id, user.role);
    res.status(200).json({
      success: true,
      message: "Extinguisher updated successfully",
      data
    });
  } catch (error) {
    next(error);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const user = requireUser(req);
    const data = await extinguisherService.remove(parseId(req.params.id), user.role);
    res.status(200).json({
      success: true,
      message: "Extinguisher deleted successfully",
      data
    });
  } catch (error) {
    next(error);
  }
}

export async function filterByStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const result = statusFilterSchema.safeParse({ status: req.params.status });
    if (!result.success) {
      next(new AppError(400, "Invalid status"));
      return;
    }

    const user = requireUser(req);
    const data = await extinguisherService.filterByStatus(result.data.status, user.role);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function filterByLocation(req: Request, res: Response, next: NextFunction) {
  try {
    const result = locationFilterSchema.safeParse({ location: req.params.location });
    if (!result.success) {
      next(new AppError(400, "Invalid location"));
      return;
    }

    const user = requireUser(req);
    const data = await extinguisherService.filterByLocation(result.data.location, user.role);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
}
