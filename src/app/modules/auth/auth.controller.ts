/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";
import { setAuthCookie } from "../../utils/setCookie";
import AppError from "../../errorHelper/AppError";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";
import { createUserToken } from "../../utils/userTokens";

const credentialLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const loginInfo = await AuthServices.credentialLogin(req.body);
    
    setAuthCookie(res, loginInfo);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User logged in successfully",
      data: loginInfo,
    });
  },
);

const getNewAccessToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
     const refreshToken = req.cookies.refreshToken;
     
      if (!refreshToken) {
        throw new AppError(httpStatus.BAD_REQUEST, "No refresh token recieved from cookies")
    }

     const tokenInfo = await AuthServices.getNewAccessToken(refreshToken as string)

    setAuthCookie(res, tokenInfo)

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "AccessToken retrieved successfully",
      data: tokenInfo,
    });
  },
);

const logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  res.clearCookie('accessToken', {
    httpOnly: true,
    secure:false,
    sameSite: 'lax'
  }) 
  
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure:false,
    sameSite: 'lax'
  })

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User logged out successfully",
      data: null,
    });
  },
);

const resetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user;
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;

     await AuthServices.resetPassword(oldPassword, newPassword, decodedToken as JwtPayload)

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Change password successfully",
      data: null,
    });
  },
);

const googleCallbackController = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    let redirectTo = req.query.state ? req.query.state as string : "";
    if(redirectTo.startsWith("/")){
      redirectTo = redirectTo.slice(1);
    }
   const user = req.user;
    console.log(user);
    
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found")
    }
    
    const tokenInfo = createUserToken(user)

    setAuthCookie(res, tokenInfo)

    res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`)
  },
);

export const AuthControllers = {
  credentialLogin,
  getNewAccessToken,
  logout,
  resetPassword,
  googleCallbackController
};
