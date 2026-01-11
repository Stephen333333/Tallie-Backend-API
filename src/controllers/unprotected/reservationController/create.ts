import { Response, Request } from "express";
import { Ireservation } from "@/types";
import { Table } from "@/models";
import { pickAllowedFields } from "@/helpers";

export const create = async (
  req: Request<{}, {}, Ireservation>,
  res: Response,
  Model: any,
  allowedFields: (keyof Ireservation)[]
) => {
  const validatedReq = pickAllowedFields<Ireservation>(req.body, allowedFields);

  const {
    restaurantId,
    tableId,
    customerName,
    customerPhone,
    customerEmail,
    partySize,
    startTime,
    endTime,
  } = validatedReq;

  if (partySize == null || startTime == null || endTime == null) {
    return res.status(400).json({
      success: false,
      message: "partySize, startTime and endTime are required",
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

  if (new Date(startTime) >= new Date(endTime)) {
    return res.status(400).json({
      success: false,
      message: "End time must be after start time",
    });
  }

  const overlappingReservation = await Model.findOne({
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
      message:
        "Table " +
        table.tableNumber +
        " is already reserved for the selected time range",
    });
  }

  const result = await new Model({
    restaurantId,
    tableId,
    customerName,
    customerPhone,
    customerEmail,
    partySize,
    startTime,
    endTime,
  }).save();

  return res.status(201).json({
    success: true,
    result,
    message: Model.modelName + " created successfully",
  });
};
