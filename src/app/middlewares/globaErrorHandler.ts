/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import AppError from "../errorHelper/AppError";
import { TErrorSources } from "../interfaces/error.types";
import { handlerDuplicateError } from "../helper/handleDuplicateError";
import { handleCastError } from "../helper/handleCastError";
import { handlerZodError } from "../helper/handleZodError";
import { handlerValidationError } from "../helper/handleValidationError";
import { deleteImageFromCLoudinary } from "../config/cloudinary.config";

const globalErrorHandler = async (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (envVars.NODE_ENV === "development") {
    console.log(err);
  }

  if (req.file) {
    await deleteImageFromCLoudinary(req.file.path);
  }

  if (req.files && Array.isArray(req.files) && req.files.length) {
    const imageUrls = (req.files as Express.Multer.File[]).map(
      (file) => file.path,
    );

    await Promise.all(imageUrls.map((url) => deleteImageFromCLoudinary(url)));
  }

  let statusCode = 500;
  let message = `Something went wrong`;
  let errorSources: TErrorSources[] = [];

  // Duplicate error
  if (err.code === 11000) {
    const simplifiedError = handlerDuplicateError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
  }
  // Cast error || Object Id error
  else if (err.name === "castError") {
    const simplifiedError = handleCastError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
  }
  // Mongoose validatation error
  else if (err.name === "ValidationError") {
    const simplifiedError = handlerValidationError(err);
    statusCode = simplifiedError.statusCode;
    errorSources = simplifiedError.errorSources as TErrorSources[];
    message = simplifiedError.message;
  }
  // Zod error
  else if (err.name === "ZodError") {
    const simplifiedError = handlerZodError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources as TErrorSources[];
  }
  // Customized app error
  else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }
  // Javascript class error
  else if (err instanceof Error) {
    statusCode = 500;
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message: message,
    errorSources,
    err: envVars.NODE_ENV === "development" ? err.stack : null,
    stack: envVars.NODE_ENV === "development" ? err.stack : null, // err obj and err.stack is almost similar
  });
};

export default globalErrorHandler;
