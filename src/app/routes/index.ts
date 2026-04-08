import { Router } from "express";
import { UserRoutes } from "../modules/user/user.routes";
import { AuthRoutes } from "../modules/auth/auth.routes";
import { DivisonRoutes } from "../modules/division/division.routes";
import { TourTypeRoutes } from "../modules/tourType/tourType.routes";
import { TourRoutes } from "../modules/tour/tour.routes";
import { BookingRoutes } from "../modules/booking/booking.routes";
import { PaymentRoutes } from "../modules/payment/payment.routes";
import { OtpRoutes } from "../modules/otp/otp.routes";
import { StatsRoutes } from "../modules/stats/stats.routes";

export const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },

  {
    path: "/division",
    route: DivisonRoutes,
  },
  {
    path: "/tourtype",
    route: TourTypeRoutes,
  },
  {
    path: "/tour",
    route: TourRoutes,
  }, 
  {
    path: "/booking",
    route: BookingRoutes,
  },
  
  {
    path: "/payment",
    route: PaymentRoutes
  },
   {
    path: "/otp",
    route: OtpRoutes
  }, {
    path: "/stats",
    route: StatsRoutes
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
