import { NextFunction, Request, Response } from "express";
import { AppError } from "../../../../../shared/lib/httpError";
import { inspectionService } from "./inspection.service";
import {
  completeInspectionSchema,
  extinguisherIdParamSchema,
  inspectionIdParamSchema,
  inspectionStatusParamSchema,
  maintenanceExtinguisherParamSchema,
  maintenanceIdParamSchema,
  maintenanceRequestSchema,
  maintenanceUpdateSchema,
  scheduleInspectionSchema,
  updateInspectionSchema
} from "./inspection.validation";

function requireUser(req: Request) {
  if (!req.user) {
    throw new AppError(401, "Unauthorized");
  }

  return req.user;
}

function parseInspectionId(id: string) {
  const result = inspectionIdParamSchema.safeParse({ id });
  if (!result.success) {
    throw new AppError(400, "Invalid inspection id");
  }

  return result.data.id;
}

function parseMaintenanceId(id: string) {
  const result = maintenanceIdParamSchema.safeParse({ id });
  if (!result.success) {
    throw new AppError(400, "Invalid maintenance id");
  }

  return result.data.id;
}

function parseExtinguisherId(id: string) {
  const result = extinguisherIdParamSchema.safeParse({ extinguisherId: id });
  if (!result.success) {
    throw new AppError(400, "Invalid extinguisher id");
  }

  return result.data.extinguisherId;
}

export async function getInspectionModuleStatus(_req: Request, res: Response) {
  res.status(200).json({
    success: true,
    data: {
      module: "inspections",
      status: "ready",
      endpoints: [
        "POST /api/inspections",
        "GET /api/inspections",
        "GET /api/inspections/:id",
        "PATCH /api/inspections/:id",
        "DELETE /api/inspections/:id",
        "PATCH /api/inspections/:id/complete",
        "GET /api/inspections/status/:status",
        "GET /api/inspections/overdue",
        "GET /api/inspections/extinguisher/:extinguisherId"
      ]
    }
  });
}

export async function getMaintenanceModuleStatus(_req: Request, res: Response) {
  res.status(200).json({
    success: true,
    data: {
      module: "maintenance",
      status: "ready",
      endpoints: [
        "POST /api/maintenance",
        "GET /api/maintenance",
        "GET /api/maintenance/:id",
        "PATCH /api/maintenance/:id",
        "DELETE /api/maintenance/:id",
        "GET /api/maintenance/extinguisher/:extinguisherId"
      ]
    }
  });
}

export async function schedule(req: Request, res: Response, next: NextFunction) {
  const result = scheduleInspectionSchema.safeParse(req.body);

  if (!result.success) {
    next(new AppError(400, "Invalid request payload", result.error.flatten()));
    return;
  }

  try {
    const user = requireUser(req);
    const data = await inspectionService.schedule(result.data, user.id, user.role);
    res.status(201).json({
      success: true,
      message: "Inspection scheduled successfully",
      data
    });
  } catch (error) {
    next(error);
  }
}

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const user = requireUser(req);
    const data = await inspectionService.list(user.role);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const user = requireUser(req);
    const data = await inspectionService.getById(parseInspectionId(req.params.id), user.role);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  const result = updateInspectionSchema.safeParse(req.body);

  if (!result.success) {
    next(new AppError(400, "Invalid request payload", result.error.flatten()));
    return;
  }

  try {
    const user = requireUser(req);
    const data = await inspectionService.update(parseInspectionId(req.params.id), result.data, user.role);
    res.status(200).json({
      success: true,
      message: "Inspection updated successfully",
      data
    });
  } catch (error) {
    next(error);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const user = requireUser(req);
    const data = await inspectionService.remove(parseInspectionId(req.params.id), user.role);
    res.status(200).json({
      success: true,
      message: "Inspection deleted successfully",
      data
    });
  } catch (error) {
    next(error);
  }
}

export async function complete(req: Request, res: Response, next: NextFunction) {
  const result = completeInspectionSchema.safeParse(req.body);

  if (!result.success) {
    next(new AppError(400, "Invalid request payload", result.error.flatten()));
    return;
  }

  try {
    const user = requireUser(req);
    const data = await inspectionService.complete(parseInspectionId(req.params.id), result.data, user.role);
    res.status(200).json({
      success: true,
      message: "Inspection completed successfully",
      data
    });
  } catch (error) {
    next(error);
  }
}

export async function byStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const result = inspectionStatusParamSchema.safeParse({ status: req.params.status });
    if (!result.success) {
      next(new AppError(400, "Invalid status"));
      return;
    }

    const user = requireUser(req);
    const data = await inspectionService.byStatus(result.data.status, user.role);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function overdue(req: Request, res: Response, next: NextFunction) {
  try {
    const user = requireUser(req);
    const data = await inspectionService.overdue(user.role);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function byExtinguisher(req: Request, res: Response, next: NextFunction) {
  try {
    const result = extinguisherIdParamSchema.safeParse({ extinguisherId: req.params.extinguisherId });
    if (!result.success) {
      next(new AppError(400, "Invalid extinguisher id"));
      return;
    }

    const user = requireUser(req);
    const data = await inspectionService.byExtinguisher(result.data.extinguisherId, user.role);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function createMaintenance(req: Request, res: Response, next: NextFunction) {
  const result = maintenanceRequestSchema.safeParse(req.body);
  if (!result.success) {
    next(new AppError(400, "Invalid request payload", result.error.flatten()));
    return;
  }

  try {
    const user = requireUser(req);
    const data = await inspectionService.createMaintenance(result.data, user.id, user.role);
    res.status(201).json({
      success: true,
      message: "Maintenance log created successfully",
      data
    });
  } catch (error) {
    next(error);
  }
}

export async function listMaintenance(req: Request, res: Response, next: NextFunction) {
  try {
    const user = requireUser(req);
    const data = await inspectionService.listMaintenance(user.role);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function getMaintenanceById(req: Request, res: Response, next: NextFunction) {
  try {
    const user = requireUser(req);
    const data = await inspectionService.getMaintenanceById(parseMaintenanceId(req.params.id), user.role);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function updateMaintenance(req: Request, res: Response, next: NextFunction) {
  const result = maintenanceUpdateSchema.safeParse(req.body);

  if (!result.success) {
    next(new AppError(400, "Invalid request payload", result.error.flatten()));
    return;
  }

  try {
    const user = requireUser(req);
    const data = await inspectionService.updateMaintenance(parseMaintenanceId(req.params.id), result.data, user.role);
    res.status(200).json({
      success: true,
      message: "Maintenance log updated successfully",
      data
    });
  } catch (error) {
    next(error);
  }
}

export async function removeMaintenance(req: Request, res: Response, next: NextFunction) {
  try {
    const user = requireUser(req);
    const data = await inspectionService.removeMaintenance(parseMaintenanceId(req.params.id), user.role);
    res.status(200).json({
      success: true,
      message: "Maintenance log deleted successfully",
      data
    });
  } catch (error) {
    next(error);
  }
}

export async function maintenanceByExtinguisher(req: Request, res: Response, next: NextFunction) {
  try {
    const result = maintenanceExtinguisherParamSchema.safeParse({ extinguisherId: req.params.extinguisherId });
    if (!result.success) {
      next(new AppError(400, "Invalid extinguisher id"));
      return;
    }

    const user = requireUser(req);
    const data = await inspectionService.maintenanceByExtinguisher(result.data.extinguisherId, user.role);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
}
