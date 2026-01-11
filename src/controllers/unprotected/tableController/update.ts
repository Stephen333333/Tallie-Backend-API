import { Response, Request } from "express";
import { Itable } from "@/types";
import { pickAllowedFields } from "@/helpers";

export const update = async (
  req: Request<
    {
      id: string;
    },
    {},
    Partial<Itable>
  >,
  res: Response,
  Model: any,
  allowedFields: (keyof Itable)[]
) => {
  const { id } = req.params;

  const updateData = pickAllowedFields<Itable>(req.body, allowedFields);

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
