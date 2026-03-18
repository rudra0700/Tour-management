import { Router } from "express";
import checkAuth from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import validateRequest from "../../middlewares/validateRequest";
import { TourController } from "./tour.controller";
import { createTourZodSchema, updateTourZodSchema } from "./tour.validation";

const router = Router();

router.post(
  "/create",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(createTourZodSchema),
  TourController.createTour,
);

router.get("/", TourController.getAllTours);

router.post(
  "/create",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(createTourZodSchema),
  TourController.createTour,
);

router.patch(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(updateTourZodSchema),
  TourController.updateTour,
);

router.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  TourController.deleteTour,
);

export const TourRoutes = router;
