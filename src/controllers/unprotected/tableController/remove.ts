import { Request, Response } from "express";

export const remove = async (
  req: Request<{ id: string }, {}, any>,
  res: Response,
  Model: any
) => {
  const { id } = req.params;

  const deletedTable = await Model.findOneAndUpdate(
    { _id: id },
    { removed: true },
    { new: true }
  );

  if (!deletedTable)
    return res.status(404).json({
      success: false,
      message: `${Model.modelName} not found`,
    });

  return res.status(200).json({
    success: true,
    message: `${Model.modelName} removed successfully`,
  });
};
