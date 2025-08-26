import { Router } from "express";
import * as controller from "../controllers/task.controller";
const router = Router();
router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);
export default router;
