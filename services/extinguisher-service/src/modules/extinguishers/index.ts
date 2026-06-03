import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import {
  create,
  फिलterByLocation,
  filterByStatus,
  getById,
  getModuleStatus,
  list,
  remove,
  update
} from "./extinguisher.controller";

export const extinguisherRouter = Router();

extinguisherRouter.get("/meta", authenticate, authorize("admin", "inspector"), getModuleStatus);
extinguisherRouter.get("/", authenticate, list);
extinguisherRouter.post("/", authenticate, authorize("admin", "inspector"), create);
extinguisherRouter.get("/:id", authenticate, getById);
extinguisherRouter.patch("/:id", authenticate, authorize("admin", "inspector"), update);
extinguisherRouter.delete("/:id", authenticate, authorize("admin"), remove);
extinguisherRouter.get("/status/:status", authenticate, filterByStatus);
extinguisherRouter.get("/location/:location", authenticate, filterByLocation);
