import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelper/AppError";
import { envVars } from "../config/env";
import httpStatus from "http-status-codes";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../modules/user/user.model";
import { IsActive } from "../modules/user/user.interface";

const checkAuth = (...authRoles : string[]) => async (req : Request, res : Response, next : NextFunction) => {
     try {
      const token = req.headers.authorization;

      if (!token) {
        throw new AppError(httpStatus.FORBIDDEN, "Token not found");
      }

         const verifiedToken = jwt.verify(token, envVars.JWT_ACCESS_SECRET) as JwtPayload;
         const isUserExist = await User.findOne({ email: verifiedToken.email });

         if (!isUserExist) {
              throw new AppError(httpStatus.BAD_REQUEST, "User does not exist")
          }
      
          if (isUserExist.isActive === IsActive.BLOCKED || isUserExist.isActive === IsActive.INACTIVE) {
              throw new AppError(httpStatus.BAD_REQUEST, `User is ${isUserExist.isActive}`)
          }
      
          if (isUserExist.isDeleted) {
              throw new AppError(httpStatus.BAD_REQUEST, "User is deleted")
          }
      req.user = verifiedToken
      
      if (!authRoles.includes(verifiedToken.role)) {
        throw new AppError(
          httpStatus.FORBIDDEN,
          "You are not permitted this routes",
        );
      }

      next();
    } catch (error) {
      next(error);
    }
}

export default checkAuth;