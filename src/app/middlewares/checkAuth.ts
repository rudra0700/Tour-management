import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelper/AppError";
import { envVars } from "../config/env";
import httpStatus from "http-status-codes";
import jwt, { JwtPayload } from "jsonwebtoken";

const checkAuth = (...authRoles : string[]) => async (req : Request, res : Response, next : NextFunction) => {
     try {
      const token = req.headers.authorization;
      if (!token) {
        throw new AppError(httpStatus.FORBIDDEN, "Token not found");
      }

      const verifiedToken = jwt.verify(token, envVars.JWT_ACCESS_SECRET) as JwtPayload;
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