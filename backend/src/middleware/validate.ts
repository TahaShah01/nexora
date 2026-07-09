import type { NextFunction, Request, Response } from "express";
import type { ZodTypeAny } from "zod";
import { ApiError } from "./errorHandler";

/**
 * Validates { body, query, params } against a Zod schema and writes the
 * parsed (defaulted/coerced) result back onto req — so schema defaults
 * (e.g. role: "buyer") actually reach the controller.
 */
export function validate(schema: ZodTypeAny) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse({ body: req.body, query: req.query, params: req.params });
    if (!result.success) {
      const message = result.error.errors
        .map((e) => `${e.path.slice(1).join(".")}: ${e.message}`)
        .join("; ");
      return next(new ApiError(400, message));
    }
    if (result.data.body) req.body = result.data.body;
    if (result.data.query) req.query = result.data.query;
    if (result.data.params) req.params = result.data.params;
    next();
  };
}
