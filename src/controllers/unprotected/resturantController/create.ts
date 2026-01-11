import { Response, Request } from "express";
import { Irestaurant } from "@/types";
import { pickAllowedFields } from "@/helpers";

export const create = async (
  req: Request<{}, {}, Irestaurant>,
  res: Response,
  Model: any,
  allowedFields: (keyof Irestaurant)[]
) => {

  const fomatedData = pickAllowedFields<Irestaurant>(req.body, allowedFields);

  const result = await new Model(fomatedData).save();

  return res.status(201).json({
    success: true,
    result,
    message: Model.modelName + " created successfully",
  });
};
