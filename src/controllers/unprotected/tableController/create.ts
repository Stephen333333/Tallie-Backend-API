import { Response, Request } from "express";
import { Itable } from "@/types/table";
import { pickDefinedFields } from "@/helpers";

export const create = async (
  req: Request<{}, {}, Itable>,
  res: Response,
  Model: any,
  allowedFields: (keyof Itable)[]
) => {
  const fomatedData = pickDefinedFields<Itable>(req.body, allowedFields);

  const result = await new Model(fomatedData).save();

  return res.status(201).json({
    success: true,
    result,
    message: Model.modelName + " created successfully",
  });
};
