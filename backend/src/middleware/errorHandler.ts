import type { NextFunction, Request, Response } from "express";

export class ApiError extends Error {
  statusCode: number;
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.path}` });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  let statusCode = 500;
  let message = "Internal server error";

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err.name === "ValidationError") {
    // Mongoose validation error
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val: any) => val.message)
      .join(", ");
  } else if (err.name === "CastError") {
    // Mongoose cast error (e.g. invalid ObjectId)
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  } else if (err.code === 11000) {
    // Mongo duplicate key error
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `An account or record with that ${field} already exists.`;
  } else if (err instanceof Error) {
    message = err.message;
  }

  if (statusCode === 500) {
    console.error(err);
  }

  res.status(statusCode).json({ error: message });
}
