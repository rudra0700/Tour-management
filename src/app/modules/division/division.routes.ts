import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { DivisionController } from "./division.controller";
import checkAuth from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import {
  createDivisionSchema,
  updateDivisionSchema,
} from "./division.validation";

const router = Router();

router.post(
  "/create",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(createDivisionSchema),
  DivisionController.createDivision,
);

router.get("/", DivisionController.getAllDivisions);
router.get("/:slug", DivisionController.getSingleDivision);
router.patch(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(updateDivisionSchema),
  DivisionController.updateDivision,
);
router.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  DivisionController.deleteDivision
);

export const DivisonRoutes = router;
