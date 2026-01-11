import { Response, Request } from "express";
import { Irestaurant } from "@/types";
import { pickDefinedFields } from "@/helpers";

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

  const updateData = pickDefinedFields<Irestaurant>(req.body, allowedFields);

  const result = await Model.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  return res.status(200).json({
    success: true,
    result: result,
    message: Model.modelName + " updated successfully",
  });
};
