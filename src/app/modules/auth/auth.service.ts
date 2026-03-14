import AppError from "../../errorHelper/AppError";
import { IUser } from "../user/user.interface";
import httpStatus from "http-status-codes";
import { User } from "../user/user.model";
import bcryptjs from "bcryptjs";
import { createNewAccessTokenUsingRefreshToken, createUserToken } from "../../utils/userTokens";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";

const credentialLogin = async (payload: Partial<IUser>) => {
  const { email, password  } = payload;

  const isUserExist = await User.findOne({ email });

  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User Already Exist");
  }

  const isPasswordMatch = await bcryptjs.compare(password as string, isUserExist.password as string);

  if(!isPasswordMatch){
    throw new AppError(httpStatus.BAD_REQUEST, "Incorrect Password");
   
  }

  const userTokens = createUserToken(isUserExist)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {password : pass, ...rest} = isUserExist.toObject()

  return {
     accessToken : userTokens.accessToken,
     refreshToken : userTokens.refreshToken,
     user: rest
  }
};

const getNewAccessToken = async (refreshToken : string) => {
   const newAccessToken = await createNewAccessTokenUsingRefreshToken(refreshToken);

   return {
    accessToken: newAccessToken
   }
}

const resetPassword = async (oldPassword : string, newPassword : string, decodedToken : JwtPayload) => {

    const user = await User.findById(decodedToken.userId)
    if(!user){
      throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    const isOldPasswordMatch = await bcryptjs.compare(oldPassword, user.password as string)
    if (!isOldPasswordMatch) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Old Password does not match");
    }

    user.password = await bcryptjs.hash(newPassword, Number(envVars.BCRYPT_SALT_ROUND))

    user.save();
}

export const AuthServices = {
  credentialLogin,
  getNewAccessToken,
  resetPassword
};
