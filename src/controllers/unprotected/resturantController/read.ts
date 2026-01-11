import { Response, Request } from "express";

export const read = async (
  req: Request<{ id: string }>,
  res: Response,
  Model: any
) => {
  const result = await Model.findOne({
    _id: req.params.id,
    removed: false,
  }).exec();

  if (!result) {
    return res.status(404).json({
      success: false,
      result: null,
      message: "No document found ",
    });
  } else {
    return res.status(200).json({
      success: true,
      result,
      message: "we found this document ",
    });
  }
};
