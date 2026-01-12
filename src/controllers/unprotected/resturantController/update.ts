import { Response, Request } from "express";
import { Irestaurant } from "@/types";
import { pickAllowedFields } from "@/helpers";

export const update = async (
  req: Request<
    {
      id: string;
    },
    {},
    Partial<Irestaurant>
  >,
  res: Response,
  Model: any,
  allowedFields: (keyof Irestaurant)[]
) => {
  const { id } = req.params;

  const validatedReq = pickAllowedFields<Irestaurant>(req.body, allowedFields);

  const result = await Model.findOneAndUpdate(
    { _id: id, removed: false },
    validatedReq,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!result) {
    return res.status(404).json({
      success: false,
      message: Model.modelName + " not found",
    });
  }

  return res.status(200).json({
    success: true,
    result: result,
    message: Model.modelName + " updated successfully",
  });
};
