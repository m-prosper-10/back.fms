import { Router } from "express";
import { echoMessage, listExamples } from "../../controllers/exampleController";

export const exampleRouter = Router();

exampleRouter.get("/", listExamples);
exampleRouter.post("/echo", echoMessage);
