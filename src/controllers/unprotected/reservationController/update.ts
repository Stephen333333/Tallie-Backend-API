import { Response, Request } from "express";
import { Ireservation } from "@/types";
import { Table } from "@/models";

export const update = async (
  req: Request<{ id: string }, {}, Partial<Ireservation>>,
  res: Response,
  Model: any,
  allowedFields: (keyof Ireservation)[]
) => {
  const { id } = req.params;

  const existing = await Model.findById(id);
  if (!existing) {
    return res.status(404).json({
      success: false,
      message: Model.modelName + " not found",
    });
  }

  const restaurantId = req.body.restaurantId ?? existing.restaurantId;
  const tableId = req.body.tableId ?? existing.tableId;
  const partySize = req.body.partySize ?? existing.partySize;
  const startTime = req.body.startTime ?? existing.startTime;
  const endTime = req.body.endTime ?? existing.endTime;
  const status = req.body.status ?? existing.status;

  if (new Date(startTime) >= new Date(endTime)) {
    return res.status(400).json({
      success: false,
      message: "End time must be after start time",
    });
  }

  const table = await Table.findOne({
    _id: tableId,
    restaurantId,
    removed: false,
  });

  if (!table) {
    return res.status(400).json({
      success: false,
      message: "Table not found",
    });
  }

  if (table.capacity < partySize) {
    return res.status(400).json({
      success: false,
      message: `Table capacity of ${table.capacity} is less than party size of ${partySize}`,
    });
  }

  const overlappingReservation = await Model.findOne({
    _id: { $ne: id },
    tableId,
    restaurantId,
    removed: false,
    status: { $nin: ["cancelled", "completed"] },
    startTime: { $lt: endTime },
    endTime: { $gt: startTime },
  });

  if (overlappingReservation) {
    return res.status(409).json({
      success: false,
      message: `Table ${table.tableNumber} is already reserved for the selected time range`,
    });
  }

  const result = await Model.findByIdAndUpdate(
    id,
    {
      ...req.body,
      restaurantId,
      tableId,
      partySize,
      startTime,
      endTime,
      status,
    },
    { new: true }
  );

  return res.status(200).json({
    success: true,
    result,
    message: Model.modelName + " updated successfully",
  });
};
