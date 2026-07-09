import type { NextFunction, Request, Response } from "express";
import cloudinary from "../config/cloudinary";
import { env } from "../config/env";

// Signed-upload pattern: the client uploads directly to Cloudinary using
// this signature, so raw files never pass through our API/server memory.
export async function signUpload(req: Request, res: Response, next: NextFunction) {
  try {
    const timestamp = Math.round(Date.now() / 1000);
    const folder = typeof req.body?.folder === "string" ? req.body.folder : "nexora";

    const signature = cloudinary.utils.api_sign_request(
      { timestamp, folder },
      env.cloudinary.apiSecret
    );

    res.json({
      timestamp,
      folder,
      signature,
      apiKey: env.cloudinary.apiKey,
      cloudName: env.cloudinary.cloudName,
    });
  } catch (err) {
    next(err);
  }
}
