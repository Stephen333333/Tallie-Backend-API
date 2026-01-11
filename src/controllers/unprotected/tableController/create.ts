import { Response, Request } from "express";
import { Itable } from "@/types/table";
import { pickAllowedFields } from "@/helpers";

export const create = async (
  req: Request<{}, {}, Itable>,
  res: Response,
  Model: any,
  allowedFields: (keyof Itable)[]
) => {
  const validatedReq = pickAllowedFields<Itable>(req.body, allowedFields);

  const result = await new Model(validatedReq).save();

  return res.status(201).json({
    success: true,
    result,
    message: Model.modelName + " created successfully",
  });
};
