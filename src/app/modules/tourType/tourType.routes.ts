import { Router } from "express";
import checkAuth from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import validateRequest from "../../middlewares/validateRequest";
import { createTourTypeZodSchema, updateTourTypeZodSchema } from "./tourType.validation";
import { TourTypeController } from "./tourType.controller";

const router = Router();

router.post(
    "/create-tour-type",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    validateRequest(createTourTypeZodSchema),
    TourTypeController.createTourType
);

router.get("/tour-types", TourTypeController.getAllTourTypes);

router.patch(
    "/tour-types/:id",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    validateRequest(updateTourTypeZodSchema),
    TourTypeController.updateTourType
);

router.delete("/tour-types/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), TourTypeController.deleteTourType);

export const TourTypeRoutes = router;